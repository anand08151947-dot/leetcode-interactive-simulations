/* Backtracking — The Enchanted Maze Escape 🗝️
   INTERACTIVE: Navigate with arrow buttons. Hit a dead end?
   Backtrack and try another path! Find the exit! */
(() => {
  // 0=open, 1=wall, 'S'=start, 'E'=exit, 'T'=treasure
  const MAZE=[
    [1,1,1,1,1,1,1],
    [1,'S',0,1,0,0,1],
    [1,1,0,1,0,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,1,'E',1],
    [1,1,1,1,1,1,1]
  ];
  const ROWS=7,COLS=7;
  const START={r:1,c:1};const EXIT={r:5,c:5};
  function injectStyles(){
    if(document.getElementById('bt-styles'))return;
    const s=document.createElement('style');s.id='bt-styles';
    s.textContent=`
      .bt-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a0a1a 0%,#1a0a00 50%,#0a1a10 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .bt-title{font-size:16px;font-weight:900;color:#fb923c;text-shadow:0 0 18px rgba(251,146,60,.5);z-index:1;}
      .bt-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .bt-area{display:flex;gap:16px;align-items:center;z-index:1;}
      .bt-grid-wrap{display:grid;gap:3px;}
      .bt-cell{width:52px;height:52px;border-radius:8px;display:flex;align-items:center;justify-content:center;
        font-size:20px;transition:all .25s;position:relative;}
      .bt-cell.wall{background:#111827;} .bt-cell.wall::before{content:"🧱";font-size:16px;}
      .bt-cell.open{background:#0f172a;border:1.5px solid rgba(255,255,255,.05);}
      .bt-cell.trail{background:rgba(251,146,60,.15);border:1.5px solid rgba(251,146,60,.3);}
      .bt-cell.dead{background:rgba(239,68,68,.12);border:1.5px solid rgba(239,68,68,.3);}
      .bt-cell.player{background:rgba(251,146,60,.2);border:2px solid #fb923c!important;
        box-shadow:0 0 18px rgba(251,146,60,.5);animation:playerPulse .8s ease-in-out infinite alternate;}
      @keyframes playerPulse{from{box-shadow:0 0 8px rgba(251,146,60,.3)}to{box-shadow:0 0 22px rgba(251,146,60,.7)}}
      .bt-cell.exit{background:rgba(74,222,128,.15);border:1.5px solid rgba(74,222,128,.4);}
      .bt-ctrl{display:flex;flex-direction:column;gap:8px;align-items:center;}
      .bt-arrow-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;}
      .bt-arr{width:44px;height:44px;border-radius:10px;border:none;cursor:pointer;font-size:18px;font-weight:800;
        background:rgba(255,255,255,.08);color:#e2e8f0;transition:all .18s;display:flex;align-items:center;justify-content:center;}
      .bt-arr:hover:not(:disabled){background:rgba(251,146,60,.25);transform:scale(1.1);}
      .bt-arr:disabled{opacity:.2;cursor:not-allowed;}
      .bt-back-btn{padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:12px;font-weight:800;
        background:linear-gradient(135deg,#374151,#4b5563);color:#e2e8f0;transition:all .18s;}
      .bt-back-btn:hover:not(:disabled){background:linear-gradient(135deg,#4b5563,#6b7280);}
      .bt-back-btn:disabled{opacity:.3;cursor:not-allowed;}
      .bt-legend{font-size:9px;color:#4b5563;text-align:center;line-height:1.6;}
      .bt-steps{background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.25);border-radius:8px;padding:5px 12px;font-size:11px;color:#fb923c;font-weight:800;text-align:center;}
      .bt-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:500px;min-height:18px;}
      .bt-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .bt-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .bt-win-h1{font-size:22px;font-weight:900;color:#fb923c;}
      .bt-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .bt-win-btn{padding:10px 26px;background:linear-gradient(135deg,#b45309,#f97316);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
      .conf{position:absolute;width:8px;height:8px;border-radius:2px;pointer-events:none;
        animation:confFall var(--d) var(--dl) ease-in forwards;z-index:200;}
      @keyframes confFall{0%{transform:translate(0,-10px) rotate(0);opacity:1}100%{transform:translate(var(--ex),430px) rotate(720deg);opacity:0}}
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
  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    let pr=START.r,pc=START.c,pathStack=[{r:START.r,c:START.c}],dead=new Set(),stepCount=0,backCount=0,won=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="bt-root" id="bt-root">
        <div class="bt-title">🗝️ The Enchanted Maze Escape</div>
        <div class="bt-story">
          🧒 <strong>Leo</strong> is trapped in a magical maze! He must find the glowing exit 🚪.
          When he hits a dead end, he <strong style="color:#fb923c">backtracks</strong> to try a different path.
          That's exactly how <em>backtracking algorithms</em> work!
        </div>
        <div class="bt-area">
          <div class="bt-grid-wrap" id="bt-grid" style="grid-template-columns:repeat(${COLS},52px)"></div>
          <div class="bt-ctrl">
            <div class="bt-steps" id="bt-steps">Steps: 0</div>
            <div class="bt-arrow-grid">
              <div></div>
              <button class="bt-arr" id="bt-up" title="Move Up" aria-label="Move up">↑</button>
              <div></div>
              <button class="bt-arr" id="bt-left" title="Move Left" aria-label="Move left">←</button>
              <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:16px;">🧒</div>
              <button class="bt-arr" id="bt-right" title="Move Right" aria-label="Move right">→</button>
              <div></div>
              <button class="bt-arr" id="bt-down" title="Move Down" aria-label="Move down">↓</button>
              <div></div>
            </div>
            <button class="bt-back-btn" id="bt-back" aria-label="Backtrack one step">↩ Backtrack</button>
            <button class="bt-back-btn" id="bt-reset" aria-label="Reset maze" style="margin-top:2px">🔄 Restart</button>
            <div class="bt-legend">🟠 Trail  🔴 Dead End<br>🟢 Exit  🧱 Wall</div>
          </div>
        </div>
        <div class="bt-status" id="bt-status">👆 Use arrows to navigate Leo to the 🚪 exit!</div>
      </div>`;
    const root=container.querySelector('#bt-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Backtracking explores all paths through a maze by trying each direction and undoing dead ends.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Use arrow keys to move the wizard through the maze.</li><li>Hit a dead end? It automatically backtracks to try another path.</li><li>Reach the ⭐ exit to win!</li></ul><div class="hw-insight">💡 Key insight: Backtracking = try → fail → undo → try next option.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#bt-up').addEventListener('click',()=>move(-1,0));
    container.querySelector('#bt-down').addEventListener('click',()=>move(1,0));
    container.querySelector('#bt-left').addEventListener('click',()=>move(0,-1));
    container.querySelector('#bt-right').addEventListener('click',()=>move(0,1));
    container.querySelector('#bt-back').addEventListener('click',doBack);
    container.querySelector('#bt-reset').addEventListener('click',doReset);
    renderGrid();updateStepIndicator(1,12);

    function key(r,c){return `${r},${c}`;}
    function isWall(r,c){return r<0||r>=ROWS||c<0||c>=COLS||MAZE[r][c]===1;}
    function move(dr,dc){
      if(won)return;
      const nr=pr+dr,nc=pc+dc;
      if(isWall(nr,nc)){
        container.querySelector('#bt-status').innerHTML=`🧱 <strong style="color:#f87171">Wall! Can't go that way.</strong> Try another direction or backtrack.`;
        return;
      }
      if(dead.has(key(nr,nc))){
        container.querySelector('#bt-status').innerHTML=`🔴 <strong style="color:#f87171">Dead end ahead!</strong> That path leads nowhere.`;
        return;
      }
      pr=nr;pc=nc;stepCount++;
      pathStack.push({r:pr,c:pc});
      container.querySelector('#bt-steps').textContent=`Steps: ${stepCount}`;
      renderGrid();
      const statusEl=container.querySelector('#bt-status');
      if(pr===EXIT.r&&pc===EXIT.c){
        won=true;
        container.querySelectorAll('.bt-arr').forEach(b=>b.disabled=true);
        statusEl.innerHTML=`🎉 <strong style="color:#4ade80">FREEDOM! Leo found the exit!</strong>`;
        setTimeout(celebrate,500);
      } else {
        // Check if surrounded (dead end)
        const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
        const canGo=dirs.some(([dr2,dc2])=>!isWall(pr+dr2,pc+dc2)&&!dead.has(key(pr+dr2,pc+dc2))&&!(pr+dr2===pathStack[pathStack.length-2]?.r&&pc+dc2===pathStack[pathStack.length-2]?.c));
        if(!canGo&&pathStack.length>1){
          dead.add(key(pr,pc));
          statusEl.innerHTML=`🔴 <strong style="color:#f87171">Dead end!</strong> This path has no exit. Hit ↩ Backtrack to go back!`;
        } else {
          statusEl.innerHTML=`🧒 Moved to [${pr},${pc}]. ${MAZE[pr][pc]==='T'?'Found treasure! 🌟 Keep going...':'Looking for the exit...'}`;
        }
      }
      updateStepIndicator(Math.min(stepCount+1,12),12);
    }
    function doBack(){
      if(pathStack.length<=1)return;
      dead.add(key(pr,pc));
      pathStack.pop();
      const prev=pathStack[pathStack.length-1];
      pr=prev.r;pc=prev.c;backCount++;
      renderGrid();
      container.querySelector('#bt-status').innerHTML=`↩ Backtracked! Back at [${pr},${pc}]. Backtracks: ${backCount}`;
    }
    function doReset(){
      pr=START.r;pc=START.c;pathStack=[{r:START.r,c:START.c}];
      dead=new Set();stepCount=0;backCount=0;won=false;
      container.querySelectorAll('.bt-arr').forEach(b=>b.disabled=false);
      container.querySelector('#bt-steps').textContent='Steps: 0';
      container.querySelector('#bt-status').textContent='👆 Use arrows to navigate Leo to the 🚪 exit!';
      container.querySelectorAll('.bt-win').forEach(e=>e.remove());
      renderGrid();updateStepIndicator(1,12);
    }
    function renderGrid(){
      const gridEl=container.querySelector('#bt-grid');gridEl.innerHTML='';
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
        const cell=document.createElement('div');
        const isPlayer=r===pr&&c===pc;
        const isExit=r===EXIT.r&&c===EXIT.c;
        const isWall2=MAZE[r][c]===1;
        const isDead=dead.has(key(r,c));
        const isTrail=pathStack.some(p=>p.r===r&&p.c===c)&&!isPlayer;
        cell.className='bt-cell '+(isWall2?'wall':isPlayer?'player':isExit?'exit':isDead?'dead':isTrail?'trail':'open');
        if(isPlayer)cell.textContent='🧒';
        else if(isExit)cell.textContent='🚪';
        else if(MAZE[r][c]==='T')cell.textContent='🌟';
        gridEl.appendChild(cell);
      }
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const stars=backCount===0?3:backCount<=2?3:2;
      const colors=['#fb923c','#fbbf24','#4ade80','#60a5fa','#f472b6'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='bt-win';
      ov.innerHTML=`
        <div class="bt-win-big">🗝️</div>
        <div class="bt-win-h1">Leo Escaped!</div>
        <div class="bt-win-p">
          Escaped in <strong style="color:#fb923c">${stepCount} steps</strong> with <strong style="color:#fbbf24">${backCount} backtracks</strong>!<br>
          Backtracking = try a path, mark dead ends, go back and try another.<br>
          <small style="color:#8892b0">Key insight: "find all paths / combinations" → Backtracking ✨</small>
        </div>
        <button class="bt-win-btn" id="bt-replay">🔄 Try Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#bt-replay').addEventListener('click',()=>{ov.remove();doReset();});
      onComplete&&onComplete(stars,elapsed);
    }
    app.registerSim('backtracking',{init,
      nextStep:()=>{
        const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
        for(const [dr,dc] of dirs){
          const nr=pr+dr,nc=pc+dc;
          if(!isWall(nr,nc)&&!dead.has(key(nr,nc))&&!pathStack.slice(0,-1).some(p=>p.r===nr&&p.c===nc)){
            move(dr,dc);return;
          }
        }
        doBack();
      },
      prevStep:()=>doBack(),
      setMode:()=>{}});
  }
})();