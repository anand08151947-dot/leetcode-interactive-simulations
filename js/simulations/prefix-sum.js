/* Prefix Sum — The Candy Shop Magic Calculator 🍬
   INTERACTIVE: Build the prefix sum array then
   answer range queries INSTANTLY! */
(() => {
  const CANDIES=[3,1,4,1,5,9,2,6]; // daily candy sales
  const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon2'];
  const QUERIES=[{l:2,r:5,label:'Wed–Sat'},{l:0,r:3,label:'Mon–Thu'},{l:4,r:7,label:'Fri–Mon2'}];
  function injectStyles(){
    if(document.getElementById('ps-styles'))return;
    const s=document.createElement('style');s.id='ps-styles';
    s.textContent=`
      .ps-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a0a1a 0%,#0a1a1a 50%,#1a1a0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .ps-title{font-size:16px;font-weight:900;color:#e879f9;text-shadow:0 0 18px rgba(232,121,249,.4);z-index:1;}
      .ps-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .ps-phase{font-size:11px;font-weight:800;color:#e879f9;text-transform:uppercase;letter-spacing:1px;z-index:1;}
      .ps-board{width:100%;max-width:680px;z-index:1;}
      .ps-row{display:flex;gap:4px;justify-content:center;margin-bottom:4px;}
      .ps-cell{width:72px;height:52px;border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;
        border:1.5px solid rgba(255,255,255,.07);background:#0c1218;transition:all .3s;position:relative;}
      .ps-cell.candy-row{background:linear-gradient(to bottom,#1a0033,#0a1a10);}
      .ps-cell.prefix-row{background:linear-gradient(to bottom,#001a2e,#1a0a1e);}
      .ps-cell.active{border-color:#e879f9!important;background:rgba(232,121,249,.15)!important;
        box-shadow:0 0 18px rgba(232,121,249,.5)!important;animation:cellPulse .8s ease-in-out infinite alternate!important;}
      @keyframes cellPulse{from{transform:scale(1)}to{transform:scale(1.06)}}
      .ps-cell.filled{border-color:rgba(232,121,249,.3);background:rgba(232,121,249,.08);}
      .ps-cell.query-highlight{border-color:#fbbf24!important;background:rgba(251,191,36,.18)!important;}
      .ps-cell .cv{font-size:15px;font-weight:900;color:#e2e8f0;}
      .ps-cell .cl{font-size:9px;color:#4b5563;margin-top:2px;}
      .ps-cell .ce{font-size:14px;}
      .ps-formula-box{background:rgba(232,121,249,.07);border:1.5px solid rgba(232,121,249,.25);border-radius:10px;
        padding:8px 16px;font-size:12.5px;color:#c4c9e8;text-align:center;z-index:1;max-width:640px;}
      .ps-query-panel{width:100%;max-width:640px;z-index:1;}
      .ps-q-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;text-align:center;}
      .ps-queries{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}
      .ps-query{padding:10px 18px;border-radius:11px;border:2px solid rgba(251,191,36,.25);
        background:rgba(251,191,36,.06);cursor:pointer;transition:all .25s;text-align:center;}
      .ps-query:hover{border-color:rgba(251,191,36,.5);background:rgba(251,191,36,.12);transform:translateY(-2px);}
      .ps-query.answered{border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.1);}
      .ps-q-range{font-size:11px;color:#fbbf24;font-weight:800;}
      .ps-q-label{font-size:10px;color:#6b7280;margin-top:2px;}
      .ps-q-ans{font-size:16px;font-weight:900;color:#4ade80;margin-top:3px;}
      .ps-btn{padding:11px 26px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#7c1d8a,#a821c4);color:#fff;
        box-shadow:0 4px 16px rgba(124,29,138,.4);transition:all .2s;z-index:1;}
      .ps-btn:hover:not(:disabled){transform:translateY(-2px);}
      .ps-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .ps-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .ps-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .ps-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .ps-win-h1{font-size:22px;font-weight:900;color:#e879f9;}
      .ps-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .ps-win-btn{padding:10px 26px;background:linear-gradient(135deg,#7c1d8a,#a821c4);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
  // Build prefix array
  function buildPrefix(arr){const p=[0];for(const v of arr)p.push(p[p.length-1]+v);return p;}
  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    const prefix=buildPrefix(CANDIES);
    let fillIdx=0,phase='build',activeQuery=-1,answeredCount=0,done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="ps-root" id="ps-root">
        <div class="ps-title">🍬 The Candy Shop Calculator</div>
        <div class="ps-story">
          🏪 <strong>Sweet Sam</strong> wants to know the total candy sales for any range of days — fast!
          We'll build a <strong style="color:#e879f9">Prefix Sum</strong> array: each cell stores the running total.
          Then any range query takes just <strong>2 lookups</strong>!
        </div>
        <div class="ps-phase" id="ps-phase">Phase 1: Build the Prefix Sum Array</div>
        <div class="ps-board">
          <div class="ps-row" id="ps-candy-row"></div>
          <div class="ps-row" id="ps-prefix-row"></div>
        </div>
        <div class="ps-formula-box" id="ps-formula">
          💡 prefix[i] = prefix[i-1] + candies[i-1] &nbsp;|&nbsp; range(l,r) = prefix[r+1] − prefix[l]
        </div>
        <div class="ps-query-panel" id="ps-query-panel" style="display:none">
          <div class="ps-q-title">⚡ Answer Range Queries Instantly!</div>
          <div class="ps-queries" id="ps-queries"></div>
        </div>
        <button class="ps-btn" id="ps-btn" aria-label="Add next candy to the prefix sum">🧮 Add Next Prefix Sum!</button>
        <div class="ps-status" id="ps-status">👆 Click to compute prefix[1] = prefix[0] + candies[0]!</div>
      </div>`;
    const root=container.querySelector('#ps-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Prefix Sums precompute cumulative totals to answer range-sum queries in O(1).<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>First, build the prefix sum array by adding each candy value cumulatively.</li><li>Then answer range queries: sum(L, R) = prefix[R] − prefix[L−1].</li><li>O(1) per query after O(n) preprocessing!</li></ul><div class="hw-insight">💡 Key insight: Precompute → any range sum in O(1) instead of O(n).</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#ps-btn').addEventListener('click',doNext);
    render();updateStepIndicator(1,CANDIES.length+1+QUERIES.length);

    function doNext(){
      if(phase==='build'){
        fillIdx++;
        if(fillIdx>CANDIES.length){phase='query';switchToQueryPhase();return;}
        const prev=prefix[fillIdx-1],cur=CANDIES[fillIdx-1];
        container.querySelector('#ps-status').innerHTML=`✅ prefix[${fillIdx}] = prefix[${fillIdx-1}] + candies[${fillIdx-1}] = ${prev} + ${cur} = <strong style="color:#e879f9">${prefix[fillIdx]}</strong>`;
        render();updateStepIndicator(fillIdx+1,CANDIES.length+1+QUERIES.length);
      }
    }
    function switchToQueryPhase(){
      container.querySelector('#ps-phase').textContent='Phase 2: Answer Range Queries with 2 Lookups!';
      container.querySelector('#ps-btn').disabled=true;
      container.querySelector('#ps-query-panel').style.display='block';
      container.querySelector('#ps-btn').textContent='✨ Done!';
      container.querySelector('#ps-status').textContent='🎉 Prefix array complete! Click any query to answer it instantly!';
      renderQueries();render();
    }
    const answeredSet = new Set();
    function answerQuery(qi){
      if(answeredSet.has(qi))return;
      answeredSet.add(qi);
      const q=QUERIES[qi];
      const ans=prefix[q.r+1]-prefix[q.l];
      activeQuery=qi;
      container.querySelector('#ps-status').innerHTML=
        `⚡ range(${q.l},${q.r}) = prefix[${q.r+1}] − prefix[${q.l}] = ${prefix[q.r+1]} − ${prefix[q.l]} = <strong style="color:#fbbf24">${ans}</strong>`;
      const qEl=container.querySelectorAll('.ps-query')[qi];
      if(qEl){qEl.classList.add('answered');qEl.querySelector('.ps-q-ans').textContent=`= ${ans} 🍬`;}
      answeredCount++;
      render();updateStepIndicator(CANDIES.length+1+answeredCount,CANDIES.length+1+QUERIES.length);
      if(answeredCount===QUERIES.length){done=true;setTimeout(celebrate,600);}
    }
    function render(){
      const candyRow=container.querySelector('#ps-candy-row');
      const prefixRow=container.querySelector('#ps-prefix-row');
      candyRow.innerHTML='';prefixRow.innerHTML='';
      // candy cells
      CANDIES.forEach((v,i)=>{
        const d=document.createElement('div');d.className='ps-cell candy-row';
        const inQ=activeQuery>=0&&i>=QUERIES[activeQuery].l&&i<=QUERIES[activeQuery].r;
        if(inQ)d.classList.add('query-highlight');
        d.innerHTML=`<span class="ce">🍬</span><span class="cv">${v}</span><span class="cl">${DAYS[i]}</span>`;
        candyRow.appendChild(d);
      });
      // prefix cells
      for(let i=0;i<=CANDIES.length;i++){
        const d=document.createElement('div');
        const isFilled=i<fillIdx;
        const isActive=i===fillIdx&&phase==='build';
        d.className='ps-cell prefix-row'+(isActive?' active':isFilled?' filled':'');
        const inQ=activeQuery>=0&&(i===QUERIES[activeQuery].l||i===QUERIES[activeQuery].r+1);
        if(inQ&&phase==='query')d.classList.add('query-highlight');
        d.innerHTML=`<span class="cv">${isFilled||isActive?prefix[i]:'?'}</span><span class="cl">P[${i}]</span>`;
        prefixRow.appendChild(d);
      }
    }
    function renderQueries(){
      const el=container.querySelector('#ps-queries');if(!el)return;el.innerHTML='';
      QUERIES.forEach((q,qi)=>{
        const d=document.createElement('div');d.className='ps-query';
        d.innerHTML=`<div class="ps-q-range">Days ${q.l}–${q.r}</div><div class="ps-q-label">${q.label}</div><div class="ps-q-ans"></div>`;
        d.addEventListener('click',()=>answerQuery(qi));
        el.appendChild(d);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#e879f9','#fbbf24','#4ade80','#60a5fa','#f472b6'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='ps-win';
      ov.innerHTML=`
        <div class="ps-win-big">🍬</div>
        <div class="ps-win-h1">Range Query Master!</div>
        <div class="ps-win-p">
          All ${QUERIES.length} range queries answered in <strong style="color:#fbbf24">2 lookups each</strong>!<br>
          Without prefix sums: add up each range = slow O(n).<br>
          With prefix sums: 1 subtraction = O(1) instant! 🚀<br>
          <small style="color:#8892b0">Key insight: "range sum queries" → Prefix Sum ✨</small>
        </div>
        <button class="ps-win-btn" id="ps-replay">🔄 New Store!</button>`;
      root.appendChild(ov);
      ov.querySelector('#ps-replay').addEventListener('click',()=>{ov.remove();fillIdx=0;phase='build';activeQuery=-1;answeredCount=0;answeredSet.clear();done=false;
        container.querySelector('#ps-phase').textContent='Phase 1: Build the Prefix Sum Array';
        container.querySelector('#ps-btn').disabled=false;container.querySelector('#ps-btn').textContent='🧮 Add Next Prefix Sum!';
        container.querySelector('#ps-query-panel').style.display='none';
        container.querySelector('#ps-status').textContent='👆 Click to compute prefix[1] = prefix[0] + candies[0]!';
        render();updateStepIndicator(1,CANDIES.length+1+QUERIES.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('prefix-sum',{init,
      nextStep:()=>doNext(),
      prevStep:()=>{fillIdx=0;phase='build';activeQuery=-1;answeredCount=0;answeredSet.clear();done=false;
        container.querySelector('#ps-phase').textContent='Phase 1: Build the Prefix Sum Array';
        container.querySelector('#ps-btn').disabled=false;container.querySelector('#ps-btn').textContent='🧮 Add Next Prefix Sum!';
        container.querySelector('#ps-query-panel').style.display='none';
        container.querySelector('#ps-status').textContent='👆 Click to compute prefix[1] = prefix[0] + candies[0]!';
        container.querySelectorAll('.ps-win').forEach(e=>e.remove());
        render();updateStepIndicator(1,CANDIES.length+1+QUERIES.length);},
      setMode:()=>{}});
  }
  app.registerSim('prefix-sum', { init });
})();