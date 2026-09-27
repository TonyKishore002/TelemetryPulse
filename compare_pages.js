const { spawn } = require('child_process');
const http = require('http');

async function check() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9228/json/list', r => {
    let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d)));
  }).on('error', rej));
  const page = list[0];
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
  ws.onopen = async () => {
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'https://creativemarketing.peachweb.io/' });
  };
  ws.onmessage = evt => {
    const msg = JSON.parse(evt.data);
    if (msg.id && cb.has(msg.id)) {
      cb.get(msg.id)(msg.result);
      cb.delete(msg.id);
    }
  };
  
  await new Promise(r => setTimeout(r, 8000));
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const pwKeys = Object.keys(window).filter(k => k.startsWith('_pw') || k.toLowerCase().includes('peach') || k.toLowerCase().includes('lenis') || k.toLowerCase().includes('scroll'));
      const scripts = Array.from(document.scripts).map(s => s.src);
      const canvas = document.querySelector('canvas');
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const bodyStyle = window.getComputedStyle(document.body);
      return {
        pwKeys,
        scripts,
        canvasPresent: !!canvas,
        htmlScrollBehavior: htmlStyle.scrollBehavior,
        htmlOverflow: htmlStyle.overflow,
        bodyOverflow: bodyStyle.overflow,
        htmlScrollbarWidth: htmlStyle.scrollbarWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('PEACHWEB DETAILS:', JSON.stringify(res.result.value, null, 2));

  // Now navigate to local
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 6000));
  const resLocal = await send('Runtime.evaluate', {
    expression: `(() => {
      const pwKeys = Object.keys(window).filter(k => k.startsWith('_pw') || k.toLowerCase().includes('peach') || k.toLowerCase().includes('lenis') || k.toLowerCase().includes('scroll'));
      const scripts = Array.from(document.scripts).map(s => s.src);
      const canvas = document.querySelector('canvas');
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const bodyStyle = window.getComputedStyle(document.body);
      return {
        pwKeys,
        scripts,
        canvasPresent: !!canvas,
        htmlScrollBehavior: htmlStyle.scrollBehavior,
        htmlOverflow: htmlStyle.overflow,
        bodyOverflow: bodyStyle.overflow,
        htmlScrollbarWidth: htmlStyle.scrollbarWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('LOCAL DETAILS:', JSON.stringify(resLocal.result.value, null, 2));

  ws.close();
  chrome.kill();
}
check().catch(console.error);
