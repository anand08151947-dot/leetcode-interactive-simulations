/* Dynamic Programming — The Frog Prince 🐸
   INTERACTIVE: Help Frog figure out how many ways
   to reach each lily pad (can jump 1 or 2 pads)! */
(() => {
  const PADS=8; // pads 0..7, start=0, goal=7
  function injectStyles(){
    if(document.getElementById('dp-styles'))return;
    const s=document.createElement('style');s.id='dp-styles';
    s.textContent=`
      .dp-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#052e16 0%,#0f172a 50%,#1e0a3c 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .dp-title{font-size:16px;font-weight:900;color:#4ade80;text-shadow:0 0 18px rgba(74,222,128,.4);z-index:1;}
      .dp-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .dp-lake{width:100%;max-width:680px;z-index:1;}
      .dp-pads-row{display:flex;gap:5px;justify-content:center;padding:8px 4px 4px;}
      .dp-pad{width:68px;height:68px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;
        border:2.5px solid rgba(255,255,255,.08);background:#0f2d1f;transition:all .35s;cursor:pointer;position:relative;}
      .dp-pad.solved{border-color:#4ade80;background:rgba(74,222,128,.15);cursor:pointer;}
      .dp-pad.solved:hover{transform:scale(1.07);box-shadow:0 0 16px rgba(74,222,128,.4);}
      .dp-pad.active{border-color:#fbbf24!important;background:rgba(251,191,36,.2)!important;
        box-shadow:0 0 24px rgba(251,191,36,.6)!important;animation:padPulse .9s ease-in-out infinite alternate!important;}
      @keyframes padPulse{from{transform:scale(1)}to{transform:scale(1.08)}}
      .dp-pad.goal{border-color:#a78bfa;background:rgba(167,139,250,.15);}
      .dp-pad.frog{background:rgba(74,222,128,.25)!important;border-color:#4ade80!important;}
      .dp-pad .pe{font-size:20px;} .dp-pad .pn{font-size:9px;color:#4b5563;} .dp-pad .pv{font-size:14px;font-weight:900;color:#4ade80;}
      .dp-pad.active .pv{color:#fbbf24;}
      .dp-arrows{display:flex;gap:5px;justify-content:center;padding:0 4px;}
      .dp-arr-slot{width:68px;display:flex;justify-content:center;align-items:center;font-size:10px;color:#2d3748;height:20px;}
      .dp-table{width:100%;max-width:680px;z-index:1;}
      .dp-table-title{font-size:10px;font-weight:800;color:#4b5563;text-transform:uppercase;letter-spacing:1px;text-align:center;margin-bottom:5px;}
      .dp-table-row{display:flex;gap:5px;justify-content:center;}
      .dp-tc{width:68px;height:34px;border-radius:7px;display:flex;align-items:center;justify-content:center;
        font-size:13px;font-weight:800;border:1.5px solid rgba(255,255,255,.06);background:#0c1a10;transition:all .3s;}
      .dp-tc.filled{border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.1);color:#4ade80;}
      .dp-tc.active{border-color:#fbbf24;background:rgba(251,191,36,.15);color:#fbbf24;animation:tcPulse .7s ease-in-out infinite alternate;}
      @keyframes tcPulse{from{box-shadow:0 0 4px rgba(251,191,36,.2)}to{box-shadow:0 0 14px rgba(251,191,36,.5)}}
      .dp-tc.empty{color:#1f2937;}
      .dp-formula{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;
        padding:8px 16px;font-size:13px;color:#c4c9e8;text-align:center;z-index:1;max-width:640px;}
      .dp-formula strong{color:#fbbf24;}
      .dp-btn{padding:11px 28px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#065f46,#059669);color:#fff;
        box-shadow:0 4px 16px rgba(6,95,70,.4);transition:all .2s;z-index:1;}
      .dp-btn:hover:not(:disabled){transform:translateY(-2px);}
      .dp-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .dp-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .dp-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .dp-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .dp-win-h1{font-size:22px;font-weight:900;color:#4ade80;}
      .dp-win-p{color:#c4c9e8;font-size:12.5px;max-width:420px;text-align:center;line-height:1.6;}
      .dp-win-btn{padding:10px 26px;background:linear-gradient(135deg,#065f46,#10b981);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    let dp=new Array(PADS).fill(null);dp[0]=1;
    let current=1,done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="dp-root" id="dp-root">
        <div class="dp-title">🐸 The Frog Prince's Journey</div>
        <div class="dp-story">
          🐸 <strong>Prince Frog</strong> wants to cross the pond! He can jump <strong>1 or 2 lily pads</strong> at a time.
          How many different ways can he reach pad 7? Click the <strong style="color:#fbbf24">glowing pad</strong>
          to calculate how many paths lead to it!
        </div>
        <div class="dp-lake">
          <div class="dp-pads-row" id="dp-pads"></div>
          <div class="dp-arrows" id="dp-arrows"></div>
        </div>
        <div class="dp-formula" id="dp-formula">
          💡 Formula: <strong>ways[i] = ways[i-1] + ways[i-2]</strong><br>
          <small style="color:#6b7280">To reach pad i, the frog jumped from pad i-1 (1 jump) OR pad i-2 (2 jumps)</small>
        </div>
        <div class="dp-table">
          <div class="dp-table-title">🧮 DP Table (ways to reach each pad)</div>
          <div class="dp-table-row" id="dp-table-row"></div>
        </div>
        <button class="dp-btn" id="dp-btn" aria-label="Calculate ways to reach next lily pad">🐸 Calculate Pad ${current}!</button>
        <div class="dp-status" id="dp-status">👆 Pad 0 = 1 way (already there!). Click to fill in the next pad!</div>
      </div>`;
    const root=container.querySelector('#dp-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Dynamic Programming solves problems by storing results of smaller sub-problems.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>The frog can jump +1 or +2 lily pads at a time.</li><li>Count how many different ways to reach each pad.</li><li>Each answer builds on the previous two!</li></ul><div class="hw-insight">💡 Key insight: DP = ways(n) = ways(n-1) + ways(n-2) — reuse solved sub-problems.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#dp-btn').addEventListener('click',calcNext);
    render();updateStepIndicator(1,PADS-1);

    function calcNext(){
      if(done||current>=PADS)return;
      const prev1=dp[current-1]||0,prev2=current>=2?(dp[current-2]||0):0;
      dp[current]=prev1+prev2;
      const statusEl=container.querySelector('#dp-status');
      statusEl.innerHTML=`🐸 Pad ${current}: ways[${current}] = ways[${current-1}] + ${current>=2?'ways['+(current-2)+']':'0'} = ${prev1} + ${prev2} = <strong style="color:#fbbf24">${dp[current]}</strong>`;
      if(current===PADS-1){
        done=true;
        container.querySelector('#dp-btn').disabled=true;
        setTimeout(celebrate,500);
      } else {
        current++;
        container.querySelector('#dp-btn').textContent=`🐸 Calculate Pad ${current}!`;
      }
      render();updateStepIndicator(Math.min(current,PADS-1),PADS-1);
    }
    function render(){
      const padsEl=container.querySelector('#dp-pads');
      const arrowsEl=container.querySelector('#dp-arrows');
      const tableEl=container.querySelector('#dp-table-row');
      padsEl.innerHTML='';arrowsEl.innerHTML='';tableEl.innerHTML='';
      const padEmojis=['🏁','🍀','🌸','🌺','🌻','🌊','🌙','🏆'];
      for(let i=0;i<PADS;i++){
        const isCur=i===current&&!done;
        const isSolved=dp[i]!==null&&i!==current;
        const d=document.createElement('div');
        d.className='dp-pad'+(isCur?' active':isSolved?' solved':i===PADS-1?' goal':'');
        d.innerHTML=`<span class="pe">${padEmojis[i]}</span><span class="pn">Pad ${i}</span><span class="pv">${dp[i]!==null?dp[i]+'':'?'}</span>`;
        padsEl.appendChild(d);
        const tc=document.createElement('div');
        tc.className='dp-tc'+(isCur?' active':dp[i]!==null?' filled':' empty');
        tc.textContent=dp[i]!==null?dp[i]:'?';
        tableEl.appendChild(tc);
        if(i<PADS-1){const a=document.createElement('div');a.className='dp-arr-slot';a.textContent='→';arrowsEl.appendChild(a);}
      }
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#4ade80','#fbbf24','#60a5fa','#f472b6','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='dp-win';
      ov.innerHTML=`
        <div class="dp-win-big">🐸</div>
        <div class="dp-win-h1">${dp[PADS-1]} Ways to Cross!</div>
        <div class="dp-win-p">
          Prince Frog can cross in <strong style="color:#fbbf24">${dp[PADS-1]} different ways</strong>!<br>
          Each answer built on the previous ones — that's Dynamic Programming!<br>
          DP table: [${dp.join(', ')}]<br>
          <small style="color:#8892b0">Key insight: "overlapping subproblems" → Dynamic Programming ✨</small>
        </div>
        <button class="dp-win-btn" id="dp-replay">🔄 Hop Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#dp-replay').addEventListener('click',()=>{ov.remove();dp=new Array(PADS).fill(null);dp[0]=1;current=1;done=false;
        container.querySelector('#dp-btn').disabled=false;container.querySelector('#dp-btn').textContent=`🐸 Calculate Pad ${current}!`;
        container.querySelector('#dp-status').textContent='👆 Pad 0 = 1 way (already there!). Click to fill in the next pad!';
        render();updateStepIndicator(1,PADS-1);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('dynamic-programming',{init,
      nextStep:()=>calcNext(),
      prevStep:()=>{dp=new Array(PADS).fill(null);dp[0]=1;current=1;done=false;
        container.querySelector('#dp-btn').disabled=false;container.querySelector('#dp-btn').textContent=`🐸 Calculate Pad ${current}!`;
        container.querySelector('#dp-status').textContent='👆 Pad 0 = 1 way (already there!). Click to fill in the next pad!';
        container.querySelectorAll('.dp-win').forEach(e=>e.remove());render();updateStepIndicator(1,PADS-1);},
      setMode:()=>{}});
  }
  app.registerSim('dynamic-programming', { init });
})();