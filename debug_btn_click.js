const { spawn } = require('child_process');
const http = require('http');

(async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9231', '--no-sandbox', 'about:blank']);
  await new Promise(r => setTimeout(r, 1200));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9231/json/list', r => { let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d))); }).on('error', rej));
  const page = list.find(p => p.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1; const cb = new Map();
  function send(m, p={}) { return new Promise(r => { const mid = id++; cb.set(mid, r); ws.send(JSON.stringify({id:mid, method:m, params:p})); }); }
  ws.onmessage = evt => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('BROWSER CONSOLE:', msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.id && cb.has(msg.id)) {
      cb.get(msg.id)(msg.result);
      cb.delete(msg.id);
    }
  };
  await new Promise(r => { ws.onopen = async () => { await send('Runtime.enable'); await send('Page.enable'); await send('Page.navigate', { url: 'http://localhost:5173/' }); r(); }; });
  await new Promise(r => setTimeout(r, 4000));
  
  const docRes = await send('DOM.getDocument');
  const rootNode = await send('DOM.querySelector', { nodeId: docRes.root.nodeId, selector: '#root' });
  const rootObj = await send('DOM.resolveNode', { nodeId: rootNode.nodeId });
  const rootListeners = await send('DOMDebugger.getEventListeners', { objectId: rootObj.object.objectId });
  console.log('ROOT LISTENERS:', rootListeners.listeners.map(l => ({ type: l.type, useCapture: l.useCapture })));

  const winObj = await send('Runtime.evaluate', { expression: 'window' });
  const winListeners = await send('DOMDebugger.getEventListeners', { objectId: winObj.result.objectId });
  console.log('WINDOW LISTENERS:', winListeners.listeners.map(l => ({ type: l.type, useCapture: l.useCapture })));

  const docObj = await send('Runtime.evaluate', { expression: 'document' });
  const docListeners = await send('DOMDebugger.getEventListeners', { objectId: docObj.result.objectId });
  console.log('DOC LISTENERS:', docListeners.listeners.map(l => ({ type: l.type, useCapture: l.useCapture })));
  
  const testClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('i1lwz-2-2-2-2-2-2');
      const p = document.getElementById('ispyh-2-3-2-2-2-2');
      const propKey = Object.keys(btn || {}).find(k => k.startsWith('__reactProps'));
      const props = btn ? btn[propKey] : null;
      return {
        btnFound: !!btn,
        pFound: !!p,
        btnHasOnClick: typeof props?.onClick === 'function',
        pHasOnClick: typeof p?.[propKey]?.onClick === 'function'
      };
    })()`,
    returnByValue: true
  });
  console.log('testClick check:', testClick.result.value);

  // Now trigger the click via real CDP Input.dispatchMouseEvent
  const btnBox = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('i1lwz-2-2-2-2-2-2');
      const r = btn.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    })()`,
    returnByValue: true
  });
  const mouseClickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const p = document.getElementById('ispyh-2-3-2-2-2-2');
      const img = document.getElementById('i9hq34-2-2-3-2-2-2');
      const btn = document.getElementById('i1lwz-2-2-2-2-2-2');
      const r = btn.getBoundingClientRect();
      const elBefore = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      if (p) p.style.pointerEvents = 'none';
      if (img) img.style.pointerEvents = 'none';
      const elAfter = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      return {
        btnRect: r,
        elBefore: elBefore?.id || elBefore?.tagName,
        elAfter: elAfter?.id || elAfter?.tagName
      };
    })()`,
    returnByValue: true
  });
  const traceAncestors = await send('Runtime.evaluate', {
    expression: `(() => {
      try {
        const btn = document.getElementById('i1lwz-2-2-2-2-2-2');
        console.log('BTN tag:', btn.tagName);
        btn.addEventListener('click', e => console.log('Direct click listener fired on btn!'));
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
        const res = btn.dispatchEvent(ev);
        console.log('dispatchEvent returned:', res);
        return { ok: true, res };
      } catch (e) {
        console.error('ERROR in dispatchEvent:', e);
        return { error: e.message };
      }
    })()`,
    returnByValue: true
  });
  console.log('traceAncestors:', traceAncestors.result.value);

  await new Promise(r => setTimeout(r, 1000));
  const urlAfter = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
  console.log('URL after dispatchEvent:', urlAfter.result.value);

  ws.close(); chrome.kill();
})();
