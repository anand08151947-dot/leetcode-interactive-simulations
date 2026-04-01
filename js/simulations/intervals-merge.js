/* Intervals Merge — The Party Planner 🎉
   INTERACTIVE: Drag or click to merge overlapping parties
   on the timeline! No two parties can overlap! */
(() => {
  const EVENTS=[
    {name:'🎂 Birthday',start:1,end:4,color:'#f472b6'},
    {name:'🎮 Game Night',start:3,end:6,color:'#a78bfa'},
    {name:'🎵 Concert',start:8,end:11,color:'#60a5fa'},
    {name:'🍕 Pizza Party',start:10,end:13,color:'#fb923c'},
    {name:'🎨 Art Show',start:15,end:18,color:'#34d399'},
    {name:'🏊 Pool Party',start:17,end:20,color:'#fbbf24'}
  ];
  const TIMELINE_MAX=22;
  function injectStyles(){
    if(document.getElementById('im-styles'))return;
    const s=document.createElement('style');s.id='im-styles';
    s.textContent=`
      .im-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a0a1e 0%,#0a0f1e 50%,#1e0a0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .im-title{font-size:16px;font-weight:900;color:#f472b6;text-shadow:0 0 18px rgba(244,114,182,.4);z-index:1;}
      .im-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .im-timeline-wrap{width:100%;max-width:680px;z-index:1;}
      .im-tl-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;text-align:center;}
      .im-timeline{position:relative;height:24px;background:rgba(255,255,255,.04);border-radius:12px;
        border:1px solid rgba(255,255,255,.08);margin-bottom:4px;}
      .im-tl-marks{display:flex;justify-content:space-between;font-size:8px;color:#374151;padding:0 4px;}
      .im-events{width:100%;max-width:680px;z-index:1;}
      .im-events-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;text-align:center;}
      .im-event-row{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:9px;
        border:1.5px solid rgba(255,255,255,.07);background:#0a0f1e;margin-bottom:4px;transition:all .3s;}
      .im-event-row.overlaps{border-color:#f87171;background:rgba(248,113,113,.08);animation:overlapFlash .4s ease-out 2;}
      @keyframes overlapFlash{0%,100%{background:rgba(248,113,113,.08)}50%{background:rgba(248,113,113,.2)}}
      .im-event-row.merged{border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.06);}
      .im-ev-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
      .im-ev-name{font-size:12px;font-weight:700;color:#c4c9e8;flex:1;}
      .im-ev-range{font-size:11px;color:#6b7280;font-weight:600;}
      .im-ev-badge{padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;}
      .im-tl-bar{position:absolute;height:100%;border-radius:11px;transition:all .4s;display:flex;align-items:center;justify-content:center;}
      .im-merged-events{width:100%;max-width:680px;z-index:1;}
      .im-me-title{font-size:10px;font-weight:800;color:#4ade80;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;text-align:center;}
      .im-merged-row{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;}
      .im-merged-chip{padding:5px 14px;border-radius:8px;font-size:12px;font-weight:800;
        background:rgba(74,222,128,.1);border:1.5px solid rgba(74,222,128,.35);color:#4ade80;
        animation:chipIn .3s ease-out;}
      @keyframes chipIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
      .im-btn{padding:11px 26px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#831843,#db2777);color:#fff;
        box-shadow:0 4px 16px rgba(131,24,67,.4);transition:all .2s;z-index:1;}
      .im-btn:hover:not(:disabled){transform:translateY(-2px);}
      .im-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .im-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .im-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .im-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .im-win-h1{font-size:22px;font-weight:900;color:#f472b6;}
      .im-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .im-win-btn{padding:10px 26px;background:linear-gradient(135deg,#831843,#db2777);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    let events=[...EVENTS.map(e=>({...e}))].sort((a,b)=>a.start-b.start);
    let merged=[],step=0,done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="im-root" id="im-root">
        <div class="im-title">🎉 The Party Planner</div>
        <div class="im-story">
          📅 <strong>Maya</strong> is planning parties but some overlap!
          She needs to <strong>merge overlapping events</strong> into one bigger event.
          Sort them by start time, then greedily merge any that overlap with the last merged event!
        </div>
        <div class="im-timeline-wrap">
          <div class="im-tl-title">📅 Timeline (hours)</div>
          <div class="im-timeline" id="im-timeline"></div>
          <div class="im-tl-marks" id="im-marks"></div>
        </div>
        <div class="im-events">
          <div class="im-events-title">🎊 Events (sorted by start time)</div>
          <div id="im-events-list"></div>
        </div>
        <div class="im-merged-events">
          <div class="im-me-title">✅ Merged Schedule</div>
          <div class="im-merged-row" id="im-merged-row"><div style="color:#1f2937;font-size:11px;text-align:center;width:100%">No merged events yet</div></div>
        </div>
        <button class="im-btn" id="im-btn" aria-label="Add next party event and merge overlapping intervals">🎉 Process Next Event!</button>
        <div class="im-status" id="im-status">👆 Watch how events merge when they overlap!</div>
      </div>`;
    const root=container.querySelector('#im-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Interval Merging combines overlapping time ranges into a single continuous range.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Party events are added in sorted order by start time.</li><li>If the new event overlaps the last one, merge them.</li><li>Merge all overlapping events to finalize the schedule!</li></ul><div class="hw-insight">💡 Key insight: Sort by start → merge if next.start ≤ current.end.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#im-btn').addEventListener('click',processNext);
    renderTimeline();renderEvents();updateStepIndicator(1,events.length);

    function processNext(){
      if(done||step>=events.length)return;
      const ev=events[step];
      const statusEl=container.querySelector('#im-status');
      if(merged.length===0||ev.start>merged[merged.length-1].end){
        merged.push({...ev,names:[ev.name]});
        statusEl.innerHTML=`✅ <strong>${ev.name}</strong> starts at ${ev.start} — no overlap, adding as new event!`;
      } else {
        const last=merged[merged.length-1];
        const oldEnd=last.end;
        last.end=Math.max(last.end,ev.end);
        last.names.push(ev.name);
        last.name=last.names.join(' + ');
        statusEl.innerHTML=`🔀 <strong>${ev.name}</strong> overlaps! Merged with previous → [${last.start}, ${last.end}]`;
      }
      step++;
      if(step>=events.length){done=true;container.querySelector('#im-btn').disabled=true;setTimeout(celebrate,500);}
      renderTimeline();renderEvents();renderMerged();
      updateStepIndicator(Math.min(step+1,events.length),events.length);
    }
    function renderTimeline(){
      const tl=container.querySelector('#im-timeline');
      const marks=container.querySelector('#im-marks');
      tl.innerHTML='';marks.innerHTML='';
      const scale=100/TIMELINE_MAX;
      [...(step>0?merged:[]),
       ...events.slice(step).map((e,i)=>({...e,names:[e.name],_unprocessed:true,_idx:step+i}))
      ].forEach((ev,i)=>{
        const bar=document.createElement('div');bar.className='im-tl-bar';
        bar.style.left=`${ev.start*scale}%`;bar.style.width=`${(ev.end-ev.start)*scale}%`;
        bar.style.background=ev._unprocessed?`${events[ev._idx]?.color||'#6b7280'}55`:`${ev.color||EVENTS.find(e=>e.name===ev.names[0])?.color||'#4ade80'}`;
        bar.style.opacity=ev._unprocessed?'0.5':'0.85';
        tl.appendChild(bar);
      });
      for(let i=0;i<=TIMELINE_MAX;i+=2){
        const m=document.createElement('span');m.textContent=i;marks.appendChild(m);
      }
    }
    function renderEvents(){
      const listEl=container.querySelector('#im-events-list');listEl.innerHTML='';
      events.forEach((ev,i)=>{
        const d=document.createElement('div');
        const isProcessed=i<step;
        const isOverlap=isProcessed&&i>0&&ev.start<=events[i-1].end;
        d.className='im-event-row'+(i===step&&!done?' current':'')+(isOverlap?' overlaps':isProcessed?' merged':'');
        d.innerHTML=`
          <div class="im-ev-dot" style="background:${ev.color}"></div>
          <div class="im-ev-name">${ev.name}</div>
          <div class="im-ev-range">[${ev.start}, ${ev.end}]</div>
          <div class="im-ev-badge" style="background:${isProcessed?'rgba(74,222,128,.15)':'rgba(255,255,255,.05)'};color:${isProcessed?'#4ade80':'#374151'}">${isProcessed?'✓ done':'pending'}</div>`;
        listEl.appendChild(d);
      });
    }
    function renderMerged(){
      const el=container.querySelector('#im-merged-row');el.innerHTML='';
      if(merged.length===0){el.innerHTML='<div style="color:#1f2937;font-size:11px;text-align:center;width:100%">No merged events yet</div>';return;}
      merged.forEach(m=>{
        const d=document.createElement('div');d.className='im-merged-chip';
        d.textContent=`[${m.start}–${m.end}] (${m.names.length} party${m.names.length>1?'ies':''})`;
        el.appendChild(d);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#f472b6','#fbbf24','#4ade80','#60a5fa','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='im-win';
      ov.innerHTML=`
        <div class="im-win-big">🎉</div>
        <div class="im-win-h1">Schedule Sorted!</div>
        <div class="im-win-p">
          ${events.length} events → <strong style="color:#fbbf24">${merged.length} non-overlapping blocks</strong>!<br>
          Sort + one pass = O(n log n) — easy and elegant!<br>
          <small style="color:#8892b0">Key insight: "merge overlapping intervals" → Sort + Greedy Merge ✨</small>
        </div>
        <button class="im-win-btn" id="im-replay">🔄 New Schedule!</button>`;
      root.appendChild(ov);
      ov.querySelector('#im-replay').addEventListener('click',()=>{ov.remove();events=[...EVENTS.map(e=>({...e}))].sort((a,b)=>a.start-b.start);merged=[];step=0;done=false;
        container.querySelector('#im-btn').disabled=false;
        container.querySelector('#im-status').textContent='👆 Watch how events merge when they overlap!';
        renderTimeline();renderEvents();container.querySelector('#im-merged-row').innerHTML='<div style="color:#1f2937;font-size:11px;text-align:center;width:100%">No merged events yet</div>';
        updateStepIndicator(1,events.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('intervals-merge',{init,
      nextStep:()=>processNext(),
      prevStep:()=>{events=[...EVENTS.map(e=>({...e}))].sort((a,b)=>a.start-b.start);merged=[];step=0;done=false;
        container.querySelector('#im-btn').disabled=false;
        container.querySelectorAll('.im-win').forEach(e=>e.remove());
        renderTimeline();renderEvents();container.querySelector('#im-merged-row').innerHTML='<div style="color:#1f2937;font-size:11px;text-align:center;width:100%">No merged events yet</div>';
        updateStepIndicator(1,events.length);},
      setMode:()=>{}});
  }
  app.registerSim('intervals-merge', { init });
})();