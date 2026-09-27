const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-extensions',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9230/json/list', r => {
    let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d)));
  }).on('error', rej));
  const page = list.find(p => p.type === 'page' && !p.url.startsWith('chrome-extension')) || list[0];
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
  ws.onmessage = evt => {
    const msg = JSON.parse(evt.data);
    if (msg.id && cb.has(msg.id)) {
      cb.get(msg.id)(msg.result);
      cb.delete(msg.id);
    }
  };
  await new Promise(res => {
    ws.onopen = async () => {
      await send('Runtime.enable');
      await send('Page.enable');
      res();
    };
  });

  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 4000));

  const localRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById("ilwyn-2-2");
      const cs = el ? window.getComputedStyle(el) : null;
      return {
        id: el?.id,
        bg: cs?.backgroundColor,
        color: cs?.color,
        display: cs?.display
      };
    })()`,
    returnByValue: true
  });
  console.log('LOCAL ILWYN-2-2:', localRes.result.value);

  await send('Page.navigate', { url: 'https://creativemarketing.peachweb.io/' });
  await new Promise(r => setTimeout(r, 6000));

  const liveRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById("ilwyn-2-2");
      const cs = el ? window.getComputedStyle(el) : null;
      return {
        id: el?.id,
        bg: cs?.backgroundColor,
        color: cs?.color,
        display: cs?.display
      };
    })()`,
    returnByValue: true
  });
  console.log('LIVE ILWYN-2-2:', liveRes.result.value);

  ws.close();
  chrome.kill();
}
test().catch(console.error);
