/* =============================================
   Sliding Window — The Ice Cream Truck Route 🍦
   INTERACTIVE: Drag the window left/right to find
   the neighborhood with the most ice cream sales!
   ============================================= */
(() => {
  const SALES = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  const K = 3;  // window size

  function injectStyles() {
    if (document.getElementById('sw-game-styles')) return;
    const s = document.createElement('style');
    s.id = 'sw-game-styles';
    s.textContent = `
      .sw-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:14px 20px 16px;gap:11px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a0533 0%,#0d1a2e 60%,#0a1a10 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .sw-title{font-size:17px;font-weight:900;color:#fb923c;text-shadow:0 0 20px rgba(251,146,60,.4);z-index:1;}
      .sw-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:8px 16px;max-width:620px;width:100%;font-size:13px;line-height:1.55;color:#c4c9e8;text-align:center;z-index:1;}
      .sw-target{background:rgba(251,146,60,.12);border:2px solid rgba(251,146,60,.35);border-radius:20px;
        padding:4px 18px;color:#fb923c;font-size:13px;font-weight:800;z-index:1;}
      .sw-board{position:relative;z-index:1;width:100%;max-width:680px;}
      .sw-houses{display:flex;gap:4px;margin-bottom:2px;padding:0 2px;}
      .sw-house{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;}
      .sw-house-fig{font-size:24px;transition:transform .25s;}
      .sw-house.in-win .sw-house-fig{transform:scale(1.18);filter:drop-shadow(0 0 8px rgba(251,146,60,.7));}
      .sw-bar-wrap{width:100%;height:54px;display:flex;align-items:flex-end;justify-content:center;}
      .sw-bar{width:80%;border-radius:4px 4px 0 0;transition:height .3s,background .3s;background:#1e293b;}
      .sw-house.in-win .sw-bar{background:linear-gradient(to top,#f97316,#fbbf24)!important;}
      .sw-house.best-win .sw-bar{background:linear-gradient(to top,#16a34a,#4ade80)!important;}
      .sw-val{font-size:11px;font-weight:800;color:#8892b0;transition:color .3s;}
      .sw-house.in-win .sw-val{color:#fb923c;}
      .sw-house.best-win .sw-val{color:#4ade80;}
      .sw-idx{font-size:9px;color:#374151;}
      .sw-window-track{height:14px;display:flex;gap:4px;padding:0 2px;margin-top:1px;}
      .sw-window-cell{flex:1;border-radius:3px;background:transparent;transition:background .3s;}
      .sw-window-cell.in-win{background:rgba(251,146,60,.25);border-bottom:2px solid #fb923c;}
      .sw-sum-area{display:flex;align-items:center;gap:14px;z-index:1;flex-wrap:wrap;justify-content:center;}
      .sw-sum-box{background:rgba(251,146,60,.1);border:2px solid rgba(251,146,60,.3);border-radius:16px;
        padding:10px 24px;text-align:center;transition:all .3s;}
      .sw-sum-box.is-best{background:rgba(74,222,128,.15);border-color:#4ade80;}
      .sw-sum-val{font-size:26px;font-weight:900;color:#fb923c;transition:color .3s;}
      .sw-sum-box.is-best .sw-sum-val{color:#4ade80;}
      .sw-sum-lbl{font-size:10px;color:#6b7280;}
      .sw-best-box{background:rgba(74,222,128,.1);border:2px solid rgba(74,222,128,.3);border-radius:16px;
        padding:10px 24px;text-align:center;}
      .sw-best-val{font-size:26px;font-weight:900;color:#4ade80;}
      .sw-pos-box{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;
        padding:8px 16px;text-align:center;}
      .sw-pos-val{font-size:18px;font-weight:900;color:#e2e8f0;}
      .sw-btns{display:flex;gap:10px;z-index:1;}
      .sw-btn{padding:11px 26px;border-radius:12px;border:none;cursor:pointer;font-size:14px;font-weight:800;
        box-shadow:0 4px 14px rgba(0,0,0,.3);transition:all .2s;}
      .sw-btn:hover:not(:disabled){transform:translateY(-3px);}
      .sw-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
      .btn-left{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;}
      .btn-right{background:linear-gradient(135deg,#b45309,#f97316);color:#fff;}
      .btn-reset{background:linear-gradient(135deg,#374151,#6b7280);color:#fff;padding:11px 18px;}
      .sw-msg{font-size:12.5px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:20px;}
      .sw-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
      .sw-win-big{font-size:64px;animation:wBounce .6s ease-out infinite alternate;}
      @keyframes wBounce{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .sw-win-h1{font-size:24px;font-weight:900;color:#fb923c;}
      .sw-win-p{color:#c4c9e8;font-size:13px;max-width:380px;text-align:center;line-height:1.6;}
      .sw-win-btn{padding:10px 26px;background:linear-gradient(135deg,#b45309,#f97316);border:none;
        border-radius:12px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
      .conf{position:absolute;width:8px;height:8px;border-radius:2px;pointer-events:none;
        animation:confFall var(--d) var(--dl) ease-in forwards;z-index:200;}
      @keyframes confFall{0%{transform:translate(0,-10px) rotate(0);opacity:1}100%{transform:translate(var(--ex),400px) rotate(540deg);opacity:0}}
    .hw-btn{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;
      background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#a0aec0;
      font-size:14px;cursor:pointer;z-index:50;display:flex;align-items:center;justify-content:center;
      transition:all .2s;}
    .hw-btn:hover{background:rgba(255,255,255,.22);color:#fff;}
    .hw-panel{position:absolute;top:44px;right:10px;width:260px;
      background:rgba(15,20,40,.97);border:1px solid rgba(255,255,255,.15);border-radius:12px;
      padding:14px 16px;z-index:51;animation:hwFade .2s ease-out;font-family:Nunito,sans-serif;}
    @keyframes hwFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
    .hw-title{font-size:12px;font-weight:900;color:#facc15;margin-bottom:8px;letter-spacing:.3px;}
    .hw-body{font-size:11.5px;color:#c4c9e8;line-height:1.6;}
    .hw-body ul{margin:4px 0 8px 16px;padding:0;}
    .hw-body li{margin-bottom:3px;}
    .hw-insight{font-size:11px;color:#86efac;border-top:1px solid rgba(255,255,255,.1);
      padding-top:7px;margin-top:4px;}
    `;
    document.head.appendChild(s);
  }

  function init(container, opts) {
    const { updateStepIndicator, onComplete } = opts;
    injectStyles();

    const maxVal = Math.max(...SALES);
    let winStart = 0;
    let bestStart = -1;
    let bestSum = -Infinity;
    let exploreCount = 0;
    const visitedPositions = new Set([0]);
    const startTime = Date.now();

    function winSum(s) { return SALES.slice(s, s + K).reduce((a, b) => a + b, 0); }
    const maxStart = SALES.length - K;

    container.innerHTML = `
      <div class="sw-root" id="sw-root">
        <div class="sw-title">🍦 The Ice Cream Truck Route</div>
        <div class="sw-story">
          🚚 <strong>Tony the Truck</strong> can only visit <strong>${K} houses</strong> at a time.
          Help him find the <strong style="color:#fb923c">neighborhood with the most ice cream sales</strong>!
          Slide the window left or right to explore.
        </div>
        <div class="sw-target">🎯 Window size: <strong>${K} houses</strong> — find the best spot!</div>
        <div class="sw-board">
          <div class="sw-houses" id="sw-houses"></div>
          <div class="sw-window-track" id="sw-track"></div>
        </div>
        <div class="sw-sum-area">
          <div class="sw-sum-box" id="sw-sum-box">
            <div class="sw-sum-val" id="sw-cur-sum">-</div>
            <div class="sw-sum-lbl">Current Window Sum</div>
          </div>
          <div class="sw-best-box">
            <div class="sw-best-val" id="sw-best-val">-</div>
            <div class="sw-sum-lbl">Best Sum Found</div>
          </div>
          <div class="sw-pos-box">
            <div class="sw-pos-val" id="sw-pos-val">Houses 0–${K-1}</div>
            <div class="sw-sum-lbl">Window Position</div>
          </div>
        </div>
        <div class="sw-btns">
          <button class="sw-btn btn-left" id="sw-left" aria-label="Slide window one position left">← Slide Left</button>
          <button class="sw-btn btn-right" id="sw-right" aria-label="Slide window one position right">Slide Right →</button>
          <button class="sw-btn btn-reset" id="sw-reset" aria-label="Reset to start position">🔄</button>
        </div>
        <div class="sw-msg" id="sw-msg">👇 Slide the window to find Tony's best route!</div>
      </div>`;

    const root = container.querySelector('#sw-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Sliding Window maintains a fixed-size window moving across an array to find an optimal subarray.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Slide the window left or right across the ice cream houses.</li><li>The sum updates as the window moves (drop left, add right).</li><li>Explore ALL positions to find the best sum!</li></ul><div class="hw-insight">💡 Key insight: Fixed window + slide = O(n) instead of O(n²) brute force.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#sw-left').addEventListener('click', () => move(-1));
    container.querySelector('#sw-right').addEventListener('click', () => move(1));
    container.querySelector('#sw-reset').addEventListener('click', doReset);

    render();
    updateStepIndicator(1, SALES.length - K + 1);

    function move(dir) {
      const newStart = winStart + dir;
      if (newStart < 0 || newStart > maxStart) return;
      winStart = newStart;
      exploreCount++;
      visitedPositions.add(winStart);
      const cur = winSum(winStart);
      if (cur > bestSum) {
        bestSum = cur;
        bestStart = winStart;
      }
      render();
      const msg = container.querySelector('#sw-msg');
      if (winStart === bestStart) {
        msg.innerHTML = `⭐ <strong style="color:#4ade80">This is the best spot so far!</strong> Sum = ${cur}`;
      } else {
        msg.innerHTML = `Sum here = ${cur}. Best = ${bestSum} at houses ${bestStart}–${bestStart+K-1}. Keep exploring!`;
      }
      updateStepIndicator(winStart + 1, SALES.length - K + 1);
      if (visitedPositions.size >= maxStart + 1 && bestStart >= 0) {
        setTimeout(celebrate, 500);
      }
    }

    function render() {
      const housesEl = container.querySelector('#sw-houses');
      const trackEl  = container.querySelector('#sw-track');
      const cur = winSum(winStart);
      housesEl.innerHTML = ''; trackEl.innerHTML = '';

      SALES.forEach((v, i) => {
        const inWin = i >= winStart && i < winStart + K;
        const isBest = bestStart >= 0 && i >= bestStart && i < bestStart + K;
        const h = document.createElement('div');
        h.className = 'sw-house' + (isBest ? ' best-win' : inWin ? ' in-win' : '');
        const barH = Math.round((v / maxVal) * 44);
        h.innerHTML = `
          <div class="sw-house-fig">${['🏠','🏡','🏘️'][i%3]}</div>
          <div class="sw-bar-wrap"><div class="sw-bar" style="height:${barH}px"></div></div>
          <div class="sw-val">${v}🍦</div>
          <div class="sw-idx">[${i}]</div>`;
        housesEl.appendChild(h);
        const tc = document.createElement('div');
        tc.className = 'sw-window-cell' + (inWin ? ' in-win' : '');
        trackEl.appendChild(tc);
      });

      container.querySelector('#sw-cur-sum').textContent = cur;
      container.querySelector('#sw-best-val').textContent = bestSum === -Infinity ? '-' : bestSum;
      container.querySelector('#sw-pos-val').textContent = `Houses ${winStart}–${winStart+K-1}`;
      const sumBox = container.querySelector('#sw-sum-box');
      sumBox.classList.toggle('is-best', bestStart === winStart && bestSum !== -Infinity);
      container.querySelector('#sw-left').disabled = winStart === 0;
      container.querySelector('#sw-right').disabled = winStart === maxStart;
    }

    function doReset() {
      winStart = 0; bestStart = -1; bestSum = -Infinity; exploreCount = 0;
      visitedPositions.clear(); visitedPositions.add(0);
      container.querySelector('#sw-msg').textContent = '👇 Slide the window to find Tony\'s best route!';
      container.querySelectorAll('.sw-win').forEach(e => e.remove());
      render();
      updateStepIndicator(1, SALES.length - K + 1);
    }

    function celebrate() {
      const elapsed = Date.now() - startTime;
      const colors=['#fb923c','#facc15','#4ade80','#60a5fa','#f472b6'];
      for(let i=0;i<45;i++){
        const p=document.createElement('div'); p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.9+Math.random()*.7}s;--dl:${Math.random()*.4}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p); setTimeout(()=>p.remove(),1800);
      }
      const ov = document.createElement('div');
      ov.className = 'sw-win';
      const bestArr = SALES.slice(bestStart, bestStart + K);
      ov.innerHTML = `
        <div class="sw-win-big">🍦</div>
        <div class="sw-win-h1">Best Route Found!</div>
        <div class="sw-win-p">
          Houses <strong style="color:#fb923c">${bestStart}–${bestStart+K-1}</strong> with
          sum <strong style="color:#facc15">${bestSum}</strong>!<br>
          (${bestArr.join(' + ')} = ${bestSum})<br>
          <small style="color:#8892b0">Sliding Window moves in O(n) — way faster than checking all pairs!</small>
        </div>
        <button class="sw-win-btn" id="sw-replay">🔄 Drive Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#sw-replay').addEventListener('click', () => { ov.remove(); doReset(); });
      onComplete && onComplete(3, elapsed);
    }

    app.registerSim('sliding-window', {
      init,
      nextStep: () => move(1),
      prevStep: () => move(-1),
      setMode: () => {}
    });
  }
})();