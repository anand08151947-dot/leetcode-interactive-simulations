/* Fast & Slow Pointers — The Cursed Race Track 🎢
   INTERACTIVE: Click "Move Both!" to advance turtle (1 step)
   and rabbit (2 steps). When they meet — CYCLE FOUND! */
(() => {
  // Linked list: 0→1→2→3→4→5→6→back to 2
  const NODES = [
    {id:0,label:'🏁 Start',next:1},
    {id:1,label:'🌲 Forest',next:2},
    {id:2,label:'🌊 River',next:3},  // cycle entry
    {id:3,label:'🏔️ Mountain',next:4},
    {id:4,label:'🌋 Volcano',next:5},
    {id:5,label:'🧊 Ice Cave',next:6},
    {id:6,label:'🌀 Whirlpool',next:2}  // back to node 2 = cycle!
  ];
  const CYCLE_ENTRY=2;

  function injectStyles(){
    if(document.getElementById('fsp-styles'))return;
    const s=document.createElement('style');s.id='fsp-styles';
    s.textContent=`
      .fsp-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a1a0a 0%,#0f1f30 50%,#1a0a0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .fsp-title{font-size:16px;font-weight:900;color:#34d399;text-shadow:0 0 18px rgba(52,211,153,.4);z-index:1;}
      .fsp-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .fsp-track{width:100%;max-width:700px;z-index:1;}
      .fsp-nodes{display:flex;align-items:center;justify-content:center;gap:0;position:relative;padding:10px 0;}
      .fsp-node{display:flex;flex-direction:column;align-items:center;position:relative;min-width:78px;}
      .fsp-circle{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:20px;border:2.5px solid rgba(255,255,255,.1);background:#0f172a;transition:all .3s;}
      .fsp-circle.visited{border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.1);}
      .fsp-circle.cycle-entry{border-color:rgba(251,191,36,.5);box-shadow:0 0 14px rgba(251,191,36,.3);}
      .fsp-circle.meeting{border-color:#fbbf24!important;background:rgba(251,191,36,.2)!important;
        box-shadow:0 0 30px rgba(251,191,36,.6)!important;animation:meetPulse .5s ease-in-out infinite alternate!important;}
      @keyframes meetPulse{from{transform:scale(1)}to{transform:scale(1.15)}}
      .fsp-nlabel{font-size:8px;color:#4b5563;margin-top:3px;text-align:center;max-width:72px;}
      .fsp-arrow{font-size:20px;color:#2d3748;flex-shrink:0;margin:0 -2px;margin-bottom:14px;}
      .fsp-arrow.active{color:#4ade80;}
      .fsp-cycle-arrow{position:absolute;bottom:-28px;font-size:10px;color:#fbbf24;font-weight:800;
        display:flex;align-items:center;gap:3px;white-space:nowrap;}
      .fsp-heroes{display:flex;gap:3px;justify-content:center;flex-wrap:wrap;z-index:1;}
      .fsp-hero{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.12);border-radius:10px;
        padding:8px 18px;text-align:center;min-width:130px;}
      .fsp-hero-em{font-size:28px;} .fsp-hero-name{font-size:11px;font-weight:800;margin-top:2px;}
      .fsp-hero-pos{font-size:10px;color:#6b7280;margin-top:1px;}
      .fsp-hero-steps{font-size:9px;color:#4b5563;}
      .fsp-slow .fsp-hero-name{color:#34d399;} .fsp-fast .fsp-hero-name{color:#f472b6;}
      .fsp-btn{padding:13px 32px;border-radius:14px;border:none;cursor:pointer;font-size:15px;font-weight:900;
        background:linear-gradient(135deg,#065f46,#059669);color:#fff;
        box-shadow:0 4px 20px rgba(6,95,70,.4);transition:all .2s;z-index:1;}
      .fsp-btn:hover:not(:disabled){transform:translateY(-3px) scale(1.04);}
      .fsp-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .fsp-status{font-size:13px;color:#94a3b8;text-align:center;z-index:1;max-width:540px;min-height:22px;}
      .fsp-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .fsp-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .fsp-win-h1{font-size:23px;font-weight:900;color:#34d399;}
      .fsp-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .fsp-win-btn{padding:10px 26px;background:linear-gradient(135deg,#065f46,#059669);border:none;
        border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    let slow=0,fast=0,moveCount=0,done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="fsp-root" id="fsp-root">
        <div class="fsp-title">🎢 The Cursed Race Track</div>
        <div class="fsp-story">
          🐢 <strong>Tina the Turtle</strong> (1 step) and 🐇 <strong>Rico the Rabbit</strong> (2 steps)
          enter a mysterious race track that loops! If there's a cycle, they WILL eventually meet.
          Click <strong style="color:#34d399">Move Both!</strong> to advance them — see if they catch each other!
        </div>
        <div class="fsp-track">
          <div class="fsp-nodes" id="fsp-nodes"></div>
        </div>
        <div class="fsp-heroes">
          <div class="fsp-hero fsp-slow">
            <div class="fsp-hero-em">🐢</div>
            <div class="fsp-hero-name">Tina (Slow)</div>
            <div class="fsp-hero-pos" id="fsp-slow-pos">At: Node 0</div>
            <div class="fsp-hero-steps">Moves 1 step each turn</div>
          </div>
          <div class="fsp-hero fsp-fast">
            <div class="fsp-hero-em">🐇</div>
            <div class="fsp-hero-name">Rico (Fast)</div>
            <div class="fsp-hero-pos" id="fsp-fast-pos">At: Node 0</div>
            <div class="fsp-hero-steps">Moves 2 steps each turn</div>
          </div>
        </div>
        <button class="fsp-btn" id="fsp-move-btn" aria-label="Advance fast and slow runners one step">🏃 Move Both!</button>
        <div class="fsp-status" id="fsp-status">👇 Click Move Both! to start the race!</div>
      </div>`;
    const root=container.querySelector('#fsp-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Fast &amp; Slow Pointers detect cycles by using two runners at different speeds.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>The fast runner moves 2 steps; the slow runner moves 1.</li><li>If there&#39;s a cycle (loop), they will eventually meet.</li><li>No meeting point = no cycle!</li></ul><div class="hw-insight">💡 Key insight: Two speeds on a circular track → always meet inside the loop.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#fsp-move-btn').addEventListener('click',doMove);
    renderNodes();updateStepIndicator(1,7);

    function doMove(){
      if(done)return;
      slow=NODES[slow].next;
      fast=NODES[NODES[fast].next].next;
      moveCount++;
      renderNodes();
      container.querySelector('#fsp-slow-pos').textContent=`At: Node ${slow} (${NODES[slow].label})`;
      container.querySelector('#fsp-fast-pos').textContent=`At: Node ${fast} (${NODES[fast].label})`;
      const statusEl=container.querySelector('#fsp-status');
      if(slow===fast){
        done=true;
        container.querySelector('#fsp-move-btn').disabled=true;
        statusEl.innerHTML=`🎉 <strong style="color:#fbbf24">THEY MET at Node ${slow}!</strong> Cycle detected in ${moveCount} moves!`;
        setTimeout(celebrate,600);
      } else {
        statusEl.innerHTML=`Move ${moveCount}: 🐢 Tina at node ${slow}, 🐇 Rico at node ${fast} — different spots, keep going!`;
      }
      updateStepIndicator(Math.min(moveCount+1,7),7);
    }

    function renderNodes(){
      const nodesEl=container.querySelector('#fsp-nodes');
      nodesEl.innerHTML='';
      NODES.forEach((node,i)=>{
        const slot=document.createElement('div');slot.className='fsp-node';
        const hasSlow=i===slow, hasFast=i===fast, isMeet=hasSlow&&hasFast&&moveCount>0;
        const circ=document.createElement('div');
        circ.className='fsp-circle'+(isMeet?' meeting':hasSlow||hasFast?' visited':i===CYCLE_ENTRY?' cycle-entry':'');
        const content=isMeet?'✨':(hasSlow&&hasFast?'🎯':hasSlow?'🐢':hasFast?'🐇':node.label.split(' ')[0]);
        circ.textContent=content;
        circ.title=node.label;
        slot.appendChild(circ);
        const lbl=document.createElement('div');lbl.className='fsp-nlabel';lbl.textContent=`${i}: ${node.label}`;
        slot.appendChild(lbl);
        nodesEl.appendChild(slot);
        if(i<NODES.length-1){
          const arr=document.createElement('div');
          arr.className='fsp-arrow'+(i===slow||i===fast?' active':'');
          arr.textContent='→';nodesEl.appendChild(arr);
        }
      });
      // Cycle arrow label
      const cycleNote=document.createElement('div');
      cycleNote.style.cssText='text-align:center;font-size:10px;color:#fbbf24;margin-top:4px;';
      cycleNote.innerHTML='↩ Node 6 loops back to Node 2 <strong>(cycle!)</strong>';
      nodesEl.appendChild(cycleNote);
    }

    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#34d399','#fbbf24','#f472b6','#60a5fa','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='fsp-win';
      ov.innerHTML=`
        <div class="fsp-win-big">🎢</div>
        <div class="fsp-win-h1">Cycle Detected!</div>
        <div class="fsp-win-p">
          🐢 Tina and 🐇 Rico met at <strong style="color:#fbbf24">Node ${slow}</strong> after ${moveCount} moves!<br>
          Floyd's Cycle Detection: if a loop exists, fast & slow MUST meet!<br>
          <small style="color:#8892b0">Key insight: "cycle in linked list" → Fast & Slow Pointers ✨</small>
        </div>
        <button class="fsp-win-btn" id="fsp-replay">🔄 Race Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#fsp-replay').addEventListener('click',()=>{ov.remove();slow=0;fast=0;moveCount=0;done=false;
        container.querySelector('#fsp-move-btn').disabled=false;
        container.querySelector('#fsp-slow-pos').textContent='At: Node 0';
        container.querySelector('#fsp-fast-pos').textContent='At: Node 0';
        container.querySelector('#fsp-status').textContent='👇 Click Move Both! to start the race!';
        renderNodes();updateStepIndicator(1,7);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('fast-slow-pointers',{init,
      nextStep:()=>doMove(),
      prevStep:()=>{slow=0;fast=0;moveCount=0;done=false;
        container.querySelector('#fsp-move-btn').disabled=false;
        container.querySelector('#fsp-slow-pos').textContent='At: Node 0';
        container.querySelector('#fsp-fast-pos').textContent='At: Node 0';
        container.querySelector('#fsp-status').textContent='👇 Click Move Both! to start the race!';
        container.querySelectorAll('.fsp-win').forEach(e=>e.remove());
        renderNodes();updateStepIndicator(1,7);},
      setMode:()=>{}});
  }
})();