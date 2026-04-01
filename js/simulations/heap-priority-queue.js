/* Heap/Priority Queue — Space Mission Control 🚀
   INTERACTIVE: Missions arrive with urgency 1-10.
   You must ALWAYS launch the most urgent mission first! */
(() => {
  const MISSIONS=[
    {name:'🛸 Alien Signal',urgency:8},{name:'🌋 Volcano Alert',urgency:3},
    {name:'⚡ Power Surge',urgency:6},{name:'🌊 Tsunami Warning',urgency:10},
    {name:'🔬 Lab Experiment',urgency:2},{name:'🚀 Rocket Leak',urgency:9},
    {name:'💊 Medical Supply',urgency:5},{name:'🌪️ Storm Watch',urgency:7}
  ];
  function injectStyles(){
    if(document.getElementById('hp-styles'))return;
    const s=document.createElement('style');s.id='hp-styles';
    s.textContent=`
      .hp-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:8px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a0a1e 0%,#0f0a2e 50%,#1a0a0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .hp-title{font-size:16px;font-weight:900;color:#a78bfa;text-shadow:0 0 18px rgba(167,139,250,.5);z-index:1;}
      .hp-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .hp-area{display:flex;gap:14px;z-index:1;width:100%;max-width:720px;justify-content:center;align-items:flex-start;}
      .hp-queue{flex:1;max-width:320px;}
      .hp-q-title{font-size:10px;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
      .hp-missions{display:flex;flex-direction:column;gap:5px;max-height:220px;overflow-y:auto;}
      .hp-mission{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;
        background:#0f0f2a;border:2px solid rgba(255,255,255,.07);transition:all .3s;cursor:pointer;}
      .hp-mission:hover:not(.selected){background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.2);}
      .hp-mission.top{border-color:#fbbf24!important;background:rgba(251,191,36,.1)!important;
        animation:topPulse .9s ease-in-out infinite alternate!important;}
      @keyframes topPulse{from{box-shadow:0 0 4px rgba(251,191,36,.2)}to{box-shadow:0 0 16px rgba(251,191,36,.5)}}
      .hp-mission.selected{border-color:#a78bfa;background:rgba(167,139,250,.12);}
      .hp-mission.launched{opacity:.3;filter:grayscale(.9);cursor:not-allowed;}
      .hp-urg{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:11px;font-weight:900;flex-shrink:0;}
      .urg-high{background:rgba(239,68,68,.25);color:#f87171;border:1.5px solid rgba(239,68,68,.4);}
      .urg-mid{background:rgba(251,191,36,.2);color:#fbbf24;border:1.5px solid rgba(251,191,36,.35);}
      .urg-low{background:rgba(74,222,128,.15);color:#4ade80;border:1.5px solid rgba(74,222,128,.3);}
      .hp-mname{font-size:12px;font-weight:700;color:#c4c9e8;flex:1;}
      .hp-panel{flex:1;max-width:240px;display:flex;flex-direction:column;gap:8px;}
      .hp-selected-box{background:rgba(167,139,250,.08);border:1.5px solid rgba(167,139,250,.25);border-radius:10px;padding:10px 12px;text-align:center;}
      .hp-sel-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;margin-bottom:5px;}
      .hp-sel-mission{font-size:13px;font-weight:800;color:#c4c9e8;min-height:20px;}
      .hp-sel-urgency{font-size:24px;font-weight:900;color:#fbbf24;margin-top:3px;}
      .hp-launch-btn{padding:12px;border-radius:12px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#4c1d95,#7c3aed);color:#fff;
        box-shadow:0 4px 16px rgba(76,29,149,.4);transition:all .2s;width:100%;}
      .hp-launch-btn:hover:not(:disabled){transform:translateY(-2px);}
      .hp-launch-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .hp-score{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:8px 12px;text-align:center;}
      .hp-score-v{font-size:20px;font-weight:900;color:#a78bfa;}
      .hp-score-l{font-size:9px;color:#6b7280;text-transform:uppercase;}
      .hp-log{background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 10px;max-height:80px;overflow-y:auto;}
      .hp-log-title{font-size:9px;color:#4b5563;text-transform:uppercase;font-weight:800;margin-bottom:4px;}
      .hp-log-item{font-size:10px;color:#6b7280;padding:1px 0;}
      .hp-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .hp-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .hp-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .hp-win-h1{font-size:22px;font-weight:900;color:#a78bfa;}
      .hp-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .hp-win-btn{padding:10px 26px;background:linear-gradient(135deg,#4c1d95,#7c3aed);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    let heap=[...MISSIONS],launched=[],selected=null,mistakes=0,done=false;
    const startTime=Date.now();
    // Max-heap: sort by urgency descending
    heap.sort((a,b)=>b.urgency-a.urgency);
    container.innerHTML=`
      <div class="hp-root" id="hp-root">
        <div class="hp-title">🚀 Space Mission Control</div>
        <div class="hp-story">
          👨‍🚀 <strong>Commander Nova</strong> must launch missions in order of <strong>urgency</strong>!
          The <strong style="color:#a78bfa">Priority Queue</strong> always knows which mission needs to go first.
          Click the mission you think is most urgent, then hit <strong>Launch!</strong>
        </div>
        <div class="hp-area">
          <div class="hp-queue">
            <div class="hp-q-title">📋 Mission Queue</div>
            <div class="hp-missions" id="hp-missions"></div>
          </div>
          <div class="hp-panel">
            <div class="hp-selected-box">
              <div class="hp-sel-title">Selected Mission</div>
              <div class="hp-sel-mission" id="hp-sel-name">Click a mission →</div>
              <div class="hp-sel-urgency" id="hp-sel-urg">-</div>
            </div>
            <button class="hp-launch-btn" id="hp-launch" aria-label="Launch highest priority mission from the heap" disabled>🚀 Launch Mission!</button>
            <div class="hp-score"><div class="hp-score-v" id="hp-launched-count">0/${MISSIONS.length}</div><div class="hp-score-l">Launched</div></div>
            <div class="hp-log"><div class="hp-log-title">Launch Log</div><div id="hp-log-items"></div></div>
          </div>
        </div>
        <div class="hp-status" id="hp-status">👆 Click the most urgent mission to select it, then Launch!</div>
      </div>`;
    const root=container.querySelector('#hp-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> A Max-Heap (Priority Queue) always gives you the highest-priority item next.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Missions arrive with different priority scores.</li><li>The heap always promotes the highest-priority mission to the top.</li><li>Launch all missions in priority order to win!</li></ul><div class="hw-insight">💡 Key insight: Heap insert and extract-max are both O(log n).</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#hp-launch').addEventListener('click',doLaunch);
    renderMissions();updateStepIndicator(1,MISSIONS.length);

    function selectMission(m){
      selected=m;
      container.querySelector('#hp-sel-name').textContent=m.name;
      container.querySelector('#hp-sel-urg').textContent=`Urgency: ${m.urgency}/10`;
      container.querySelector('#hp-launch').disabled=false;
      renderMissions();
    }
    function doLaunch(){
      if(!selected||done)return;
      const maxUrgency=Math.max(...heap.map(m=>m.urgency));
      if(selected.urgency<maxUrgency){
        mistakes++;
        const topM=heap.find(m=>m.urgency===maxUrgency);
        container.querySelector('#hp-status').innerHTML=`❌ Wait! <strong style="color:#f87171">${topM.name}</strong> has urgency <strong>${maxUrgency}</strong> — more urgent! The heap always gives us the max first!`;
        selected=null;
        container.querySelector('#hp-sel-name').textContent='Click a mission →';
        container.querySelector('#hp-sel-urg').textContent='-';
        container.querySelector('#hp-launch').disabled=true;
        renderMissions();
        return;
      }
      // Launch it
      heap=heap.filter(m=>m!==selected);
      launched.push(selected);
      const log=container.querySelector('#hp-log-items');
      const li=document.createElement('div');li.className='hp-log-item';
      li.textContent=`${launched.length}. ${selected.name} (${selected.urgency}/10)`;
      log.insertBefore(li,log.firstChild);
      container.querySelector('#hp-launched-count').textContent=`${launched.length}/${MISSIONS.length}`;
      container.querySelector('#hp-status').innerHTML=`🚀 Launched <strong style="color:#a78bfa">${selected.name}</strong> (urgency ${selected.urgency})!`;
      selected=null;
      container.querySelector('#hp-sel-name').textContent='Click a mission →';
      container.querySelector('#hp-sel-urg').textContent='-';
      container.querySelector('#hp-launch').disabled=true;
      updateStepIndicator(launched.length,MISSIONS.length);
      if(heap.length===0){done=true;setTimeout(celebrate,500);}
      renderMissions();
    }
    function renderMissions(){
      const el=container.querySelector('#hp-missions');el.innerHTML='';
      [...heap].sort((a,b)=>b.urgency-a.urgency).forEach(m=>{
        const d=document.createElement('div');
        const isTop=m.urgency===Math.max(...heap.map(x=>x.urgency));
        d.className='hp-mission'+(isTop?' top':'')+(m===selected?' selected':'');
        const urgClass=m.urgency>=8?'urg-high':m.urgency>=5?'urg-mid':'urg-low';
        d.innerHTML=`<div class="hp-urg ${urgClass}">${m.urgency}</div><div class="hp-mname">${m.name}</div>`;
        d.addEventListener('click',()=>selectMission(m));
        el.appendChild(d);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const stars=mistakes===0?3:mistakes<=2?3:2;
      const colors=['#a78bfa','#fbbf24','#4ade80','#60a5fa','#f472b6'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='hp-win';
      ov.innerHTML=`
        <div class="hp-win-big">🚀</div>
        <div class="hp-win-h1">All Missions Launched!</div>
        <div class="hp-win-p">
          All ${MISSIONS.length} missions launched in <strong style="color:#fbbf24">perfect priority order</strong>!<br>
          A Heap (Priority Queue) always gives you the MAX/MIN in O(log n)!<br>
          <small style="color:#8892b0">Key insight: "always process largest/smallest" → Heap ✨</small>
        </div>
        <button class="hp-win-btn" id="hp-replay">🔄 New Mission!</button>`;
      root.appendChild(ov);
      ov.querySelector('#hp-replay').addEventListener('click',()=>{ov.remove();heap=[...MISSIONS].sort((a,b)=>b.urgency-a.urgency);launched=[];selected=null;mistakes=0;done=false;
        container.querySelector('#hp-launched-count').textContent=`0/${MISSIONS.length}`;
        container.querySelector('#hp-log-items').innerHTML='';
        container.querySelector('#hp-launch').disabled=true;
        container.querySelector('#hp-sel-name').textContent='Click a mission →';
        container.querySelector('#hp-sel-urg').textContent='-';
        container.querySelector('#hp-status').textContent='👆 Click the most urgent mission to select it, then Launch!';
        renderMissions();updateStepIndicator(1,MISSIONS.length);});
      onComplete&&onComplete(stars,elapsed);
    }
    app.registerSim('heap-priority-queue',{init,
      nextStep:()=>{
        if(heap.length===0)return;
        const top=heap.reduce((a,b)=>a.urgency>b.urgency?a:b);
        selectMission(top);setTimeout(doLaunch,200);
      },
      prevStep:()=>{heap=[...MISSIONS].sort((a,b)=>b.urgency-a.urgency);launched=[];selected=null;mistakes=0;done=false;
        container.querySelector('#hp-launched-count').textContent=`0/${MISSIONS.length}`;
        container.querySelector('#hp-log-items').innerHTML='';
        container.querySelector('#hp-launch').disabled=true;
        container.querySelector('#hp-sel-name').textContent='Click a mission →';
        container.querySelector('#hp-sel-urg').textContent='-';
        container.querySelectorAll('.hp-win').forEach(e=>e.remove());
        renderMissions();updateStepIndicator(1,MISSIONS.length);},
      setMode:()=>{}});
  }
})();