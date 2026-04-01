/* DFS + Backtracking — Forest Path Sum 🌲
   INTERACTIVE: Find all paths in a binary tree that sum to the target!
   DFS explores paths. Backtracking undoes choices when paths fail! */
(() => {
  // Tree structure: {val, left, right}
  const TREE={val:5,left:{val:4,left:{val:11,left:{val:7,left:null,right:null},right:{val:2,left:null,right:null}},right:null},right:{val:8,left:{val:13,left:null,right:null},right:{val:4,left:null,right:{val:1,left:null,right:null}}}};
  const TARGET=22;
  const VALID_PATHS=[[5,4,11,2],[5,8,4,5]]; // second path sums to 22 too... let's recompute
  // Actually: 5+4+11+2=22 ✓, 5+8+13=26 ✗, 5+8+4+1=18 ✗. Only one valid path.
  const TRUE_PATHS=[[5,4,11,2]];
  function injectStyles(){
    if(document.getElementById('dfsbk-styles'))return;
    const s=document.createElement('style');s.id='dfsbk-styles';
    s.textContent=`
      .dfsbk-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#021405 0%,#041a06 50%,#0a1403 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .dfsbk-title{font-size:16px;font-weight:900;color:#4ade80;text-shadow:0 0 18px rgba(74,222,128,.4);z-index:1;}
      .dfsbk-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .dfsbk-main{display:flex;gap:12px;z-index:1;width:100%;max-width:720px;}
      .dfsbk-tree-wrap{flex:1;}
      .dfsbk-tree-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;text-align:center;}
      .dfsbk-svg{width:100%;min-height:150px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);}
      .dfsbk-right{min-width:175px;display:flex;flex-direction:column;gap:8px;}
      .dfsbk-path-panel{background:rgba(74,222,128,.06);border:1.5px solid rgba(74,222,128,.2);border-radius:10px;padding:8px;}
      .dfsbk-path-title{font-size:10px;font-weight:800;color:#4ade80;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
      .dfsbk-path-items{display:flex;gap:4px;flex-wrap:wrap;min-height:24px;}
      .dfsbk-pi{padding:3px 8px;border-radius:6px;font-size:11px;font-weight:800;
        background:rgba(74,222,128,.12);border:1px solid rgba(74,222,128,.25);color:#86efac;}
      .dfsbk-pi.bt{background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.25);color:#fca5a5;text-decoration:line-through;}
      .dfsbk-sum-panel{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);border-radius:9px;padding:7px 9px;}
      .dfsbk-sum-row{display:flex;justify-content:space-between;font-size:11px;font-weight:800;color:#fde68a;}
      .dfsbk-found-panel{background:rgba(96,165,250,.06);border:1px solid rgba(96,165,250,.2);border-radius:9px;padding:7px 9px;}
      .dfsbk-found-title{font-size:10px;font-weight:800;color:#60a5fa;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
      .dfsbk-found-item{font-size:11px;color:#93c5fd;font-weight:700;}
      .dfsbk-btn{padding:11px 26px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#052e16,#16a34a);color:#fff;
        box-shadow:0 4px 16px rgba(5,46,22,.4);transition:all .2s;z-index:1;}
      .dfsbk-btn:hover:not(:disabled){transform:translateY(-2px);}
      .dfsbk-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .dfsbk-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .dfsbk-node-c{transition:all .3s;}
      .dfsbk-edge{stroke:#1e3a2a;stroke-width:1.5;transition:all .3s;}
      .dfsbk-edge.active{stroke:#4ade80;stroke-width:2.5;}
      .dfsbk-edge.backtrack{stroke:#f87171;stroke-width:2.5;stroke-dasharray:4 2;}
      .dfsbk-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .dfsbk-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .dfsbk-win-h1{font-size:22px;font-weight:900;color:#4ade80;}
      .dfsbk-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .dfsbk-win-btn{padding:10px 26px;background:linear-gradient(135deg,#052e16,#16a34a);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
  // Layout tree nodes
  function layoutTree(node,x,y,spread){
    if(!node)return null;
    const n={...node,x,y,id:x+','+y};
    n.left=layoutTree(node.left,x-spread,y+50,spread*0.55);
    n.right=layoutTree(node.right,x+spread,y+50,spread*0.55);
    return n;
  }
  function allNodes(n,arr=[]){if(!n)return arr;arr.push(n);allNodes(n.left,arr);allNodes(n.right,arr);return arr;}

  // Pre-compute DFS steps
    function dfsPaths(node,target){
      const steps=[];
      function dfs(n,path,pathIds,sum){
        if(!n)return;
        path.push(n.val);pathIds.push(n.id);sum+=n.val;
        steps.push({path:[...path],pathIds:[...pathIds],sum,node:n,action:'visit',isLeaf:!n.left&&!n.right,isValid:!n.left&&!n.right&&sum===target});
        if(!n.left&&!n.right){
          if(sum!==target)steps.push({path:[...path],pathIds:[...pathIds],sum,node:n,action:'backtrack',reason:`${sum}≠${target}`});
        } else {
          if(n.left)dfs(n.left,path,pathIds,sum);
          if(n.right)dfs(n.right,path,pathIds,sum);
          steps.push({path:[...path],pathIds:[...pathIds],sum,node:n,action:'backtrack',reason:'explored'});
        }
        path.pop();pathIds.pop();
      }
      dfs(node,[],[],0);
      return steps;
    }

  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    const LAID=layoutTree(TREE,200,25,90);
    const NODES=allNodes(LAID);
    const STEPS=dfsPaths(LAID,TARGET);
    let step=0,currentPath=[],currentPathIds=[],foundPaths=[],foundPathIds=[],done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="dfsbk-root" id="dfsbk-root">
        <div class="dfsbk-title">🌲 Forest Path Sum</div>
        <div class="dfsbk-story">
          🦊 <strong>Forest Fox</strong> wants to find all root-to-leaf paths that sum to <strong style="color:#fbbf24">${TARGET}</strong>!
          <strong>DFS</strong> explores every path, <strong>Backtracking</strong> undoes failed paths.
          When a leaf is reached with wrong sum → backtrack and try another branch!
        </div>
        <div class="dfsbk-main">
          <div class="dfsbk-tree-wrap">
            <div class="dfsbk-tree-title">🌳 Binary Tree (target = ${TARGET})</div>
            <svg class="dfsbk-svg" id="dfsbk-svg" viewBox="0 0 400 200"></svg>
          </div>
          <div class="dfsbk-right">
            <div class="dfsbk-path-panel">
              <div class="dfsbk-path-title">🐾 Current Path</div>
              <div class="dfsbk-path-items" id="dfsbk-path-items"></div>
            </div>
            <div class="dfsbk-sum-panel">
              <div class="dfsbk-sum-row"><span>Current Sum</span><span id="dfsbk-sum">0</span></div>
              <div class="dfsbk-sum-row"><span>Target</span><span style="color:#fbbf24">${TARGET}</span></div>
            </div>
            <div class="dfsbk-found-panel">
              <div class="dfsbk-found-title">✅ Paths Found</div>
              <div id="dfsbk-found-list"><div style="color:#374151;font-size:10px">none yet</div></div>
            </div>
          </div>
        </div>
        <button class="dfsbk-btn" id="dfsbk-btn" aria-label="Advance to next DFS step">🌲 Next DFS Step!</button>
        <div class="dfsbk-status" id="dfsbk-status">👆 Watch DFS explore paths — backtrack when sum is wrong!</div>
      </div>`;
    const root=container.querySelector('#dfsbk-root');
    const hwBtn=document.createElement('button');hwBtn.className='hw-btn';hwBtn.setAttribute('aria-label','How to play');hwBtn.textContent='ℹ️';root.appendChild(hwBtn);
    const hwPanel=document.createElement('div');hwPanel.className='hw-panel';hwPanel.style.display='none';
    hwPanel.innerHTML='<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> DFS + Backtracking: DFS explores every root-to-leaf path; backtracking undoes each step when the path sum fails.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Click Next Step to watch DFS go deeper into the tree.</li><li>When a leaf is reached with the wrong sum → backtrack!</li><li>Find all paths that sum to the target number.</li></ul><div class="hw-insight">💡 Key insight: DFS (go deep) + Backtrack (undo) = explore ALL valid paths without missing any.</div></div>';
    root.appendChild(hwPanel);hwBtn.addEventListener('click',()=>{hwPanel.style.display=hwPanel.style.display==='none'?'block':'none';});
    container.querySelector('#dfsbk-btn').addEventListener('click',nextStep2);
    renderTree([],[]);updateStepIndicator(1,STEPS.length);

    function nextStep2(){
      if(done||step>=STEPS.length)return;
      const s=STEPS[step];
      const statusEl=container.querySelector('#dfsbk-status');
      if(s.action==='visit'){
        currentPath=[...s.path];currentPathIds=[...s.pathIds];
        if(s.isValid){
          foundPaths.push([...s.path]);foundPathIds.push([...s.pathIds]);
          statusEl.innerHTML=`🎉 <strong style="color:#4ade80">FOUND!</strong> Path [${s.path.join('+')}] = ${s.sum} = Target!`;
        } else if(s.isLeaf){
          statusEl.innerHTML=`🍂 Leaf! Sum=${s.sum} ≠ ${TARGET} → will backtrack.`;
        } else {
          statusEl.innerHTML=`🌿 Visiting node <strong>${s.node.val}</strong> → path sum so far: ${s.sum}`;
        }
      } else {
        currentPath=s.path.slice(0,-1);currentPathIds=s.pathIds.slice(0,-1);
        statusEl.innerHTML=`🔙 <strong>Backtrack</strong> from ${s.node.val} (${s.reason}). Try other branches!`;
      }
      step++;
      if(step>=STEPS.length){done=true;container.querySelector('#dfsbk-btn').disabled=true;setTimeout(celebrate,400);}
      renderTree(currentPathIds,foundPathIds);renderSidebar(s);
      updateStepIndicator(Math.min(step+1,STEPS.length),STEPS.length);
    }
    function renderSidebar(s){
      const pathEl=container.querySelector('#dfsbk-path-items');pathEl.innerHTML='';
      currentPath.forEach((v,i)=>{
        const d=document.createElement('div');d.className='dfsbk-pi';d.textContent=v;pathEl.appendChild(d);
        if(i<currentPath.length-1){const a=document.createElement('span');a.style.color='#374151';a.textContent='+';pathEl.appendChild(a);}
      });
      container.querySelector('#dfsbk-sum').textContent=currentPath.reduce((a,b)=>a+b,0);
      const fl=container.querySelector('#dfsbk-found-list');fl.innerHTML='';
      if(foundPaths.length===0){fl.innerHTML='<div style="color:#374151;font-size:10px">none yet</div>';}
      else foundPaths.forEach(p=>{const d=document.createElement('div');d.className='dfsbk-found-item';d.textContent=`[${p.join('→')}]=${p.reduce((a,b)=>a+b,0)}`;fl.appendChild(d);});
    }
    function renderTree(activePathIds,foundPathIdSets){
      const svg=container.querySelector('#dfsbk-svg');svg.innerHTML='';
      // Edges
      NODES.forEach(n=>{
        [n.left,n.right].forEach(child=>{if(!child)return;
          const isActive=activePathIds.includes(n.id)&&activePathIds.includes(child.id);
          const l=document.createElementNS('http://www.w3.org/2000/svg','line');
          l.setAttribute('x1',String(n.x));l.setAttribute('y1',String(n.y));
          l.setAttribute('x2',String(child.x));l.setAttribute('y2',String(child.y));
          l.setAttribute('class','dfsbk-edge'+(isActive?' active':''));svg.appendChild(l);
        });
      });
      // Nodes
      NODES.forEach(n=>{
        const inPath=activePathIds.includes(n.id);
        const isFound=foundPathIdSets.some(p=>p.includes(n.id));
        const g=document.createElementNS('http://www.w3.org/2000/svg','g');
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',String(n.x));c.setAttribute('cy',String(n.y));c.setAttribute('r','14');
        c.setAttribute('fill',isFound?'rgba(74,222,128,.35)':inPath?'rgba(74,222,128,.2)':'rgba(255,255,255,.04)');
        c.setAttribute('stroke',isFound?'#4ade80':inPath?'rgba(74,222,128,.6)':'rgba(255,255,255,.1)');c.setAttribute('stroke-width','2');
        g.appendChild(c);
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',String(n.x));t.setAttribute('y',String(n.y+1));
        t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
        t.setAttribute('fill',inPath||isFound?'#fff':'#4b5563');
        t.setAttribute('font-size','10');t.setAttribute('font-weight','800');t.setAttribute('font-family','Nunito,sans-serif');
        t.textContent=String(n.val);g.appendChild(t);
        svg.appendChild(g);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#4ade80','#fbbf24','#60a5fa','#f472b6','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='dfsbk-win';
      ov.innerHTML=`
        <div class="dfsbk-win-big">🌲</div>
        <div class="dfsbk-win-h1">All Paths Found!</div>
        <div class="dfsbk-win-p">
          Found ${foundPaths.length} path(s) summing to ${TARGET}!<br>
          DFS explores every branch. Backtracking <strong>undoes each step</strong> when it fails.<br>
          Time complexity: <strong>O(N)</strong> — every node visited once!<br>
          <small style="color:#8892b0">LeetCode #113: Path Sum II ✨</small>
        </div>
        <button class="dfsbk-win-btn" id="dfsbk-replay">🔄 Search Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#dfsbk-replay').addEventListener('click',()=>{ov.remove();step=0;currentPath=[];currentPathIds=[];foundPaths=[];foundPathIds=[];done=false;
        container.querySelector('#dfsbk-btn').disabled=false;
        container.querySelector('#dfsbk-status').textContent='👆 Watch DFS explore paths — backtrack when sum is wrong!';
        renderTree([],[]);
        container.querySelector('#dfsbk-path-items').innerHTML='';
        container.querySelector('#dfsbk-sum').textContent='0';
        container.querySelector('#dfsbk-found-list').innerHTML='<div style="color:#374151;font-size:10px">none yet</div>';
        updateStepIndicator(1,STEPS.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('dfs-backtracking',{init,
      nextStep:()=>nextStep2(),
      prevStep:()=>{step=0;currentPath=[];currentPathIds=[];foundPaths=[];foundPathIds=[];done=false;
        container.querySelector('#dfsbk-btn').disabled=false;
        container.querySelectorAll('.dfsbk-win').forEach(e=>e.remove());
        renderTree([],[]);
        container.querySelector('#dfsbk-path-items').innerHTML='';
        container.querySelector('#dfsbk-sum').textContent='0';
        container.querySelector('#dfsbk-found-list').innerHTML='<div style="color:#374151;font-size:10px">none yet</div>';
        updateStepIndicator(1,STEPS.length);},
      setMode:()=>{}});
  }
})();
