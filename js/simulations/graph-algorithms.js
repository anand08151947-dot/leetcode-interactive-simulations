/* Graph Algorithms — The Treasure Map 🗺️
   INTERACTIVE: Dijkstra's algorithm — click nodes to find shortest path! */
(() => {
  // Weighted graph: adjacency list {node: [[neighbor, weight], ...]}
  const GRAPH={
    0:[[1,4],[2,2]],
    1:[[0,4],[2,1],[3,5]],
    2:[[0,2],[1,1],[4,8],[5,10]],
    3:[[1,5],[4,2],[6,6]],
    4:[[2,8],[3,2],[5,3],[6,1]],
    5:[[2,10],[4,3],[7,7]],
    6:[[3,6],[4,1],[7,2]],
    7:[[5,7],[6,2]]
  };
  const POSITIONS=[
    {x:60,y:80},{x:140,y:40},{x:140,y:130},{x:240,y:40},{x:240,y:130},
    {x:240,y:200},{x:320,y:80},{x:340,y:160}
  ];
  const LABELS=['🏠Home','🧩Puzzle','🌲Forest','⚔️Castle','🗝️Key Vault','🌊River','🌋Volcano','💎Treasure!'];
  const START=0,END=7;
  function injectStyles(){
    if(document.getElementById('ga-styles'))return;
    const s=document.createElement('style');s.id='ga-styles';
    s.textContent=`
      .ga-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a1000 0%,#1a0a00 50%,#0a0a1a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .ga-title{font-size:16px;font-weight:900;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.4);z-index:1;}
      .ga-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .ga-main{display:flex;gap:12px;z-index:1;width:100%;max-width:720px;}
      .ga-map-wrap{flex:1;}
      .ga-map-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;text-align:center;}
      .ga-svg{width:100%;min-height:150px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);}
      .ga-right{min-width:160px;display:flex;flex-direction:column;gap:8px;}
      .ga-right-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;}
      .ga-dist-table{display:flex;flex-direction:column;gap:3px;}
      .ga-dist-row{display:flex;justify-content:space-between;align-items:center;
        padding:3px 7px;border-radius:7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
        font-size:11px;transition:all .3s;}
      .ga-dist-row.updated{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.3);}
      .ga-dist-row.finalized{background:rgba(74,222,128,.08);border-color:rgba(74,222,128,.25);}
      .ga-dist-name{color:#c4c9e8;font-weight:700;}
      .ga-dist-val{color:#fbbf24;font-weight:800;}
      .ga-dist-val.inf{color:#374151;}
      .ga-btn{padding:11px 22px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#78350f,#d97706);color:#fff;
        box-shadow:0 4px 16px rgba(120,53,15,.4);transition:all .2s;z-index:1;}
      .ga-btn:hover:not(:disabled){transform:translateY(-2px);}
      .ga-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .ga-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .ga-edge{stroke:#374151;stroke-width:1.5;transition:all .3s;}
      .ga-edge.explored{stroke:#fbbf24;stroke-width:2.5;}
      .ga-edge.path{stroke:#4ade80;stroke-width:3;}
      .ga-node-c{transition:all .3s;}
      .ga-node-c.unvisited{fill:rgba(251,191,36,.08);stroke:rgba(251,191,36,.3);}
      .ga-node-c.current{fill:rgba(251,191,36,.4);stroke:#fbbf24;stroke-width:3;}
      .ga-node-c.visited{fill:rgba(74,222,128,.12);stroke:rgba(74,222,128,.4);}
      .ga-node-c.path{fill:rgba(74,222,128,.35);stroke:#4ade80;stroke-width:3;}
      .ga-node-c.start{fill:rgba(96,165,250,.3);stroke:#60a5fa;stroke-width:2.5;}
      .ga-node-c.end{fill:rgba(248,113,113,.25);stroke:#f87171;stroke-width:2.5;}
      .ga-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .ga-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .ga-win-h1{font-size:22px;font-weight:900;color:#fbbf24;}
      .ga-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .ga-win-btn{padding:10px 26px;background:linear-gradient(135deg,#78350f,#d97706);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    const INF=Infinity;
    let dist,prev,visited,pq,step,done,pathEdges,celebrateFired;
    function reset(){
      dist=new Array(8).fill(INF);dist[START]=0;
      prev=new Array(8).fill(-1);visited=new Set();
      pq=[[0,START]]; // [dist, node]
      step=0;done=false;pathEdges=[];celebrateFired=false;
    }
    reset();
    const startTime=Date.now();
    container.innerHTML=`
      <div class="ga-root" id="ga-root">
        <div class="ga-title">🗺️ The Treasure Map Quest</div>
        <div class="ga-story">
          🏴‍☠️ <strong>Captain Aria</strong> needs the <strong>shortest path</strong> to the 💎 Treasure!
          Dijkstra's algorithm explores the closest unvisited location first.
          Watch distances update as we explore each path!
        </div>
        <div class="ga-main">
          <div class="ga-map-wrap">
            <div class="ga-map-title">🗺️ Treasure Map (edge weights = travel time)</div>
            <svg class="ga-svg" id="ga-svg" viewBox="0 0 400 240"></svg>
          </div>
          <div class="ga-right">
            <div class="ga-right-title">📊 Shortest Distances</div>
            <div class="ga-dist-table" id="ga-dist-table"></div>
          </div>
        </div>
        <button class="ga-btn" id="ga-btn" aria-label="Explore next closest unvisited location with Dijkstra">🧭 Explore Next Node!</button>
        <div class="ga-status" id="ga-status">👆 Dijkstra explores the CLOSEST unvisited node each step!</div>
      </div>`;
    const root=container.querySelector('#ga-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Dijkstra&#39;s algorithm finds the shortest weighted path from a start node to all others.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Always explore the unvisited node with the smallest known distance.</li><li>Update neighbor distances if a shorter path is found.</li><li>Reach the 💎 treasure via the shortest route!</li></ul><div class="hw-insight">💡 Key insight: Greedy choice: always pick minimum-distance unvisited node.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#ga-btn').addEventListener('click',exploreNext);
    renderMap();renderDists();updateStepIndicator(1,8);

    function exploreNext(){
      if(done||pq.length===0)return;
      // Get min-dist unvisited node
      pq.sort((a,b)=>a[0]-b[0]);
      let curr=-1,currDist=INF;
      while(pq.length>0){
        const [d,n]=pq.shift();
        if(!visited.has(n)){curr=n;currDist=d;break;}
      }
      if(curr===-1||curr===END){done=true;container.querySelector('#ga-btn').disabled=true;
        buildPath();renderMap();setTimeout(celebrate,500);return;}
      visited.add(curr);step++;
      const statusEl=container.querySelector('#ga-status');
      statusEl.innerHTML=`🧭 Visiting <strong>${LABELS[curr]}</strong> (dist=${currDist}). Relaxing edges...`;
      // Relax neighbors
      GRAPH[curr].forEach(([nb,w])=>{
        if(!visited.has(nb)&&dist[curr]+w<dist[nb]){
          dist[nb]=dist[curr]+w;prev[nb]=curr;
          pq.push([dist[nb],nb]);
        }
      });
      if(pq.length===0||visited.size===8){done=true;container.querySelector('#ga-btn').disabled=true;buildPath();setTimeout(celebrate,500);}
      renderMap();renderDists();updateStepIndicator(Math.min(step+1,8),8);
    }
    function buildPath(){
      pathEdges=[];let n=END;
      while(prev[n]>=0){pathEdges.push([prev[n],n]);n=prev[n];}
    }
    function renderDists(){
      const tbl=container.querySelector('#ga-dist-table');tbl.innerHTML='';
      for(let i=0;i<8;i++){
        const d=document.createElement('div');
        d.className='ga-dist-row'+(visited.has(i)?' finalized':dist[i]<INF?' updated':'');
        d.innerHTML=`<span class="ga-dist-name">${i}</span><span class="ga-dist-val${dist[i]===INF?' inf':''}">${dist[i]===INF?'∞':dist[i]}</span>`;
        tbl.appendChild(d);
      }
    }
    function isPathEdge(a,b){return pathEdges.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}
    function renderMap(){
      const svg=container.querySelector('#ga-svg');svg.innerHTML='';
      // Edges
      Object.entries(GRAPH).forEach(([nodeStr,neighbors])=>{
        const node=parseInt(nodeStr);
        neighbors.forEach(([nb,w])=>{
          if(node<nb){
            const onPath=isPathEdge(node,nb);
            const explored=visited.has(node)||visited.has(nb);
            const l=document.createElementNS('http://www.w3.org/2000/svg','line');
            l.setAttribute('x1',String(POSITIONS[node].x));l.setAttribute('y1',String(POSITIONS[node].y));
            l.setAttribute('x2',String(POSITIONS[nb].x));l.setAttribute('y2',String(POSITIONS[nb].y));
            l.setAttribute('class','ga-edge'+(onPath?' path':explored?' explored':''));
            svg.appendChild(l);
            // Weight label
            const mx=(POSITIONS[node].x+POSITIONS[nb].x)/2;const my=(POSITIONS[node].y+POSITIONS[nb].y)/2;
            const wt=document.createElementNS('http://www.w3.org/2000/svg','text');
            wt.setAttribute('x',String(mx));wt.setAttribute('y',String(my-4));
            wt.setAttribute('text-anchor','middle');wt.setAttribute('fill',onPath?'#4ade80':'#4b5563');
            wt.setAttribute('font-size','9');wt.setAttribute('font-weight','800');wt.setAttribute('font-family','Nunito,sans-serif');
            wt.textContent=String(w);svg.appendChild(wt);
          }
        });
      });
      // Nodes
      POSITIONS.forEach(({x,y},i)=>{
        const state=i===START?'start':i===END?'end':isPathEdge(i,prev[i])||pathEdges.some(([a,b])=>a===i||b===i)?'path':visited.has(i)?'visited':dist[i]<INF&&!visited.has(i)?'current':'unvisited';
        const g=document.createElementNS('http://www.w3.org/2000/svg','g');
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',String(x));c.setAttribute('cy',String(y));c.setAttribute('r','14');
        c.setAttribute('class','ga-node-c '+state);g.appendChild(c);
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',String(x));t.setAttribute('y',String(y+1));
        t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
        t.setAttribute('fill','#e0f2fe');t.setAttribute('font-size','9');t.setAttribute('font-weight','800');t.setAttribute('font-family','Nunito,sans-serif');
        t.textContent=LABELS[i].split(/\s/)[0];g.appendChild(t);
        const dist_t=document.createElementNS('http://www.w3.org/2000/svg','text');
        dist_t.setAttribute('x',String(x));dist_t.setAttribute('y',String(y+22));
        dist_t.setAttribute('text-anchor','middle');dist_t.setAttribute('fill',dist[i]===INF?'#374151':'#fbbf24');
        dist_t.setAttribute('font-size','8');dist_t.setAttribute('font-family','Nunito,sans-serif');
        dist_t.textContent=dist[i]===INF?'∞':String(dist[i]);g.appendChild(dist_t);
        svg.appendChild(g);
      });
    }
    function celebrate(){
      if(celebrateFired)return;celebrateFired=true;
      const elapsed=Date.now()-startTime;
      const colors=['#fbbf24','#4ade80','#60a5fa','#f472b6','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='ga-win';
      ov.innerHTML=`
        <div class="ga-win-big">💎</div>
        <div class="ga-win-h1">Treasure Found!</div>
        <div class="ga-win-p">
          Shortest distance = <strong style="color:#fbbf24">${dist[END]}</strong> steps!<br>
          Dijkstra's always picks the closest unvisited node → <strong>O((V+E) log V)</strong>!<br>
          <small style="color:#8892b0">Key insight: "shortest path in weighted graph" → Dijkstra ✨</small>
        </div>
        <button class="ga-win-btn" id="ga-replay">🔄 New Quest!</button>`;
      root.appendChild(ov);
      ov.querySelector('#ga-replay').addEventListener('click',()=>{ov.remove();reset();
        container.querySelector('#ga-btn').disabled=false;
        container.querySelector('#ga-status').textContent='👆 Dijkstra explores the CLOSEST unvisited node each step!';
        renderMap();renderDists();updateStepIndicator(1,8);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('graph-algorithms',{init,
      nextStep:()=>exploreNext(),
      prevStep:()=>{reset();container.querySelector('#ga-btn').disabled=false;
        container.querySelectorAll('.ga-win').forEach(e=>e.remove());
        renderMap();renderDists();updateStepIndicator(1,8);},
      setMode:()=>{}});
  }
  app.registerSim('graph-algorithms', { init });
})();