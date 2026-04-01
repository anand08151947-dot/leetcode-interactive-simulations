/* Divide & Conquer — Dragon Egg Sort 🥚
   INTERACTIVE: Click Split then Merge to sort dragon eggs using merge sort! */
(() => {
  const INITIAL=[8,3,5,1,9,2,7,4];
  function injectStyles(){
    if(document.getElementById('dc-styles'))return;
    const s=document.createElement('style');s.id='dc-styles';
    s.textContent=`
      .dc-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:8px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a0505 0%,#1a0a00 50%,#0f0a00 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .dc-title{font-size:16px;font-weight:900;color:#f87171;text-shadow:0 0 18px rgba(248,113,113,.4);z-index:1;}
      .dc-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .dc-phase{display:flex;flex-direction:column;gap:6px;z-index:1;width:100%;max-width:720px;}
      .dc-phase-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;text-align:center;}
      .dc-levels{display:flex;flex-direction:column;gap:8px;}
      .dc-level{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;}
      .dc-group{display:flex;flex-direction:column;align-items:center;gap:2px;}
      .dc-group-label{font-size:8px;color:#6b7280;text-align:center;}
      .dc-eggs{display:flex;gap:3px;padding:4px 6px;border-radius:8px;border:1.5px solid rgba(255,255,255,.08);}
      .dc-egg{width:28px;height:36px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
        display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;
        color:#fff;transition:all .3s;position:relative;cursor:default;}
      .dc-egg.active{animation:eggGlow .6s ease-in-out infinite alternate;}
      @keyframes eggGlow{from{box-shadow:0 0 6px currentColor}to{box-shadow:0 0 18px currentColor,0 0 6px currentColor}}
      .dc-egg.sorted{background:linear-gradient(135deg,#4ade80,#16a34a)!important;}
      .dc-egg.merging{background:linear-gradient(135deg,#fbbf24,#d97706)!important;transform:scale(1.1);}
      .dc-btns{display:flex;gap:10px;z-index:1;}
      .dc-btn{padding:10px 22px;border-radius:12px;border:none;cursor:pointer;font-size:13px;font-weight:800;transition:all .2s;}
      .dc-btn.split{background:linear-gradient(135deg,#7f1d1d,#dc2626);color:#fff;box-shadow:0 4px 14px rgba(127,29,29,.4);}
      .dc-btn.merge{background:linear-gradient(135deg,#78350f,#d97706);color:#fff;box-shadow:0 4px 14px rgba(120,53,15,.4);}
      .dc-btn:hover:not(:disabled){transform:translateY(-2px);}
      .dc-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .dc-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .dc-complexity{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);border-radius:9px;
        padding:5px 14px;font-size:11px;color:#fca5a5;z-index:1;}
      .dc-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .dc-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .dc-win-h1{font-size:22px;font-weight:900;color:#f87171;}
      .dc-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .dc-win-btn{padding:10px 26px;background:linear-gradient(135deg,#7f1d1d,#dc2626);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
  const EGG_COLORS=['#dc2626','#f97316','#eab308','#16a34a','#0891b2','#4f46e5','#9333ea','#db2777'];
  function getColor(v){return EGG_COLORS[(v-1)%EGG_COLORS.length];}

  // Pre-compute merge sort steps
  function mergeSortSteps(arr){
    const steps=[];
    function ms(a,level,groupIdx){
      if(a.length<=1){steps.push({type:'leaf',level,groupIdx,arr:a});return a;}
      const mid=Math.floor(a.length/2);
      const L=ms(a.slice(0,mid),level+1,groupIdx*2);
      const R=ms(a.slice(mid),level+1,groupIdx*2+1);
      const merged=[];let i=0,j=0;
      while(i<L.length&&j<R.length){if(L[i]<=R[j])merged.push(L[i++]);else merged.push(R[j++]);}
      while(i<L.length)merged.push(L[i++]);
      while(j<R.length)merged.push(R[j++]);
      steps.push({type:'merge',level,groupIdx,left:L,right:R,merged});
      return merged;
    }
    ms([...arr],0,0);
    return steps;
  }

  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    let arr=[...INITIAL],splitStep=0,mergeStep=0,phase='split',done=false;
    // Build all split states (BFS style top-down)
    function getSplitLevels(){
      const levels=[[arr]];
      let curr=[arr];
      while(curr.some(g=>g.length>1)){
        const next=[];curr.forEach(g=>{if(g.length>1){const m=Math.floor(g.length/2);next.push(g.slice(0,m));next.push(g.slice(m));}else next.push(g);});
        levels.push(next);curr=next;
      }
      return levels;
    }
    function getMergeLevels(splitLevels){
      const levels=[...splitLevels].reverse().slice(1);
      const merged=[splitLevels[splitLevels.length-1]];
      for(let i=0;i<levels.length;i++){
        const prev=merged[i];const result=[];
        for(let j=0;j<prev.length;j+=2){
          if(j+1<prev.length){const m=[...prev[j],...prev[j+1]].sort((a,b)=>a-b);result.push(m);}
          else result.push(prev[j]);
        }
        merged.push(result);
      }
      return merged;
    }
    let splitLevels=getSplitLevels();
    let mergeLevels=getMergeLevels(splitLevels);
    let currentSplitIdx=0,currentMergeIdx=0;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="dc-root" id="dc-root">
        <div class="dc-title">🥚 Dragon Egg Sort</div>
        <div class="dc-story">
          🐉 <strong>Sage the Dragon</strong> needs eggs sorted by size for hatching!
          <strong>Divide & Conquer:</strong> Split into halves, sort each half, then Merge back!
          This is <strong>Merge Sort</strong> — one of the most elegant algorithms!
        </div>
        <div class="dc-phase">
          <div class="dc-phase-title" id="dc-phase-title">📌 Phase 1: Splitting</div>
          <div class="dc-levels" id="dc-levels"></div>
        </div>
        <div class="dc-complexity">🧮 Complexity: O(n log n) — splits take O(log n) levels, merging each level takes O(n)</div>
        <div class="dc-btns">
          <button class="dc-btn split" id="dc-split-btn" aria-label="Split eggs into smaller groups">✂️ Split!</button>
          <button class="dc-btn merge" id="dc-merge-btn" aria-label="Merge sorted egg groups" disabled>🔀 Merge!</button>
        </div>
        <div class="dc-status" id="dc-status">✂️ Click Split to divide eggs into smaller groups!</div>
      </div>`;
    const root=container.querySelector('#dc-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Divide &amp; Conquer splits a problem in half, solves each half, then merges the results.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Click &quot;Split&quot; to repeatedly divide egg groups in half.</li><li>Once split into singles, click &quot;Merge&quot; to combine sorted halves.</li><li>Result is a fully sorted array — Merge Sort!</li></ul><div class="hw-insight">💡 Key insight: Split into halves → sort each → merge back = O(n log n).</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#dc-split-btn').addEventListener('click',doSplit);
    container.querySelector('#dc-merge-btn').addEventListener('click',doMerge);
    renderLevels([arr],'split');updateStepIndicator(1,splitLevels.length+mergeLevels.length-2);

    function doSplit(){
      if(currentSplitIdx>=splitLevels.length-1){
        // Transition to merge phase
        phase='merge';
        container.querySelector('#dc-split-btn').disabled=true;
        container.querySelector('#dc-merge-btn').disabled=false;
        container.querySelector('#dc-phase-title').textContent='🔀 Phase 2: Merging';
        container.querySelector('#dc-status').textContent='🔀 Now click Merge to combine sorted groups!';
        renderLevels(mergeLevels[0],'merge');
        return;
      }
      currentSplitIdx++;
      const lvl=splitLevels[currentSplitIdx];
      container.querySelector('#dc-status').innerHTML=`✂️ Split into ${lvl.length} group(s)! ${lvl.every(g=>g.length<=1)?'All singles — ready to merge!':'Keep splitting...'}`;
      if(currentSplitIdx===splitLevels.length-1){
        container.querySelector('#dc-split-btn').textContent='▶️ Start Merging';
      }
      renderLevels(lvl,'split');
      updateStepIndicator(currentSplitIdx+currentMergeIdx+1,splitLevels.length+mergeLevels.length-2);
    }
    function doMerge(){
      if(done)return;
      if(currentMergeIdx>=mergeLevels.length-1){done=true;container.querySelector('#dc-merge-btn').disabled=true;setTimeout(celebrate,400);return;}
      currentMergeIdx++;
      const lvl=mergeLevels[currentMergeIdx];
      container.querySelector('#dc-status').innerHTML=`🔀 Merged into ${lvl.length} group(s)! ${lvl.length===1?'<strong style="color:#4ade80">Fully sorted!</strong>':'Continue merging...'}`;
      renderLevels(lvl,'merge');
      updateStepIndicator(currentSplitIdx+currentMergeIdx+1,splitLevels.length+mergeLevels.length-2);
      if(lvl.length===1){done=true;container.querySelector('#dc-merge-btn').disabled=true;setTimeout(celebrate,400);}
    }
    function renderLevels(groups,phase){
      const levelsEl=container.querySelector('#dc-levels');levelsEl.innerHTML='';
      const row=document.createElement('div');row.className='dc-level';
      groups.forEach((grp,gi)=>{
        const g=document.createElement('div');g.className='dc-group';
        const lbl=document.createElement('div');lbl.className='dc-group-label';
        lbl.textContent=grp.length===1?'🥚':phase==='merge'?`sorted[${gi}]`:`group[${gi}]`;
        const eggs=document.createElement('div');eggs.className='dc-eggs';
        eggs.style.background=`rgba(${phase==='split'?'220,38,38':'217,119,6'},.08)`;
        eggs.style.borderColor=`rgba(${phase==='split'?'220,38,38':'217,119,6'},.2)`;
        grp.forEach(v=>{
          const egg=document.createElement('div');egg.className='dc-egg'+(grp.length===1?' sorted':'');
          egg.style.background=`linear-gradient(135deg,${getColor(v)},${getColor(v)}99)`;
          egg.style.boxShadow=`0 2px 8px ${getColor(v)}55`;
          egg.textContent=v;eggs.appendChild(egg);
        });
        g.appendChild(lbl);g.appendChild(eggs);row.appendChild(g);
      });
      levelsEl.appendChild(row);
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#f87171','#fbbf24','#4ade80','#60a5fa','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='dc-win';
      ov.innerHTML=`
        <div class="dc-win-big">🐉</div>
        <div class="dc-win-h1">Eggs Sorted!</div>
        <div class="dc-win-p">
          Split into singles → merge back sorted = <strong>O(n log n)</strong>!<br>
          ${arr.length} eggs, ${Math.ceil(Math.log2(arr.length))} split levels, each merge pass does O(n) work.<br>
          <small style="color:#8892b0">Key insight: "split into subproblems + combine" → Divide & Conquer ✨</small>
        </div>
        <button class="dc-win-btn" id="dc-replay">🔄 Sort Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#dc-replay').addEventListener('click',()=>{ov.remove();
        const shuffled=[...INITIAL].sort(()=>Math.random()-.5);arr=shuffled;
        splitLevels=getSplitLevels();mergeLevels=getMergeLevels(splitLevels);
        currentSplitIdx=0;currentMergeIdx=0;phase='split';done=false;
        container.querySelector('#dc-split-btn').disabled=false;container.querySelector('#dc-merge-btn').disabled=true;
        container.querySelector('#dc-split-btn').textContent='✂️ Split!';
        container.querySelector('#dc-phase-title').textContent='📌 Phase 1: Splitting';
        container.querySelector('#dc-status').textContent='✂️ Click Split to divide eggs into smaller groups!';
        renderLevels([arr],'split');updateStepIndicator(1,splitLevels.length+mergeLevels.length-2);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('divide-conquer',{init,
      nextStep:()=>phase==='split'?doSplit():doMerge(),
      prevStep:()=>{currentSplitIdx=0;currentMergeIdx=0;phase='split';done=false;
        container.querySelector('#dc-split-btn').disabled=false;container.querySelector('#dc-merge-btn').disabled=true;
        container.querySelector('#dc-split-btn').textContent='✂️ Split!';
        container.querySelector('#dc-phase-title').textContent='📌 Phase 1: Splitting';
        container.querySelectorAll('.dc-win').forEach(e=>e.remove());
        renderLevels([arr],'split');updateStepIndicator(1,splitLevels.length+mergeLevels.length-2);},
      setMode:()=>{}});
  }
})();