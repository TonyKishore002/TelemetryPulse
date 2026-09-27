const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const page = list.find(p => p.type === 'page') || list[0];
  console.log('Connecting to target:', page.webSocketDebuggerUrl);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onopen = async () => {
    console.log('CDP WebSocket opened');
    await send('Network.enable');
    await send('Runtime.enable');
    await send('Console.enable');

    await send('Page.navigate', { url: 'http://localhost:5173/' });
  };

  ws.onmessage = async (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result);
      callbacks.delete(msg.id);
    }
    if (msg.method === 'Console.messageAdded') {
      console.log('CONSOLE:', msg.params.message.level, msg.params.message.text);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      console.log('RUNTIME CONSOLE:', msg.params.type, args);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
    }
    if (msg.method === 'Network.responseReceived') {
      const res = msg.params.response;
      console.log('RES:', res.status, res.url);
    }
    if (msg.method === 'Network.loadingFailed') {
      console.error('NET FAILED:', msg.params.errorText, msg.params.type);
    }
  };

  await new Promise(r => setTimeout(r, 6000));

  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const b = window.__builder;
        const s = window.__sceneState;
        const canvas = document.querySelector('canvas');

        let sceneInfo = null;
        if (b) {
          try {
            const scene = b.getActiveScene ? b.getActiveScene() : null;
            const camera = b.getActiveCamera ? b.getActiveCamera() : null;
            const allObjs = b.getAllObjects ? b.getAllObjects() : null;
            const renderer = b.renderer;
            let renderedOk = false;
            try {
              if (renderer && scene && camera) {
                renderer.render(scene, camera);
                renderedOk = true;
              }
            } catch(e) {
              renderedOk = e.message;
            }

            const elAtPoint = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
            const root = document.getElementById('root');
            const bodyWrap = document.getElementById('pwb-body-wrap');
            const ip1j = document.getElementById('ip1j');

            sceneInfo = {
              hasScene: !!scene,
              sceneChildrenCount: scene ? scene.children.length : null,
              sceneChildrenNames: scene ? scene.children.map(c => c.name || c.type) : null,
              cameraType: camera ? camera.type : null,
              cameraPos: camera ? { x: camera.position.x, y: camera.position.y, z: camera.position.z } : null,
              calls: renderer ? renderer.info.render.calls : null,
              triangles: renderer ? renderer.info.render.triangles : null,
              frame: renderer ? renderer.info.render.frame : null,
              forceRenderResult: renderedOk,
              elAtCenter: elAtPoint ? (elAtPoint.tagName + '#' + elAtPoint.id + '.' + elAtPoint.className) : null,
              bodyBg: window.getComputedStyle(document.body).backgroundColor,
              rootBg: root ? window.getComputedStyle(root).backgroundColor : null,
              bodyWrapBg: bodyWrap ? window.getComputedStyle(bodyWrap).backgroundColor : null,
              ip1jBg: ip1j ? window.getComputedStyle(ip1j).backgroundColor : null
            };
          } catch(err) {
            sceneInfo = { error: err.message };
          }
        }

        return {
          hasBuilder: !!b,
          hasSceneState: !!s,
          sceneInfo: sceneInfo,
          canvasRect: canvas ? { width: canvas.offsetWidth, height: canvas.offsetHeight } : null,
          hasLenis: !!window.lenis
        };
      })()
    `,
    returnByValue: true
  });

  console.log('PAGE EVAL RESULT:', evalResult?.result?.value);

  // Test scroll
  console.log('Testing scroll with Lenis...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        if (window.lenis) {
          window.lenis.scrollTo(1200, { immediate: true });
        } else {
          window.scrollTo(0, 1200);
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  const scrollScreenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (scrollScreenshot?.data) {
    fs.writeFileSync('d:\\Hackathons\\TelemetryPulse\\scroll_screenshot.png', Buffer.from(scrollScreenshot.data, 'base64'));
    console.log('Saved scroll_screenshot.png at scroll 1200');
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('CDP script error:', err);
  process.exit(1);
});
