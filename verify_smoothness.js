const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--enable-webgl',
    '--window-size=1440,900',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9231/json/list', r => {
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
    await send('Page.navigate', { url: 'http://localhost:5173/' });
  };
  ws.onmessage = evt => {
    const msg = JSON.parse(evt.data);
    if (msg.id && cb.has(msg.id)) {
      cb.get(msg.id)(msg.result);
      cb.delete(msg.id);
    }
  };
  
  await new Promise(r => setTimeout(r, 6000));
  const res = await send('Runtime.evaluate', {
    expression: '(() => ({ hasLenis: !!window.lenis, isSmooth: window.lenis?.isSmooth, isStopped: window.lenis?.isStopped, scroll: window.lenis?.scroll, velocity: window.lenis?.velocity, rootClasses: document.documentElement.className, canvasExists: !!document.querySelector("#ijsk canvas") }))()',
    returnByValue: true
  });
  console.log('SMOOTHNESS VERIFICATION:', JSON.stringify(res.result.value, null, 2));

  // Test scrolling with Lenis
  await send('Runtime.evaluate', {
    expression: 'window.lenis.scrollTo(600, { duration: 1.2 })'
  });
  await new Promise(r => setTimeout(r, 400));
  const midScroll = await send('Runtime.evaluate', {
    expression: '(() => ({ scroll: window.lenis?.scroll, windowScrollY: window.scrollY, velocity: window.lenis?.velocity }))()',
    returnByValue: true
  });
  console.log('MID-SCROLL (Interpolating smoothly):', JSON.stringify(midScroll.result.value, null, 2));

  await new Promise(r => setTimeout(r, 1200));
  const endScroll = await send('Runtime.evaluate', {
    expression: '(() => ({ scroll: window.lenis?.scroll, windowScrollY: window.scrollY }))()',
    returnByValue: true
  });
  console.log('END-SCROLL (Settled at target):', JSON.stringify(endScroll.result.value, null, 2));

  ws.close();
  chrome.kill();
}
test().catch(console.error);
