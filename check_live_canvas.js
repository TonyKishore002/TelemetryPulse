const { spawn } = require('child_process');
const http = require('http');

async function check() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9224/json/list', r => {
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
      const c = document.querySelector('#ijsk canvas');
      const wrap = document.querySelector('#pwb-loading-wrap');
      return {
        hasCanvas: !!c,
        canvasWidth: c?.clientWidth,
        canvasHeight: c?.clientHeight,
        loadingWrapDisplay: wrap ? window.getComputedStyle(wrap).display : null,
        loadingWrapOpacity: wrap ? window.getComputedStyle(wrap).opacity : null,
        bodyHeight: document.body.scrollHeight,
        windowScrollY: window.scrollY
      };
    })()`,
    returnByValue: true
  });
  console.log('LIVE CANVAS RESULT:', JSON.stringify(res.result.value, null, 2));
  ws.close();
  chrome.kill();
}
check().catch(console.error);
