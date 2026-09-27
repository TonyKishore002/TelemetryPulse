const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9255',
    '--user-data-dir=C:\\Users\\Tony K\\.gemini\\antigravity-ide\\brain\\28245a52-2ad4-4680-a663-b88e2255b364\\scratch\\chrome_test_profile_scroll',
    '--window-size=1440,900',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9255/json/list', r => {
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
  
  await new Promise(r => setTimeout(r, 4000));

  // Click Launch SRE Workstation button
  await send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `(async () => {
      const el = document.getElementById('i1lwz-2-2-2-2-2-2');
      if (el) el.click();
      await new Promise(r => setTimeout(r, 1000));
    })()`
  });

  await new Promise(r => setTimeout(r, 1500));

  // Inspect scroll elements and lenis state on workstation
  const scrollInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const main = document.querySelector('main');
      const root = document.getElementById('root');
      return {
        url: window.location.href,
        hasLenis: !!window.lenis,
        lenisIsStopped: window.lenis ? window.lenis.isStopped : null,
        htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
        bodyOverflow: window.getComputedStyle(document.body).overflow,
        rootOverflow: root ? window.getComputedStyle(root).overflow : null,
        mainFound: !!main,
        mainOverflowY: main ? window.getComputedStyle(main).overflowY : null,
        mainScrollHeight: main ? main.scrollHeight : 0,
        mainClientHeight: main ? main.clientHeight : 0,
        mainScrollTop: main ? main.scrollTop : 0,
        windowScrollY: window.scrollY,
        windowHeight: window.innerHeight
      };
    })()`,
    returnByValue: true
  });
  console.log('SCROLL INFO:', JSON.stringify(scrollInfo.result.value, null, 2));

  // Try dispatching synthetic wheel event on main
  const wheelTest = await send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `(async () => {
      const main = document.querySelector('main');
      if (!main) return { error: 'No main' };
      const before = main.scrollTop;
      main.scrollTop += 200;
      const afterDirect = main.scrollTop;

      // Dispatch wheel
      const evt = new WheelEvent('wheel', { deltaY: 300, bubbles: true, cancelable: true });
      const notCancelled = main.dispatchEvent(evt);

      return {
        before,
        afterDirect,
        wheelNotCancelled: notCancelled,
        mainScrollTopNow: main.scrollTop
      };
    })()`,
    returnByValue: true
  });
  console.log('WHEEL TEST:', JSON.stringify(wheelTest.result.value, null, 2));

  ws.close();
  chrome.kill();
}
test().catch(console.error);
