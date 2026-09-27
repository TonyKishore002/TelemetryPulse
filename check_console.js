const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--user-data-dir=C:\\Users\\Tony K\\.gemini\\antigravity-ide\\brain\\28245a52-2ad4-4680-a663-b88e2255b364\\scratch\\chrome_test_profile',
    '--enable-webgl',
    '--window-size=1440,900',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9233/json/list', r => {
    let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d)));
  }).on('error', rej));
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const cb = new Map();
  function send(m, p={}) {
    return new Promise(r => {
      const mid = id++;
      cb.set(mid, r);
      ws.send(JSON.stringify({id:mid, method:m, params:p}));
    });
  }

  const logs = [];
  ws.onmessage = evt => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      logs.push({ type: msg.params.type, args: msg.params.args.map(a => a.value || a.description) });
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      logs.push({ type: 'EXCEPTION', text: msg.params.exceptionDetails.text, exception: msg.params.exceptionDetails.exception });
    }
    if (msg.id && cb.has(msg.id)) {
      cb.get(msg.id)(msg.result);
      cb.delete(msg.id);
    }
  };

  ws.onopen = async () => {
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:5173/' });
  };
  
  await new Promise(r => setTimeout(r, 6000));
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const hasLenis = !!window.lenis;
      let lenisProps = null;
      if (hasLenis) {
        lenisProps = {
          scroll: window.lenis.scroll,
          limit: window.lenis.limit,
          velocity: window.lenis.velocity,
          direction: window.lenis.direction,
          isSmooth: window.lenis.isSmooth,
          isScrolling: window.lenis.isScrolling
        };
      }
      return {
        url: window.location.href,
        title: document.title,
        hasLenis,
        lenisProps,
        canvasMounted: !!canvas,
        canvasSize: canvas ? { width: canvas.width, height: canvas.height } : null,
        bodyHeight: document.body.scrollHeight,
        windowHeight: window.innerHeight
      };
    })()`,
    returnByValue: true
  });
  console.log('PAGE EVAL:', JSON.stringify(evalRes.result.value, null, 2));

  // Now test smooth scrolling progression and check WebGL frame updates
  const scrollTest = await send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `new Promise(resolve => {
      if (!window.lenis) return resolve({ error: 'no lenis' });
      const samples = [];
      const startTime = performance.now();
      let scrollEventsCount = 0;
      const unbind = window.lenis.on('scroll', (e) => {
        scrollEventsCount++;
      });
      window.lenis.scrollTo(1200, { duration: 1.2 });
      const interval = setInterval(() => {
        samples.push({
          time: Math.round(performance.now() - startTime),
          scroll: Math.round(window.lenis.scroll),
          velocity: Number(window.lenis.velocity.toFixed(3)),
          eventsFired: scrollEventsCount
        });
        if (performance.now() - startTime > 1300) {
          clearInterval(interval);
          unbind();
          resolve({ samples, totalScrollEvents: scrollEventsCount });
        }
      }, 100);
    })`,
    returnByValue: true
  });
  console.log('SCROLL TEST PROGRESSION:', JSON.stringify(scrollTest.result.value, null, 2));
  console.log('CONSOLE LOGS:', JSON.stringify(logs.filter(l => l.type === 'error' || l.type === 'EXCEPTION' || l.args.some(a => String(a).includes('Lenis'))), null, 2));

  ws.close();
  chrome.kill();
}
test().catch(console.error);
