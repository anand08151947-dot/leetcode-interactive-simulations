/* =============================================
   BFS — Puppy Rescue Mission 🐾
   INTERACTIVE: Click "Spread Next Wave!" to
   advance BFS one level. Find the lost puppy!
   ============================================= */
(() => {
  const ROWS = 7, COLS = 9;
  const START = {r:3, c:0};
  const GOAL  = {r:1, c:7};
  // 0=free, 1=wall
  const WALLS = new Set([
    '1,1','1,2','2,4','3,2','3,3','3,6','4,1','4,5','5,2','5,6','5,7','6,4','0,3','0,5','2,7','4,7'
  ]);
  const key = (r,c) => `${r},${c}`;
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];

  function injectStyles() {
    if (document.getElementById('bfs-game-styles')) return;
    const s = document.createElement('style');
    s.id = 'bfs-game-styles';
    s.textContent = `
      .bfs-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 16px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a2e1a 0%,#0d1f36 50%,#0a0a2e 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .bfs-hud{display:flex;align-items:center;gap:10px;width:100%;max-width:700px;z-index:1;}
      .bfs-title{font-size:16px;font-weight:900;color:#34d399;text-shadow:0 0 20px rgba(52,211,153,.4);flex:1;text-align:center;}
      .bfs-wave-badge{background:rgba(52,211,153,.15);border:1px solid rgba(52,211,153,.35);border-radius:20px;padding:3px 12px;font-size:12px;color:#34d399;font-weight:800;}
      .bfs-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .bfs-area{display:flex;gap:16px;align-items:flex-start;z-index:1;width:100%;max-width:720px;justify-content:center;}
      .bfs-grid-wrap{display:grid;gap:3px;}
      .bfs-cell{width:54px;height:44px;border-radius:7px;display:flex;align-items:center;justify-content:center;
        font-size:20px;border:1.5px solid rgba(255,255,255,.06);background:#111827;transition:all .35s;position:relative;}
      .bfs-cell.wall{background:#1f2937;border-color:rgba(255,255,255,.03);}
      .bfs-cell.wall::before{content:"🧱";font-size:16px;}
      .bfs-cell.visited{background:rgba(52,211,153,.15);border-color:rgba(52,211,153,.4);}
      .bfs-cell.queue{background:rgba(251,191,36,.15);border-color:rgba(251,191,36,.5);animation:queuePulse .7s ease-in-out infinite alternate;}
      @keyframes queuePulse{from{box-shadow:0 0 4px rgba(251,191,36,.3)}to{box-shadow:0 0 14px rgba(251,191,36,.6)}}
      .bfs-cell.path{background:rgba(250,204,21,.25);border-color:#facc15!important;animation:pathGlow .6s ease-out;}
      @keyframes pathGlow{0%{transform:scale(.9);opacity:.3}100%{transform:scale(1);opacity:1}}
      .bfs-cell.wave-label{font-size:11px;font-weight:900;color:#34d399;}
      .bfs-cell .wn{position:absolute;top:2px;right:4px;font-size:9px;font-weight:800;color:#34d399;opacity:.7;}
      .bfs-panel{display:flex;flex-direction:column;gap:8px;min-width:160px;}
      .bfs-queue-box{background:rgba(251,191,36,.08);border:1.5px solid rgba(251,191,36,.3);border-radius:10px;padding:8px 12px;}
      .bfs-queue-title{font-size:10px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
      .bfs-queue-items{display:flex;flex-direction:column;gap:3px;max-height:180px;overflow-y:auto;}
      .bfs-q-item{background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.25);border-radius:5px;padding:2px 8px;font-size:11px;color:#fbbf24;font-weight:700;}
      .bfs-stat{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:7px 12px;text-align:center;}
      .bfs-stat-v{font-size:18px;font-weight:900;color:#34d399;}
      .bfs-stat-l{font-size:9px;color:#6b7280;text-transform:uppercase;}
      .bfs-btn{padding:11px 22px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#047857,#059669);color:#fff;
        box-shadow:0 4px 16px rgba(4,120,87,.4);transition:all .2s;width:100%;}
      .bfs-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 22px rgba(4,120,87,.55);}
      .bfs-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .bfs-fb{min-height:22px;font-size:12px;text-align:center;z-index:1;padding:4px 14px;border-radius:8px;color:#34d399;max-width:640px;}
      .bfs-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s ease-out;}
      @keyframes winFade{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
      .bfs-win-emoji{font-size:60px;animation:wBounce .6s ease-out infinite alternate;}
      @keyframes wBounce{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .bfs-win-h1{font-size:24px;font-weight:900;color:#34d399;}
      .bfs-win-p{color:#a0aec0;font-size:12.5px;max-width:360px;text-align:center;line-height:1.6;}
      .bfs-win-btn{padding:10px 26px;background:linear-gradient(135deg,#047857,#10b981);border:none;border-radius:11px;color:#fff;font-size:13px;font-weight:800;cursor:pointer;}
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

    // BFS state
    let visited  = new Map();   // key -> wave number
    let queue    = [];
    let parents  = new Map();
    let wave     = 0;
    let found    = false;
    let path     = null;
    let totalCells = 0;
    const startTime = Date.now();

    // Init BFS
    function bfsInit() {
      visited.clear(); parents.clear(); queue = [];
      wave = 0; found = false; path = null;
      visited.set(key(START.r, START.c), 0);
      queue.push({r: START.r, c: START.c});
    }
    bfsInit();
    totalCells = ROWS * COLS - WALLS.size;

    container.innerHTML = `
      <div class="bfs-root" id="bfs-root">
        <div class="bfs-hud">
          <div class="bfs-title">🐾 Puppy Rescue Mission</div>
          <div class="bfs-wave-badge" id="bfs-wave">Wave: 0</div>
        </div>
        <div class="bfs-story" id="bfs-story">
          🏠 <strong>Ranger Rex</strong> is at the park entrance. His puppy 🐾 got lost somewhere in the woods!
          He must <em>spread search waves</em> — checking all nearby spots before going further.
          This guarantees finding the <strong style="color:#34d399">shortest path</strong>!
        </div>
        <div class="bfs-area">
          <div class="bfs-grid-wrap" id="bfs-grid" style="grid-template-columns:repeat(${COLS},54px)"></div>
          <div class="bfs-panel">
            <div class="bfs-queue-box">
              <div class="bfs-queue-title">📬 Search Queue</div>
              <div class="bfs-queue-items" id="bfs-q-items"></div>
            </div>
            <div class="bfs-stat"><div class="bfs-stat-v" id="bfs-visited">1</div><div class="bfs-stat-l">Visited</div></div>
            <div class="bfs-stat"><div class="bfs-stat-v" id="bfs-qlen">1</div><div class="bfs-stat-l">In Queue</div></div>
            <button class="bfs-btn" id="bfs-spread-btn" aria-label="Send rescue wave – explore next ring of cells">🌊 Spread Wave!</button>
            <button class="bfs-btn" id="bfs-reset-btn" aria-label="Reset rescue mission" style="background:linear-gradient(135deg,#374151,#4b5563);margin-top:-2px;">🔄 Reset</button>
          </div>
        </div>
        <div class="bfs-fb" id="bfs-fb">👇 Click "Spread Wave!" to start searching...</div>
      </div>`;

    const root = container.querySelector('#bfs-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> BFS (Breadth-First Search) explores all neighbors at the same distance before going deeper.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Click &quot;Send Rescue Wave&quot; to expand the search one ring at a time.</li><li>BFS always finds the shortest path in an unweighted grid.</li><li>Find the 🐶 puppy to win!</li></ul><div class="hw-insight">💡 Key insight: BFS = explore ring by ring (queue), always finds shortest path.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    const gridEl = container.querySelector('#bfs-grid');
    const spreadBtn = container.querySelector('#bfs-spread-btn');
    const resetBtn = container.querySelector('#bfs-reset-btn');
    const fbEl = container.querySelector('#bfs-fb');
    const waveEl = container.querySelector('#bfs-wave');
    const visitedEl = container.querySelector('#bfs-visited');
    const qlenEl = container.querySelector('#bfs-qlen');
    const qItemsEl = container.querySelector('#bfs-q-items');

    spreadBtn.addEventListener('click', doSpread);
    resetBtn.addEventListener('click', doReset);

    render();
    updateStepIndicator(1, 8);

    function doSpread() {
      if (found || queue.length === 0) return;
      wave++;
      waveEl.textContent = `Wave: ${wave}`;

      const nextQueue = [];
      let justFoundGoal = false;

      // Process all cells at current wave level
      const currentWave = [...queue];
      queue = [];

      currentWave.forEach(({r, c}) => {
        if (key(r,c) === key(GOAL.r, GOAL.c)) {
          justFoundGoal = true; return;
        }
        DIRS.forEach(([dr,dc]) => {
          const nr = r+dr, nc = c+dc;
          const k = key(nr,nc);
          if (nr>=0 && nr<ROWS && nc>=0 && nc<COLS &&
              !WALLS.has(k) && !visited.has(k)) {
            visited.set(k, wave);
            parents.set(k, key(r,c));
            nextQueue.push({r:nr,c:nc});
            if (k === key(GOAL.r, GOAL.c)) justFoundGoal = true;
          }
        });
      });

      queue = nextQueue;
      render();

      if (justFoundGoal || visited.has(key(GOAL.r, GOAL.c))) {
        found = true;
        path = buildPath();
        setTimeout(() => { renderPath(); setTimeout(celebrate, 600); }, 200);
        spreadBtn.disabled = true;
        fbEl.textContent = `🎉 Found the puppy! Shortest path is ${path.length - 1} steps!`;
      } else if (queue.length === 0) {
        fbEl.textContent = '😢 No path found...';
        spreadBtn.disabled = true;
      } else {
        fbEl.textContent = `Wave ${wave}: visited ${visited.size} spots, ${queue.length} in queue for next wave.`;
      }
      updateStepIndicator(Math.min(wave + 1, 8), 8);
    }

    function buildPath() {
      const p = [];
      let cur = key(GOAL.r, GOAL.c);
      while (cur) { p.unshift(cur); cur = parents.get(cur); }
      return p;
    }

    function renderPath() {
      if (!path) return;
      path.forEach(k => {
        const cell = gridEl.querySelector(`[data-key="${k}"]`);
        if (cell) cell.classList.add('path');
      });
    }

    function render() {
      gridEl.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const k = key(r,c);
          const cell = document.createElement('div');
          cell.className = 'bfs-cell';
          cell.setAttribute('data-key', k);
          if (WALLS.has(k)) { cell.classList.add('wall'); }
          else if (k === key(START.r, START.c)) { cell.textContent = '🏠'; cell.style.background='rgba(52,211,153,.15)'; }
          else if (k === key(GOAL.r, GOAL.c)) { cell.textContent = '🐾'; cell.style.background='rgba(251,191,36,.15)'; }
          else if (queue.find(q => key(q.r,q.c) === k)) { cell.classList.add('queue'); const wn = document.createElement('span'); wn.className='wn'; wn.textContent=wave; cell.appendChild(wn); }
          else if (visited.has(k)) { cell.classList.add('visited'); const wn = document.createElement('span'); wn.className='wn'; wn.textContent=visited.get(k); cell.appendChild(wn); }
          gridEl.appendChild(cell);
        }
      }
      visitedEl.textContent = visited.size;
      qlenEl.textContent = queue.length;
      // queue panel
      qItemsEl.innerHTML = '';
      queue.slice(0, 10).forEach(({r,c}) => {
        const d = document.createElement('div');
        d.className = 'bfs-q-item';
        d.textContent = `[${r},${c}]`;
        qItemsEl.appendChild(d);
      });
      if (queue.length > 10) { const d = document.createElement('div'); d.className='bfs-q-item'; d.textContent=`+${queue.length-10} more`; qItemsEl.appendChild(d); }
    }

    function doReset() {
      bfsInit();
      found = false; path = null;
      spreadBtn.disabled = false;
      waveEl.textContent = 'Wave: 0';
      fbEl.textContent = '👇 Click "Spread Wave!" to start searching...';
      render();
      container.querySelectorAll('.bfs-win').forEach(e => e.remove());
      updateStepIndicator(1, 8);
    }

    function celebrate() {
      const elapsed = Date.now() - startTime;
      const colors=['#34d399','#facc15','#f472b6','#60a5fa','#a78bfa'];
      for(let i=0;i<45;i++){
        const p=document.createElement('div'); p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.9+Math.random()*.7}s;--dl:${Math.random()*.4}s;background:${colors[i%colors.length]};left:${10+Math.random()*80}%;top:0;`;
        root.appendChild(p); setTimeout(()=>p.remove(),1800);
      }
      const ov = document.createElement('div');
      ov.className = 'bfs-win';
      ov.innerHTML = `
        <div class="bfs-win-emoji">🐾</div>
        <div class="bfs-win-h1">Puppy Found!</div>
        <div class="bfs-win-p">
          BFS always finds the <strong style="color:#34d399">shortest path</strong>!<br>
          Path length: <strong style="color:#facc15">${path.length - 1} steps</strong> in <strong style="color:#facc15">${wave} waves</strong>.<br>
          <small>Key insight: "shortest path in unweighted graph" → BFS! ✨</small>
        </div>
        <button class="bfs-win-btn" id="bfs-replay">🔄 Rescue Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#bfs-replay').addEventListener('click', () => { ov.remove(); doReset(); });
      onComplete && onComplete(3, elapsed);
    }

    app.registerSim('bfs', {
      init,
      nextStep: () => doSpread(),
      prevStep: () => doReset(),
      setMode: () => {}
    });
  }
  app.registerSim('bfs', { init });
})();