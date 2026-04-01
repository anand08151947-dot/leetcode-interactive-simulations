/* Heap + Sorting — K Closest Stars ⭐
   INTERACTIVE: Find the 3 closest stars to Earth using Heap + distances! */
(() => {
  const STARS=[
    {name:'Sirius',x:60,y:80,emoji:'⭐'},{name:'Vega',x:140,y:40,emoji:'🌟'},
    {name:'Proxima',x:100,y:160,emoji:'💫'},{name:'Rigel',x:220,y:90,emoji:'✨'},
    {name:'Canopus',x:180,y:190,emoji:'⭐'},{name:'Arcturus',x:300,y:60,emoji:'🌟'},
    {name:'Capella',x:260,y:170,emoji:'💫'},{name:'Betelgeuse',x:340,y:130,emoji:'✨'},
    {name:'Altair',x:80,y:220,emoji:'⭐'},{name:'Aldebaran',x:310,y:210,emoji:'🌟'}
  ];
  const ORIGIN={x:200,y:130,emoji:'🌍'};
  const K=3;
  function dist(star){return Math.round(Math.sqrt(Math.pow(star.x-ORIGIN.x,2)+Math.pow(star.y-ORIGIN.y,2)));}
  const SORTED_BY_DIST=[...STARS].sort((a,b)=>dist(a)-dist(b));
  function injectStyles(){
    if(document.getElementById('hs-styles'))return;
    const s=document.createElement('style');s.id='hs-styles';
    s.textContent=`
      .hs-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#010114 0%,#04011e 50%,#000a14 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .hs-title{font-size:16px;font-weight:900;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.4);z-index:1;}
      .hs-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .hs-main{display:flex;gap:12px;z-index:1;width:100%;max-width:720px;}
      .hs-map-wrap{flex:1;}
      .hs-map-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;text-align:center;}
      .hs-svg{width:100%;min-height:150px;border-radius:10px;background:rgba(1,1,20,.6);border:1px solid rgba(255,255,255,.06);}
      .hs-right{min-width:170px;display:flex;flex-direction:column;gap:8px;}
      .hs-heap-panel{background:rgba(251,191,36,.06);border:1.5px solid rgba(251,191,36,.2);border-radius:10px;padding:8px;}
      .hs-heap-title{font-size:10px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
      .hs-heap-list{display:flex;flex-direction:column;gap:3px;}
      .hs-heap-item{padding:3px 8px;border-radius:7px;font-size:11px;font-weight:700;
        background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);color:#fde68a;
        display:flex;justify-content:space-between;}
      .hs-heap-item.max{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.3);color:#fca5a5;}
      .hs-result-panel{background:rgba(74,222,128,.06);border:1.5px solid rgba(74,222,128,.2);border-radius:10px;padding:8px;}
      .hs-result-title{font-size:10px;font-weight:800;color:#4ade80;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
      .hs-result-list{display:flex;flex-direction:column;gap:3px;}
      .hs-result-item{padding:3px 8px;border-radius:7px;font-size:11px;font-weight:700;
        background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.2);color:#86efac;}
      .hs-btn{padding:11px 22px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#451a03,#d97706);color:#fff;
        box-shadow:0 4px 16px rgba(69,26,3,.4);transition:all .2s;z-index:1;}
      .hs-btn:hover:not(:disabled){transform:translateY(-2px);}
      .hs-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .hs-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .hs-star-g{cursor:default;}
      .hs-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .hs-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .hs-win-h1{font-size:22px;font-weight:900;color:#fbbf24;}
      .hs-win-p{color:#c4c9e8;font-size:12.5px;max-width:420px;text-align:center;line-height:1.6;}
      .hs-win-btn{padding:10px 26px;background:linear-gradient(135deg,#451a03,#d97706);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
      .conf{position:absolute;width:8px;height:8px;border-radius:2px;pointer-events:none;
        animation:confFall var(--d) var(--dl) ease-in forwards;z-index:200;}
      @keyframes confFall{0%{transform:translate(0,-10px) rotate(0);opacity:1}100%{transform:translate(var(--ex),430px) rotate(720deg);opacity:0}}
      .hw-btn{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#a0aec0;font-size:14px;cursor:pointer;z-index:50;display:flex;align-items:center;justify-content:center;transition:all .2s;}
      .hw-btn:hover{background:rgba(255,255,255,.22);color:#fff;}
      .hw-panel{position:absolute;top:44px;right:10px;width:260px;background:rgba(15,20,40,.97);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:14px 16px;z-index:51;animation:hwFade .2s ease-out;font-family:Nunito,sans-serif;}
      @keyframes hwFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
      .hw-title{font-size:12px;font-weight:900;color:#facc15;margin-bottom:8px;letter-spacing:.3px;}
      .hw-body{font-size:11.5px;color:#c4c9e8;line-height:1.6;}
      .hw-body ul{margin:4px 0 8px 16px;padding:0;}
      .hw-body li{margin-bottom:3px;}
      .hw-insight{font-size:11px;color:#86efac;border-top:1px solid rgba(255,255,255,.1);padding-top:7px;margin-top:4px;}
    `;
    document.head.appendChild(s);
  }
  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    let step=0,maxHeap=[],finalResult=[],processed=new Set(),done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="hs-root" id="hs-root">
        <div class="hs-title">⭐ K Closest Stars to Earth</div>
        <div class="hs-story">
          🚀 <strong>Astronomer Nova</strong> needs to find the <strong>${K} closest stars</strong> to Earth 🌍!
          We use a <strong style="color:#f87171">Max-Heap of size K</strong>: add each star,
          and if heap size > K, remove the <strong>farthest</strong>. What's left are the K closest!
        </div>
        <div class="hs-main">
          <div class="hs-map-wrap">
            <div class="hs-map-title">🌌 Galaxy Map (Earth is 🌍 at center)</div>
            <svg class="hs-svg" id="hs-svg" viewBox="0 0 400 240"></svg>
          </div>
          <div class="hs-right">
            <div class="hs-heap-panel">
              <div class="hs-heap-title">🔺 Max-Heap (size ≤ ${K})</div>
              <div class="hs-heap-list" id="hs-heap-list"></div>
            </div>
            <div class="hs-result-panel">
              <div class="hs-result-title">✅ ${K} Closest Stars</div>
              <div class="hs-result-list" id="hs-result-list"></div>
            </div>
          </div>
        </div>
        <button class="hs-btn" id="hs-btn" aria-label="Add next star to the max-heap">⭐ Add Next Star!</button>
        <div class="hs-status" id="hs-status">👆 Add stars one by one — max-heap keeps only the K closest!</div>
      </div>`;
    const root=container.querySelector('#hs-root');
    const hwBtn=document.createElement('button');hwBtn.className='hw-btn';hwBtn.setAttribute('aria-label','How to play');hwBtn.textContent='ℹ️';root.appendChild(hwBtn);
    const hwPanel=document.createElement('div');hwPanel.className='hw-panel';hwPanel.style.display='none';
    hwPanel.innerHTML='<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Heap + Sorting: a Max-Heap of size K tracks the K closest stars — whenever a nearer star arrives, the farthest is evicted.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Add each star to the max-heap.</li><li>If heap size exceeds K, remove the star with the largest distance.</li><li>At the end, the heap holds exactly the K closest stars!</li></ul><div class="hw-insight">💡 Key insight: Max-Heap of size K → O(n log K) instead of O(n log n) full sort.</div></div>';
    root.appendChild(hwPanel);hwBtn.addEventListener('click',()=>{hwPanel.style.display=hwPanel.style.display==='none'?'block':'none';});
    container.querySelector('#hs-btn').addEventListener('click',addNext);
    renderMap();updateStepIndicator(1,STARS.length);

    function addNext(){
      if(done||step>=STARS.length)return;
      const star=SORTED_BY_DIST[step]; // process in sorted order for cleaner demo
      const d=dist(star);
      maxHeap.push({...star,d});
      maxHeap.sort((a,b)=>b.d-a.d); // max-heap by distance
      const statusEl=container.querySelector('#hs-status');
      if(maxHeap.length>K){
        const removed=maxHeap.shift();
        statusEl.innerHTML=`⭐ Added <strong>${star.name}</strong> (d=${d}). Heap full! Removed farthest: <strong style="color:#f87171">${removed.name}</strong> (d=${removed.d}).`;
      } else {
        statusEl.innerHTML=`⭐ Added <strong>${star.name}</strong> (d=${d}) to heap. Heap size: ${maxHeap.length}/${K}.`;
      }
      processed.add(star.name);
      step++;
      if(step>=STARS.length){done=true;finalResult=[...maxHeap].sort((a,b)=>a.d-b.d);
        container.querySelector('#hs-btn').disabled=true;setTimeout(celebrate,400);}
      renderMap();renderHeap();
      updateStepIndicator(Math.min(step+1,STARS.length),STARS.length);
    }
    function renderHeap(){
      const hl=container.querySelector('#hs-heap-list');hl.innerHTML='';
      if(maxHeap.length===0){hl.innerHTML='<div style="color:#374151;font-size:10px;text-align:center">empty</div>';return;}
      maxHeap.forEach((s,i)=>{
        const d2=document.createElement('div');d2.className='hs-heap-item'+(i===0?' max':'');
        d2.innerHTML=`<span>${s.emoji}${s.name}</span><span>${s.d}</span>`;hl.appendChild(d2);
      });
      const rl=container.querySelector('#hs-result-list');rl.innerHTML='';
      if(done&&finalResult.length>0){finalResult.forEach((s,i)=>{
        const d2=document.createElement('div');d2.className='hs-result-item';
        d2.innerHTML=`<span>${i+1}. ${s.emoji}${s.name}</span><span>d=${s.d}</span>`;rl.appendChild(d2);
      });}else{rl.innerHTML='<div style="color:#374151;font-size:10px;text-align:center">processing...</div>';}
    }
    function renderMap(){
      const svg=container.querySelector('#hs-svg');svg.innerHTML='';
      // Stars
      STARS.forEach(star=>{
        const isInHeap=maxHeap.some(s=>s.name===star.name);
        const isFinal=finalResult.some(s=>s.name===star.name);
        const isDone=processed.has(star.name);
        const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','hs-star-g');
        if(isInHeap||isFinal){
          const line=document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1',String(ORIGIN.x));line.setAttribute('y1',String(ORIGIN.y));
          line.setAttribute('x2',String(star.x));line.setAttribute('y2',String(star.y));
          line.setAttribute('stroke',isFinal?'#4ade80':'#fbbf24');line.setAttribute('stroke-width','1');line.setAttribute('opacity','0.4');line.setAttribute('stroke-dasharray','3 3');
          svg.appendChild(line);
        }
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',String(star.x));c.setAttribute('cy',String(star.y));c.setAttribute('r',isInHeap?'12':'9');
        c.setAttribute('fill',isFinal?'rgba(74,222,128,.25)':isInHeap?'rgba(251,191,36,.2)':isDone?'rgba(107,114,128,.1)':'rgba(255,255,255,.05)');
        c.setAttribute('stroke',isFinal?'#4ade80':isInHeap?'#fbbf24':isDone?'#374151':'#1e293b');
        c.setAttribute('stroke-width','1.5');g.appendChild(c);
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',String(star.x));t.setAttribute('y',String(star.y+1));
        t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
        t.setAttribute('font-size','10');t.textContent=star.emoji;g.appendChild(t);
        const d=dist(star);
        const dl=document.createElementNS('http://www.w3.org/2000/svg','text');
        dl.setAttribute('x',String(star.x));dl.setAttribute('y',String(star.y+18));
        dl.setAttribute('text-anchor','middle');dl.setAttribute('fill',isDone?'#fbbf24':'#374151');
        dl.setAttribute('font-size','7');dl.setAttribute('font-family','Nunito,sans-serif');
        dl.textContent=isDone?String(d):'?';g.appendChild(dl);
        svg.appendChild(g);
      });
      // Earth origin
      const og=document.createElementNS('http://www.w3.org/2000/svg','g');
      const oc=document.createElementNS('http://www.w3.org/2000/svg','circle');
      oc.setAttribute('cx',String(ORIGIN.x));oc.setAttribute('cy',String(ORIGIN.y));oc.setAttribute('r','16');
      oc.setAttribute('fill','rgba(96,165,250,.2)');oc.setAttribute('stroke','#60a5fa');oc.setAttribute('stroke-width','2');og.appendChild(oc);
      const ot=document.createElementNS('http://www.w3.org/2000/svg','text');
      ot.setAttribute('x',String(ORIGIN.x));ot.setAttribute('y',String(ORIGIN.y+1));
      ot.setAttribute('text-anchor','middle');ot.setAttribute('dominant-baseline','central');ot.setAttribute('font-size','14');ot.textContent='🌍';og.appendChild(ot);
      svg.appendChild(og);
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#fbbf24','#4ade80','#60a5fa','#f472b6','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='hs-win';
      const names=finalResult.map(s=>`${s.emoji}${s.name}(d=${s.d})`).join(', ');
      ov.innerHTML=`
        <div class="hs-win-big">⭐</div>
        <div class="hs-win-h1">Stars Found!</div>
        <div class="hs-win-p">
          K=${K} closest: <strong style="color:#4ade80">${names}</strong><br>
          Max-Heap of size K → <strong>O(n log K)</strong> — much faster than sorting all n points!<br>
          <small style="color:#8892b0">LeetCode #973: K Closest Points to Origin ✨</small>
        </div>
        <button class="hs-win-btn" id="hs-replay">🔄 Search Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#hs-replay').addEventListener('click',()=>{ov.remove();step=0;maxHeap=[];finalResult=[];processed=new Set();done=false;
        container.querySelector('#hs-btn').disabled=false;
        container.querySelector('#hs-status').textContent='👆 Add stars one by one — max-heap keeps only the K closest!';
        renderMap();renderHeap();updateStepIndicator(1,STARS.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('heap-sorting',{init,
      nextStep:()=>addNext(),
      prevStep:()=>{step=0;maxHeap=[];finalResult=[];processed=new Set();done=false;
        container.querySelector('#hs-btn').disabled=false;
        container.querySelectorAll('.hs-win').forEach(e=>e.remove());
        renderMap();renderHeap();updateStepIndicator(1,STARS.length);},
      setMode:()=>{}});
  }
})();
