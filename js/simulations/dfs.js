/* =============================================
   DFS — Cave Explorer Rex 🔦
   INTERACTIVE: Click a tunnel to go deeper!
   Find the golden crystal 💎 using depth-first search.
   ============================================= */
(() => {
  // Tree structure: each node has label, children, and a special "goal" node
  const TREE = {
    id:'A', label:'🏔️ Cave Entrance', children:[
      {id:'B', label:'🪨 Left Tunnel', children:[
        {id:'D', label:'🌊 Dark Pool', children:[
          {id:'H', label:'💎 Golden Crystal!', goal:true, children:[]}
        ]},
        {id:'E', label:'🦇 Bat Cave', children:[]}
      ]},
      {id:'C', label:'🌿 Right Tunnel', children:[
        {id:'F', label:'🍄 Mushroom Grotto', children:[
          {id:'I', label:'🪨 Dead End', children:[]}
        ]},
        {id:'G', label:'💨 Windy Passage', children:[
          {id:'J', label:'🐍 Snake Den', children:[]}
        ]}
      ]}
    ]
  };
  const GOAL_ID = 'H';

  function injectStyles() {
    if (document.getElementById('dfs-game-styles')) return;
    const s = document.createElement('style');
    s.id = 'dfs-game-styles';
    s.textContent = `
      .dfs-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 16px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a0a1a 0%,#0d1f10 50%,#1a0533 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .dfs-title{font-size:16px;font-weight:900;color:#a78bfa;text-shadow:0 0 20px rgba(167,139,250,.4);z-index:1;}
      .dfs-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .dfs-canvas{z-index:1;width:100%;flex:1;min-height:0;}
      .dfs-canvas svg{width:100%;height:100%;}
      .dfs-path-box{background:rgba(167,139,250,.1);border:1.5px solid rgba(167,139,250,.3);border-radius:10px;
        padding:7px 16px;max-width:660px;width:100%;font-size:12px;color:#c4c9e8;text-align:center;z-index:1;}
      .dfs-path-box strong{color:#facc15;}
      .dfs-btns{display:flex;gap:10px;z-index:1;}
      .dfs-btn{padding:10px 22px;border-radius:12px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#4c1d95,#6d28d9);color:#fff;
        box-shadow:0 4px 14px rgba(76,29,149,.4);transition:all .2s;}
      .dfs-btn:hover:not(:disabled){transform:translateY(-2px);}
      .dfs-btn.back-btn{background:linear-gradient(135deg,#374151,#4b5563);}
      .dfs-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
      .dfs-msg{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .dfs-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
      .dfs-win-emoji{font-size:64px;animation:wB .6s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .dfs-win-h1{font-size:22px;font-weight:900;color:#a78bfa;}
      .dfs-win-p{color:#c4c9e8;font-size:12.5px;max-width:380px;text-align:center;line-height:1.6;}
      .dfs-win-btn{padding:10px 24px;background:linear-gradient(135deg,#4c1d95,#7c3aed);border:none;
        border-radius:11px;color:#fff;font-size:13px;font-weight:800;cursor:pointer;}
      .conf{position:absolute;width:8px;height:8px;border-radius:2px;pointer-events:none;
        animation:confFall var(--d) var(--dl) ease-in forwards;z-index:200;}
      @keyframes confFall{0%{transform:translate(0,-10px) rotate(0);opacity:1}100%{transform:translate(var(--ex),400px) rotate(540deg);opacity:0}}
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

  // Build flat map of nodes
  function buildMap(node, map={}) { map[node.id] = node; (node.children||[]).forEach(c => buildMap(c, map)); return map; }

  // Build layout positions
  function buildLayout(node, depth=0, idx=0, totalAtDepth={}) {
    totalAtDepth[depth] = (totalAtDepth[depth]||0);
    const pos = {x: 0, y: depth * 90};
    node._depth = depth; node._layoutIdx = idx;
    (node.children||[]).forEach((c,i) => buildLayout(c, depth+1, i, totalAtDepth));
  }

  function assignX(node, minX, maxX) {
    if (!node.children || node.children.length === 0) {
      node._x = (minX + maxX) / 2; return;
    }
    const step = (maxX - minX) / node.children.length;
    node.children.forEach((c, i) => assignX(c, minX + i*step, minX + (i+1)*step));
    node._x = node.children.reduce((s,c) => s + c._x, 0) / node.children.length;
  }

  function init(container, opts) {
    const { updateStepIndicator, onComplete } = opts;
    injectStyles();

    const nodeMap = buildMap(TREE);
    buildLayout(TREE);
    assignX(TREE, 0, 1);

    let visited = new Set();
    let path = [];  // current DFS path (stack)
    let allVisited = [];  // in order
    let found = false;
    const startTime = Date.now();

    container.innerHTML = `
      <div class="dfs-root" id="dfs-root">
        <div class="dfs-title">🔦 Cave Explorer Rex</div>
        <div class="dfs-story">
          🧒 <strong>Rex</strong> enters the cave with a torch. He always goes <em>as deep as possible</em>
          down one path before turning back. Help him find the 💎 <strong style="color:#facc15">Golden Crystal</strong>!
          Click a glowing tunnel to explore it.
        </div>
        <div class="dfs-canvas" id="dfs-canvas"></div>
        <div class="dfs-path-box" id="dfs-path">📍 Rex is at: <strong>Cave Entrance</strong></div>
        <div class="dfs-btns">
          <button class="dfs-btn back-btn" id="dfs-back" aria-label="Backtrack to previous cave">⬆ Backtrack</button>
          <button class="dfs-btn" id="dfs-reset" aria-label="Start a new cave expedition">🔄 New Expedition</button>
        </div>
        <div class="dfs-msg" id="dfs-msg">👇 Click an unvisited tunnel to go deeper!</div>
      </div>`;

    const root = container.querySelector('#dfs-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> DFS (Depth-First Search) explores as deep as possible before backtracking.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Rex explores one branch of the cave all the way to the bottom.</li><li>Click &quot;Explore&quot; to go deeper; &quot;Backtrack&quot; to retreat.</li><li>Visit every cave node to complete the map!</li></ul><div class="hw-insight">💡 Key insight: DFS = go deep first (stack/recursion), great for maze/tree problems.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    const canvasEl = container.querySelector('#dfs-canvas');
    const pathBox  = container.querySelector('#dfs-path');
    const msgEl    = container.querySelector('#dfs-msg');
    const backBtn  = container.querySelector('#dfs-back');
    const resetBtn = container.querySelector('#dfs-reset');

    path.push(TREE.id);
    visited.add(TREE.id);
    allVisited.push(TREE.id);

    backBtn.addEventListener('click', doBack);
    resetBtn.addEventListener('click', doReset);

    renderSvg();
    updateStepIndicator(1, 10);

    function doVisit(nodeId) {
      if (visited.has(nodeId) || found) return;
      // Can only visit a direct child of current
      const curNode = nodeMap[path[path.length - 1]];
      if (!curNode.children.find(c => c.id === nodeId)) return;
      path.push(nodeId);
      visited.add(nodeId);
      allVisited.push(nodeId);
      const node = nodeMap[nodeId];
      if (node.goal) {
        found = true;
        setTimeout(() => { renderSvg(); setTimeout(celebrate, 600); }, 80);
      } else if (node.children.length === 0) {
        msgEl.innerHTML = `Dead end! 😓 <strong style="color:#f87171">No more tunnels</strong> — use Backtrack to go up.`;
      } else {
        msgEl.textContent = `Entered "${node.label}". ${node.children.length} tunnel(s) ahead!`;
      }
      renderSvg();
      updatePathBox();
      updateStepIndicator(Math.min(allVisited.length, 10), 10);
    }

    function doBack() {
      if (path.length <= 1) return;
      const leaving = path.pop();
      msgEl.innerHTML = `↩ Backtracking from "${nodeMap[leaving].label}"...`;
      renderSvg(); updatePathBox();
    }

    function doReset() {
      visited.clear(); path = [TREE.id]; visited.add(TREE.id); allVisited = [TREE.id]; found = false;
      msgEl.textContent = '👇 Click an unvisited tunnel to go deeper!';
      container.querySelectorAll('.dfs-win').forEach(e => e.remove());
      renderSvg(); updatePathBox();
      updateStepIndicator(1, 10);
    }

    function updatePathBox() {
      const pathNames = path.map(id => nodeMap[id].label).join(' → ');
      pathBox.innerHTML = `📍 Rex's path: <strong>${pathNames}</strong>`;
    }

    function renderSvg() {
      canvasEl.innerHTML = '';
      const W = canvasEl.clientWidth || 600;
      const H = canvasEl.clientHeight || 240;
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio','xMidYMid meet');

      const curId = path[path.length - 1];
      const curNode = nodeMap[curId];

      // Draw edges
      function drawEdges(node) {
        (node.children||[]).forEach(child => {
          const x1 = node._x * W, y1 = node._depth * 80 + 30;
          const x2 = child._x * W, y2 = child._depth * 80 + 30;
          const line = document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1', x1); line.setAttribute('y1', y1);
          line.setAttribute('x2', x2); line.setAttribute('y2', y2);
          const inPath = path.includes(node.id) && path.includes(child.id);
          line.setAttribute('stroke', inPath ? '#a78bfa' : '#1e293b');
          line.setAttribute('stroke-width', inPath ? 3 : 1.5);
          svg.appendChild(line);
          drawEdges(child);
        });
      }
      drawEdges(TREE);

      // Draw nodes
      function drawNodes(node) {
        const x = node._x * W, y = node._depth * 80 + 30;
        const isCur = node.id === curId;
        const isPath = path.includes(node.id);
        const isVis = visited.has(node.id);
        const isClickable = !visited.has(node.id) && (curNode.children||[]).find(c => c.id === node.id);

        // Circle bg
        const circ = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circ.setAttribute('cx', x); circ.setAttribute('cy', y);
        circ.setAttribute('r', isCur ? 24 : 20);
        circ.setAttribute('fill', isCur ? '#4c1d95' : isPath ? '#1e1b4b' : isVis ? '#1f2937' : '#0f172a');
        circ.setAttribute('stroke', isCur ? '#a78bfa' : isClickable ? '#fbbf24' : isVis ? '#374151' : '#1e293b');
        circ.setAttribute('stroke-width', isCur ? 3 : isClickable ? 2.5 : 1.5);
        if (isClickable) circ.style.animation = 'none';
        svg.appendChild(circ);

        if (isClickable) {
          // Glow ring
          const glow = document.createElementNS('http://www.w3.org/2000/svg','circle');
          glow.setAttribute('cx',x); glow.setAttribute('cy',y); glow.setAttribute('r',26);
          glow.setAttribute('fill','none'); glow.setAttribute('stroke','rgba(251,191,36,.35)');
          glow.setAttribute('stroke-width',4);
          svg.appendChild(glow);
          // Clickable overlay
          const hit = document.createElementNS('http://www.w3.org/2000/svg','circle');
          hit.setAttribute('cx',x); hit.setAttribute('cy',y); hit.setAttribute('r',26);
          hit.setAttribute('fill','transparent'); hit.style.cursor='pointer';
          hit.addEventListener('click', () => doVisit(node.id));
          svg.appendChild(hit);
        }

        // Emoji text
        const t = document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',x); t.setAttribute('y',y+5);
        t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','16');
        t.textContent = node.goal ? '💎' : node.id;
        svg.appendChild(t);

        // Label below
        const lbl = document.createElementNS('http://www.w3.org/2000/svg','text');
        lbl.setAttribute('x',x); lbl.setAttribute('y',y+38);
        lbl.setAttribute('text-anchor','middle'); lbl.setAttribute('font-size','9');
        lbl.setAttribute('fill', isClickable ? '#fbbf24' : isCur ? '#a78bfa' : '#4b5563');
        const parts = node.label.split(' ');
        lbl.textContent = parts.slice(0,2).join(' ');
        svg.appendChild(lbl);

        (node.children||[]).forEach(c => drawNodes(c));
      }
      drawNodes(TREE);
      canvasEl.appendChild(svg);
    }

    function celebrate() {
      const elapsed = Date.now() - startTime;
      const colors=['#a78bfa','#facc15','#4ade80','#f472b6','#60a5fa'];
      for(let i=0;i<45;i++){
        const p=document.createElement('div'); p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.9+Math.random()*.7}s;--dl:${Math.random()*.4}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p); setTimeout(()=>p.remove(),1800);
      }
      const ov = document.createElement('div');
      ov.className = 'dfs-win';
      ov.innerHTML = `
        <div class="dfs-win-emoji">💎</div>
        <div class="dfs-win-h1">Crystal Found!</div>
        <div class="dfs-win-p">
          Rex followed the DFS path: <strong style="color:#facc15">${path.join(' → ')}</strong><br>
          DFS dives deep before backtracking — like following a tunnel to its end!<br>
          <small style="color:#8892b0">Key insight: "explore all paths / tree traversal" → DFS ✨</small>
        </div>
        <button class="dfs-win-btn" id="dfs-replay">🔄 Explore Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#dfs-replay').addEventListener('click', () => { ov.remove(); doReset(); });
      onComplete && onComplete(3, elapsed);
    }

    app.registerSim('dfs', {
      init,
      nextStep: () => {
        const curNode = nodeMap[path[path.length - 1]];
        const unvis = (curNode.children||[]).find(c => !visited.has(c.id));
        if (unvis) doVisit(unvis.id);
        else doBack();
      },
      prevStep: () => doBack(),
      setMode: () => {}
    });
  }
})();