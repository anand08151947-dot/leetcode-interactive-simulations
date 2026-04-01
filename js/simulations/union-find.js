/* Union-Find — Island Bridge Builder 🏝️
   INTERACTIVE: Click pairs of islands to build bridges and
   find connected communities! Union-Find under the hood. */
(() => {
  const NUM_NODES=10;
  const PAIRS_TO_CONNECT=[[0,1],[2,3],[1,4],[5,6],[3,7],[8,9],[4,2],[6,8]];
  const POSITIONS=[
    {x:80,y:60},{x:160,y:40},{x:260,y:50},{x:340,y:80},{x:200,y:100},
    {x:80,y:160},{x:160,y:180},{x:300,y:160},{x:240,y:200},{x:100,y:210}
  ];
  const ISLAND_NAMES=['🏝️Alpha','🌴Beta','🏔️Gamma','🌊Delta','🦜Epsilon',
    '🐚Zeta','🌺Eta','🗻Theta','🦩Iota','🌿Kappa'];
  const COLORS=['#f472b6','#60a5fa','#4ade80','#fbbf24','#a78bfa',
    '#fb923c','#34d399','#f87171','#38bdf8','#c084fc'];
  function injectStyles(){
    if(document.getElementById('uf-styles'))return;
    const s=document.createElement('style');s.id='uf-styles';
    s.textContent=`
      .uf-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a1628 0%,#0f1e2a 50%,#0a1a0f 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .uf-title{font-size:16px;font-weight:900;color:#38bdf8;text-shadow:0 0 18px rgba(56,189,248,.4);z-index:1;}
      .uf-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .uf-main{display:flex;gap:12px;z-index:1;width:100%;max-width:720px;}
      .uf-canvas-wrap{flex:1;}
      .uf-canvas-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;text-align:center;}
      .uf-svg{width:100%;min-height:150px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);}
      .uf-right{min-width:170px;display:flex;flex-direction:column;gap:8px;}
      .uf-right-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;}
      .uf-components{display:flex;flex-direction:column;gap:4px;}
      .uf-comp{padding:5px 8px;border-radius:8px;font-size:11px;font-weight:700;
        background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#a0aec0;transition:all .3s;}
      .uf-comp.active{border-color:rgba(56,189,248,.4);background:rgba(56,189,248,.07);color:#7dd3fc;}
      .uf-next-bridge{background:rgba(56,189,248,.08);border:1.5px solid rgba(56,189,248,.25);border-radius:10px;padding:8px;}
      .uf-next-title{font-size:10px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
      .uf-next-pair{font-size:13px;font-weight:900;color:#e0f2fe;text-align:center;}
      .uf-btn{padding:11px 26px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#0c4a6e,#0ea5e9);color:#fff;
        box-shadow:0 4px 16px rgba(14,165,233,.3);transition:all .2s;z-index:1;}
      .uf-btn:hover:not(:disabled){transform:translateY(-2px);}
      .uf-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .uf-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .uf-node{cursor:pointer;transition:all .2s;}
      .uf-edge{stroke-width:2.5;transition:all .3s;}
      .uf-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .uf-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .uf-win-h1{font-size:22px;font-weight:900;color:#38bdf8;}
      .uf-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .uf-win-btn{padding:10px 26px;background:linear-gradient(135deg,#0c4a6e,#0ea5e9);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
  class UnionFind{
    constructor(n){this.parent=[...Array(n).keys()];this.rank=new Array(n).fill(0);this.count=n;}
    find(x){if(this.parent[x]!==x)this.parent[x]=this.find(this.parent[x]);return this.parent[x];}
    union(x,y){const px=this.find(x),py=this.find(y);if(px===py)return false;
      if(this.rank[px]<this.rank[py])this.parent[px]=py;
      else if(this.rank[px]>this.rank[py])this.parent[py]=px;
      else{this.parent[py]=px;this.rank[px]++;}this.count--;return true;}
    components(){const comps={};for(let i=0;i<this.parent.length;i++){const r=this.find(i);
      if(!comps[r])comps[r]=[];comps[r].push(i);}return Object.values(comps);}
  }
  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    let uf=new UnionFind(NUM_NODES),step=0,edges=[],done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="uf-root" id="uf-root">
        <div class="uf-title">🏝️ Island Bridge Builder</div>
        <div class="uf-story">
          🚢 <strong>Captain Kai</strong> needs to connect all island communities with bridges!
          <strong>Union-Find</strong> tracks which islands are already connected.
          Same group → no bridge needed. Different groups → build and UNION them!
        </div>
        <div class="uf-main">
          <div class="uf-canvas-wrap">
            <div class="uf-canvas-title">🗺️ Island Map</div>
            <svg class="uf-svg" id="uf-svg" viewBox="0 0 380 230"></svg>
          </div>
          <div class="uf-right">
            <div class="uf-right-title">🏘️ Communities</div>
            <div class="uf-components" id="uf-components"></div>
            <div class="uf-next-bridge">
              <div class="uf-next-title">🔧 Next Bridge</div>
              <div class="uf-next-pair" id="uf-next-pair">—</div>
            </div>
          </div>
        </div>
        <button class="uf-btn" id="uf-btn" aria-label="Build next bridge and union the two island communities">🌉 Build Next Bridge!</button>
        <div class="uf-status" id="uf-status">👆 Click to build bridges and unite island communities!</div>
      </div>`;
    const root=container.querySelector('#uf-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Union-Find (Disjoint Set) tracks which items belong to the same connected group.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Click &quot;Build Bridge&quot; to connect pairs of islands.</li><li>Union-Find checks if they&#39;re already in the same community (no bridge needed).</li><li>Connect all islands until one community remains!</li></ul><div class="hw-insight">💡 Key insight: Union-Find with path compression ≈ O(1) per union/find operation.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#uf-btn').addEventListener('click',buildBridge);
    renderMap();renderComponents();showNext();updateStepIndicator(1,PAIRS_TO_CONNECT.length);

    function buildBridge(){
      if(done||step>=PAIRS_TO_CONNECT.length)return;
      const [a,b]=PAIRS_TO_CONNECT[step];
      const pa=uf.find(a),pb=uf.find(b);
      const statusEl=container.querySelector('#uf-status');
      if(pa===pb){
        statusEl.innerHTML=`💡 ${ISLAND_NAMES[a]} & ${ISLAND_NAMES[b]} are already in the SAME community! No bridge needed.`;
      } else {
        uf.union(a,b);
        edges.push([a,b]);
        statusEl.innerHTML=`🌉 Bridge built! ${ISLAND_NAMES[a]} & ${ISLAND_NAMES[b]} united → <strong>${uf.count} community(ies)</strong> remain!`;
      }
      step++;
      if(step>=PAIRS_TO_CONNECT.length){done=true;container.querySelector('#uf-btn').disabled=true;setTimeout(celebrate,500);}
      renderMap();renderComponents();showNext();
      updateStepIndicator(Math.min(step+1,PAIRS_TO_CONNECT.length),PAIRS_TO_CONNECT.length);
    }
    function showNext(){
      const nextEl=container.querySelector('#uf-next-pair');
      if(step<PAIRS_TO_CONNECT.length){const [a,b]=PAIRS_TO_CONNECT[step];nextEl.textContent=`${a} ↔ ${b}`;}
      else nextEl.textContent='All done!';
    }
    function renderComponents(){
      const compEl=container.querySelector('#uf-components');compEl.innerHTML='';
      uf.components().forEach((comp,i)=>{
        const d=document.createElement('div');d.className='uf-comp active';
        d.innerHTML=`<strong style="color:${COLORS[uf.find(comp[0])%COLORS.length]}">Group ${i+1}</strong>: Islands ${comp.join(', ')}`;
        compEl.appendChild(d);
      });
    }
    function renderMap(){
      const svg=container.querySelector('#uf-svg');svg.innerHTML='';
      // Draw edges
      edges.forEach(([a,b])=>{
        const l=document.createElementNS('http://www.w3.org/2000/svg','line');
        l.setAttribute('x1',String(POSITIONS[a].x));l.setAttribute('y1',String(POSITIONS[a].y));
        l.setAttribute('x2',String(POSITIONS[b].x));l.setAttribute('y2',String(POSITIONS[b].y));
        l.setAttribute('class','uf-edge');l.setAttribute('stroke',COLORS[uf.find(a)%COLORS.length]);
        svg.appendChild(l);
      });
      // Draw nodes
      POSITIONS.forEach(({x,y},i)=>{
        const root_id=uf.find(i);const color=COLORS[root_id%COLORS.length];
        const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','uf-node');
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',String(x));c.setAttribute('cy',String(y));c.setAttribute('r','14');
        c.setAttribute('fill',`${color}25`);c.setAttribute('stroke',color);c.setAttribute('stroke-width','2');
        g.appendChild(c);
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',String(x));t.setAttribute('y',String(y+1));
        t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
        t.setAttribute('fill','#e0f2fe');t.setAttribute('font-size','9');t.setAttribute('font-weight','800');
        t.setAttribute('font-family','Nunito,sans-serif');t.textContent=i;
        g.appendChild(t);
        const lbl=document.createElementNS('http://www.w3.org/2000/svg','text');
        lbl.setAttribute('x',String(x));lbl.setAttribute('y',String(y+22));
        lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill',color);
        lbl.setAttribute('font-size','7');lbl.setAttribute('font-family','Nunito,sans-serif');
        const nameMatch = ISLAND_NAMES[i].match(/[A-Za-z].*/);
        lbl.textContent = nameMatch ? nameMatch[0].slice(0, 5) : String(i);
        g.appendChild(lbl);
        svg.appendChild(g);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#38bdf8','#fbbf24','#4ade80','#f472b6','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const comps=uf.components();
      const ov=document.createElement('div');ov.className='uf-win';
      ov.innerHTML=`
        <div class="uf-win-big">🏝️</div>
        <div class="uf-win-h1">All Bridged!</div>
        <div class="uf-win-p">
          ${NUM_NODES} islands → <strong style="color:#fbbf24">${comps.length} community(ies)</strong>!<br>
          Union-Find: near <strong>O(1)</strong> per union/find with path compression!<br>
          <small style="color:#8892b0">Key insight: "connected components / grouping" → Union-Find ✨</small>
        </div>
        <button class="uf-win-btn" id="uf-replay">🔄 New Islands!</button>`;
      root.appendChild(ov);
      ov.querySelector('#uf-replay').addEventListener('click',()=>{ov.remove();uf=new UnionFind(NUM_NODES);step=0;edges=[];done=false;
        container.querySelector('#uf-btn').disabled=false;
        container.querySelector('#uf-status').textContent='👆 Click to build bridges and unite island communities!';
        renderMap();renderComponents();showNext();updateStepIndicator(1,PAIRS_TO_CONNECT.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('union-find',{init,
      nextStep:()=>buildBridge(),
      prevStep:()=>{uf=new UnionFind(NUM_NODES);step=0;edges=[];done=false;
        container.querySelector('#uf-btn').disabled=false;
        container.querySelectorAll('.uf-win').forEach(e=>e.remove());
        renderMap();renderComponents();showNext();updateStepIndicator(1,PAIRS_TO_CONNECT.length);},
      setMode:()=>{}});
  }
})();