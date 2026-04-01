/* Monotonic Stack — Jungle Treetop Views 🌴
   INTERACTIVE: For each tree, find the NEXT TALLER tree!
   Watch the stack automatically pop shorter trees! */
(() => {
  const HEIGHTS=[3,1,5,2,6,4,7,1,4,3];
  const LABELS=['Oak','Birch','Maple','Pine','Spruce','Elm','Redwood','Ash','Cedar','Willow'];
  function injectStyles(){
    if(document.getElementById('ms-styles'))return;
    const s=document.createElement('style');s.id='ms-styles';
    s.textContent=`
      .ms-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#052e16 0%,#0f1f0f 50%,#1a1a0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .ms-title{font-size:16px;font-weight:900;color:#86efac;text-shadow:0 0 18px rgba(134,239,172,.4);z-index:1;}
      .ms-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .ms-area{display:flex;gap:16px;z-index:1;width:100%;max-width:720px;align-items:flex-end;}
      .ms-forest{flex:1;}
      .ms-forest-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;text-align:center;}
      .ms-trees{display:flex;gap:3px;align-items:flex-end;height:120px;}
      .ms-tree-slot{display:flex;flex-direction:column;align-items:center;flex:1;}
      .ms-tree{width:100%;border-radius:4px 4px 0 0;transition:all .3s;display:flex;align-items:center;justify-content:center;
        font-size:9px;font-weight:900;position:relative;cursor:default;}
      .ms-tree .th{position:absolute;top:-18px;font-size:10px;font-weight:800;color:#e2e8f0;}
      .ms-tree-idx{font-size:8px;color:#374151;margin-top:2px;}
      .ms-tree.processed{background:rgba(255,255,255,.08);}
      .ms-tree.in-stack{background:rgba(251,191,36,.25)!important;border:1.5px solid rgba(251,191,36,.5)!important;}
      .ms-tree.current{background:rgba(134,239,172,.25)!important;border:1.5px solid #86efac!important;
        animation:treePulse .8s ease-in-out infinite alternate!important;}
      @keyframes treePulse{from{box-shadow:0 0 6px rgba(134,239,172,.3)}to{box-shadow:0 0 20px rgba(134,239,172,.6)}}
      .ms-tree.solved{background:rgba(96,165,250,.15);border:1.5px solid rgba(96,165,250,.3);}
      .ms-tree.no-taller{background:rgba(107,114,128,.1);border:1px solid rgba(107,114,128,.2);}
      .ms-stack-panel{min-width:150px;display:flex;flex-direction:column;gap:6px;}
      .ms-stack-title{font-size:10px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:1px;}
      .ms-stack-box{background:rgba(251,191,36,.07);border:1.5px solid rgba(251,191,36,.25);border-radius:10px;
        padding:8px;min-height:80px;display:flex;flex-direction:column;gap:3px;justify-content:flex-end;}
      .ms-stack-item{background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.35);border-radius:6px;
        padding:4px 8px;font-size:11px;font-weight:800;color:#fbbf24;text-align:center;
        animation:stackIn .2s ease-out;}
      @keyframes stackIn{from{transform:scale(.8) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
      .ms-result-row{display:flex;gap:3px;flex-wrap:wrap;z-index:1;max-width:680px;justify-content:center;}
      .ms-result-chip{padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;
        background:rgba(96,165,250,.12);border:1px solid rgba(96,165,250,.3);color:#93c5fd;}
      .ms-result-chip.no-ans{background:rgba(107,114,128,.1);border-color:rgba(107,114,128,.25);color:#6b7280;}
      .ms-btn{padding:11px 26px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#14532d,#16a34a);color:#fff;
        box-shadow:0 4px 16px rgba(20,83,45,.4);transition:all .2s;z-index:1;}
      .ms-btn:hover:not(:disabled){transform:translateY(-2px);}
      .ms-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .ms-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .ms-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .ms-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .ms-win-h1{font-size:22px;font-weight:900;color:#86efac;}
      .ms-win-p{color:#c4c9e8;font-size:12.5px;max-width:420px;text-align:center;line-height:1.6;}
      .ms-win-btn{padding:10px 26px;background:linear-gradient(135deg,#14532d,#16a34a);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    const maxH=Math.max(...HEIGHTS);
    let idx=0,stack=[],results=new Array(HEIGHTS.length).fill(-1),done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="ms-root" id="ms-root">
        <div class="ms-title">🌴 Jungle Treetop Views</div>
        <div class="ms-story">
          🐵 <strong>Milo the Monkey</strong> wants to see the view from each tree!
          For each tree, find the <strong>next tree that is TALLER</strong> (to the right).
          A <strong style="color:#fbbf24">Monotonic Stack</strong> helps by removing trees
          that are no longer useful!
        </div>
        <div class="ms-area">
          <div class="ms-forest">
            <div class="ms-forest-title">🌴 Jungle (heights)</div>
            <div class="ms-trees" id="ms-trees"></div>
          </div>
          <div class="ms-stack-panel">
            <div class="ms-stack-title">📚 Stack</div>
            <div class="ms-stack-box" id="ms-stack-box"><div style="color:#2d3748;font-size:10px;text-align:center">empty</div></div>
          </div>
        </div>
        <div class="ms-result-row" id="ms-result-row"></div>
        <button class="ms-btn" id="ms-btn" aria-label="Add next tree to stack and find its next taller tree">🌴 Process Next Tree!</button>
        <div class="ms-status" id="ms-status">👆 Click to process the next tree and update the stack!</div>
      </div>`;
    const root=container.querySelector('#ms-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> A Monotonic Stack maintains elements in sorted order to efficiently find next-greater values.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Process each tree height one at a time.</li><li>Pop shorter trees off the stack when a taller tree arrives.</li><li>Each popped tree&#39;s &quot;next taller&quot; is the current tree!</li></ul><div class="hw-insight">💡 Key insight: Monotonic stack → each element enters/exits at most once = O(n).</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#ms-btn').addEventListener('click',processNext);
    render();updateStepIndicator(1,HEIGHTS.length);

    function processNext(){
      if(done||idx>=HEIGHTS.length)return;
      // Pop all shorter stack entries — current tree is their "next greater"
      const pops=[];
      while(stack.length>0&&HEIGHTS[stack[stack.length-1]]<HEIGHTS[idx]){
        const popped=stack.pop();
        results[popped]=idx;
        pops.push(popped);
      }
      const statusEl=container.querySelector('#ms-status');
      if(pops.length>0){
        statusEl.innerHTML=`🌴 Tree ${idx} (h=${HEIGHTS[idx]}) is taller! Popped trees [${pops.join(', ')}] — their next taller = tree ${idx}.`;
      } else {
        statusEl.innerHTML=`📚 Tree ${idx} (h=${HEIGHTS[idx]}) pushed to stack. No shorter trees waiting.`;
      }
      stack.push(idx);
      idx++;
      if(idx===HEIGHTS.length){
        // Remaining stack items have no taller tree
        done=true;
        container.querySelector('#ms-btn').disabled=true;
        setTimeout(celebrate,500);
      } else {
        container.querySelector('#ms-btn').textContent=`🌴 Process Tree ${idx}!`;
      }
      render();updateStepIndicator(Math.min(idx+1,HEIGHTS.length),HEIGHTS.length);
    }
    function render(){
      const treesEl=container.querySelector('#ms-trees');
      const stackEl=container.querySelector('#ms-stack-box');
      const resultsEl=container.querySelector('#ms-result-row');
      treesEl.innerHTML='';
      HEIGHTS.forEach((h,i)=>{
        const slot=document.createElement('div');slot.className='ms-tree-slot';
        const tree=document.createElement('div');
        const heightPx=Math.round((h/maxH)*108)+8;
        tree.className='ms-tree'+(i===idx?' current':stack.includes(i)?' in-stack':i<idx?results[i]>=0?' solved':' no-taller':'');
        tree.style.height=heightPx+'px';
        tree.style.background=i>=idx?`hsl(${120+i*12},40%,15%)`:'';
        tree.innerHTML=`<span class="th">${h}</span>🌴`;
        slot.appendChild(tree);
        const lbl=document.createElement('div');lbl.className='ms-tree-idx';lbl.textContent=i;slot.appendChild(lbl);
        treesEl.appendChild(slot);
      });
      // Stack
      stackEl.innerHTML='';
      if(stack.length===0){stackEl.innerHTML='<div style="color:#2d3748;font-size:10px;text-align:center">empty</div>';}
      else{[...stack].reverse().forEach(si=>{const d=document.createElement('div');d.className='ms-stack-item';d.textContent=`[${si}] h=${HEIGHTS[si]}`;stackEl.appendChild(d);});}
      // Results
      resultsEl.innerHTML='';
      for(let i=0;i<idx;i++){
        const d=document.createElement('div');
        d.className='ms-result-chip'+(results[i]<0?' no-ans':'');
        d.textContent=results[i]>=0?`${i}→${results[i]}(h=${HEIGHTS[results[i]]})`:`${i}→none`;
        resultsEl.appendChild(d);
      }
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#86efac','#fbbf24','#60a5fa','#f472b6','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='ms-win';
      ov.innerHTML=`
        <div class="ms-win-big">🌴</div>
        <div class="ms-win-h1">All Views Found!</div>
        <div class="ms-win-p">
          Found every "next greater element" in just <strong style="color:#fbbf24">O(n)</strong>!<br>
          Each tree was pushed and popped at most once from the stack.<br>
          <small style="color:#8892b0">Key insight: "next greater/smaller element" → Monotonic Stack ✨</small>
        </div>
        <button class="ms-win-btn" id="ms-replay">🔄 New Jungle!</button>`;
      root.appendChild(ov);
      ov.querySelector('#ms-replay').addEventListener('click',()=>{ov.remove();idx=0;stack=[];results=new Array(HEIGHTS.length).fill(-1);done=false;
        container.querySelector('#ms-btn').disabled=false;container.querySelector('#ms-btn').textContent='🌴 Process Next Tree!';
        container.querySelector('#ms-status').textContent='👆 Click to process the next tree and update the stack!';
        render();updateStepIndicator(1,HEIGHTS.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('monotonic-stack',{init,
      nextStep:()=>processNext(),
      prevStep:()=>{idx=0;stack=[];results=new Array(HEIGHTS.length).fill(-1);done=false;
        container.querySelector('#ms-btn').disabled=false;container.querySelector('#ms-btn').textContent='🌴 Process Next Tree!';
        container.querySelectorAll('.ms-win').forEach(e=>e.remove());render();updateStepIndicator(1,HEIGHTS.length);},
      setMode:()=>{}});
  }
})();