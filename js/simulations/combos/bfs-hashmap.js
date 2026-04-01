/* BFS + HashMap — Word Ladder Wizard 🔤
   INTERACTIVE: Transform CAT → DOG one letter at a time!
   Each word must be a real word — BFS finds the shortest path! */
(() => {
  const WORD_DICT=new Set(['cat','bat','hat','hot','bot','dot','dog','cot','lot','log','lag','lad','bad','bag','big','bid','bit','hit','sit','six','mix','max','map','tap','tip','top','pop','cop','cod','cog','fog','for','fur','fun','sun','son','ton','top','too','zoo','bar','car','far','tar','war','ran','run','rut','but','bun','gun','gum','sum','sue','due','dye','die','did','dig','fig','fit','fat','fan','pan','pin','pig','pit','set','see','sex','sew','saw','raw','row','cow','low','law','lay','day','say','may','bay','pay','way','ray','lab','led','led','fed','fee','bee','see','tea','pea','sea','red','bed','beg','beg','leg','peg','ten','hen','men','den','net','bet','get','let','met','pet','wet','vet','yet','yew','few','dew','hew','new','sew','eve','use','ice','ace','age','ape','are','ate','awe','axe','aye','eye','toe','hoe','foe','roe','woe','ore','ire','ire']);
  const START='cat',END='dog';
  const BFS_PATH=['cat','cot','dot','dog']; // pre-known shortest
  function injectStyles(){
    if(document.getElementById('bfsh-styles'))return;
    const s=document.createElement('style');s.id='bfsh-styles';
    s.textContent=`
      .bfsh-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0a0528 0%,#0f0a28 50%,#050a1e 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .bfsh-title{font-size:16px;font-weight:900;color:#a78bfa;text-shadow:0 0 18px rgba(167,139,250,.4);z-index:1;}
      .bfsh-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .bfsh-main{display:flex;gap:14px;z-index:1;width:100%;max-width:720px;}
      .bfsh-left{flex:1;display:flex;flex-direction:column;gap:8px;}
      .bfsh-path-panel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:11px;padding:10px;}
      .bfsh-path-title{font-size:10px;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
      .bfsh-path-chain{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
      .bfsh-word-card{padding:6px 12px;border-radius:9px;font-size:14px;font-weight:900;letter-spacing:2px;
        min-width:50px;text-align:center;border:2px solid;transition:all .3s;}
      .bfsh-word-card.done{background:rgba(74,222,128,.15);border-color:#4ade80;color:#4ade80;}
      .bfsh-word-card.current{background:rgba(167,139,250,.2);border-color:#a78bfa;color:#e9d5ff;
        animation:wordPulse .8s ease-in-out infinite alternate;}
      @keyframes wordPulse{from{box-shadow:0 0 6px rgba(167,139,250,.3)}to{box-shadow:0 0 20px rgba(167,139,250,.6)}}
      .bfsh-word-card.pending{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1);color:#374151;}
      .bfsh-arrow{color:#4b5563;font-size:16px;font-weight:800;}
      .bfsh-queue-panel{background:rgba(251,191,36,.06);border:1.5px solid rgba(251,191,36,.2);border-radius:10px;padding:8px;}
      .bfsh-queue-title{font-size:10px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
      .bfsh-queue-items{display:flex;gap:5px;flex-wrap:wrap;min-height:28px;}
      .bfsh-q-item{padding:3px 10px;border-radius:6px;font-size:11px;font-weight:800;
        background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.3);color:#fbbf24;}
      .bfsh-visited-panel{background:rgba(96,165,250,.05);border:1px solid rgba(96,165,250,.15);border-radius:10px;padding:8px;}
      .bfsh-visited-title{font-size:10px;font-weight:800;color:#60a5fa;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
      .bfsh-visited-items{display:flex;gap:4px;flex-wrap:wrap;min-height:24px;}
      .bfsh-v-item{padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700;
        background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.2);color:#93c5fd;}
      .bfsh-right{min-width:180px;display:flex;flex-direction:column;gap:8px;}
      .bfsh-right-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;}
      .bfsh-neighbors{display:flex;flex-direction:column;gap:3px;}
      .bfsh-nb{padding:4px 10px;border-radius:7px;font-size:12px;font-weight:800;
        border:1.5px solid;cursor:default;transition:all .2s;}
      .bfsh-nb.valid{background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.3);color:#4ade80;}
      .bfsh-nb.visited{background:rgba(107,114,128,.08);border-color:rgba(107,114,128,.15);color:#374151;text-decoration:line-through;}
      .bfsh-nb.not-word{background:rgba(248,113,113,.07);border-color:rgba(248,113,113,.2);color:#f87171;font-style:italic;}
      .bfsh-btn{padding:11px 26px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        background:linear-gradient(135deg,#2e1065,#7c3aed);color:#fff;
        box-shadow:0 4px 16px rgba(46,16,101,.4);transition:all .2s;z-index:1;}
      .bfsh-btn:hover:not(:disabled){transform:translateY(-2px);}
      .bfsh-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .bfsh-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .bfsh-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .bfsh-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .bfsh-win-h1{font-size:22px;font-weight:900;color:#a78bfa;}
      .bfsh-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .bfsh-win-btn{padding:10px 26px;background:linear-gradient(135deg,#2e1065,#7c3aed);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
  function getNeighbors(word){
    const neighbors=[];
    for(let i=0;i<word.length;i++){
      for(let c='a'.charCodeAt(0);c<='z'.charCodeAt(0);c++){
        const ch=String.fromCharCode(c);if(ch===word[i])continue;
        const next=word.slice(0,i)+ch+word.slice(i+1);
        neighbors.push({word:next,isWord:WORD_DICT.has(next)});
      }
    }
    return neighbors.filter(n=>n.word!==word);
  }
  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    // BFS guided: we walk through BFS_PATH steps
    let step=0,queue=[START],visited=new Map([[START,null]]),done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="bfsh-root" id="bfsh-root">
        <div class="bfsh-title">🔤 Word Ladder Wizard</div>
        <div class="bfsh-story">
          🧙 <strong>Lexie the Word Wizard</strong> must transform "<strong>CAT</strong>" into "<strong>DOG</strong>" changing <strong>one letter at a time</strong>!
          Each intermediate word must be real! <strong>BFS</strong> guarantees the <strong>shortest ladder</strong>.
          A <strong>HashMap</strong> tracks visited words to avoid loops!
        </div>
        <div class="bfsh-main">
          <div class="bfsh-left">
            <div class="bfsh-path-panel">
              <div class="bfsh-path-title">🪜 Transformation Ladder</div>
              <div class="bfsh-path-chain" id="bfsh-chain"></div>
            </div>
            <div class="bfsh-queue-panel">
              <div class="bfsh-queue-title">📬 BFS Queue</div>
              <div class="bfsh-queue-items" id="bfsh-queue"></div>
            </div>
            <div class="bfsh-visited-panel">
              <div class="bfsh-visited-title">🗺️ Visited HashMap</div>
              <div class="bfsh-visited-items" id="bfsh-visited"></div>
            </div>
          </div>
          <div class="bfsh-right">
            <div class="bfsh-right-title">🔎 Neighbors of Current</div>
            <div class="bfsh-neighbors" id="bfsh-neighbors"></div>
          </div>
        </div>
        <button class="bfsh-btn" id="bfsh-btn" aria-label="Process next word in BFS ladder">🔤 Process Next Word!</button>
        <div class="bfsh-status" id="bfsh-status">👆 BFS explores all one-letter changes at each step!</div>
      </div>`;
    const root=container.querySelector('#bfsh-root');
    const hwBtn=document.createElement('button');hwBtn.className='hw-btn';hwBtn.setAttribute('aria-label','How to play');hwBtn.textContent='ℹ️';root.appendChild(hwBtn);
    const hwPanel=document.createElement('div');hwPanel.className='hw-panel';hwPanel.style.display='none';
    hwPanel.innerHTML='<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> BFS + HashMap: BFS finds the shortest word transformation path; HashMap prevents revisiting words.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Each step transforms one letter of the current word.</li><li>BFS guarantees the shortest ladder — explore level by level!</li><li>The HashMap tracks visited words so we never loop!</li></ul><div class="hw-insight">💡 Key insight: BFS (queue) + HashMap (O(1) visited check) = shortest path in word graph.</div></div>';
    root.appendChild(hwPanel);hwBtn.addEventListener('click',()=>{hwPanel.style.display=hwPanel.style.display==='none'?'block':'none';});
    container.querySelector('#bfsh-btn').addEventListener('click',processNext);
    renderAll();updateStepIndicator(1,BFS_PATH.length);

    function processNext(){
      if(done||step>=BFS_PATH.length-1)return;
      const current=BFS_PATH[step];
      const next=BFS_PATH[step+1];
      // Add next to visited
      visited.set(next,current);
      // Remove current from queue, add next
      const qi=queue.indexOf(current);if(qi>=0)queue.splice(qi,1);
      if(!queue.includes(next))queue.push(next);
      step++;
      const statusEl=container.querySelector('#bfsh-status');
      statusEl.innerHTML=`🔤 From "<strong>${current}</strong>" changed '${[...current].find((c,i)=>c!==next[i])}' → '${[...next].find((c,i)=>c!==current[i])}' to get "<strong style="color:#a78bfa">${next}</strong>"`;
      if(next===END){done=true;container.querySelector('#bfsh-btn').disabled=true;setTimeout(celebrate,400);}
      renderAll();updateStepIndicator(step+1,BFS_PATH.length);
    }
    function renderAll(){
      // Chain
      const chain=container.querySelector('#bfsh-chain');chain.innerHTML='';
      BFS_PATH.forEach((w,i)=>{
        const card=document.createElement('div');
        card.className='bfsh-word-card'+(i<step?' done':i===step?' current':' pending');
        card.textContent=w.toUpperCase();chain.appendChild(card);
        if(i<BFS_PATH.length-1){const arr=document.createElement('div');arr.className='bfsh-arrow';arr.textContent='→';chain.appendChild(arr);}
      });
      // Queue
      const qEl=container.querySelector('#bfsh-queue');qEl.innerHTML='';
      if(queue.length===0){qEl.innerHTML='<div style="color:#374151;font-size:10px">empty</div>';}
      queue.forEach(w=>{const d=document.createElement('div');d.className='bfsh-q-item';d.textContent=w;qEl.appendChild(d);});
      // Visited
      const vEl=container.querySelector('#bfsh-visited');vEl.innerHTML='';
      visited.forEach((from,w)=>{const d=document.createElement('div');d.className='bfsh-v-item';d.textContent=w+(from?`←${from}`:'');vEl.appendChild(d);});
      // Neighbors of current word
      const nbEl=container.querySelector('#bfsh-neighbors');nbEl.innerHTML='';
      const current=BFS_PATH[step];
      const nbs=getNeighbors(current).slice(0,10);
      nbs.forEach(({word,isWord})=>{
        const d=document.createElement('div');
        d.className='bfsh-nb '+(visited.has(word)?'visited':isWord?'valid':'not-word');
        d.textContent=visited.has(word)?`${word} ✓`:isWord?`${word} ✅`:`${word} ✗`;
        nbEl.appendChild(d);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#a78bfa','#fbbf24','#4ade80','#60a5fa','#f472b6'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='bfsh-win';
      ov.innerHTML=`
        <div class="bfsh-win-big">🔤</div>
        <div class="bfsh-win-h1">Ladder Complete!</div>
        <div class="bfsh-win-p">
          <strong>CAT → ${BFS_PATH.join(' → ')} </strong><br>
          ${BFS_PATH.length-1} steps — the <strong>shortest possible!</strong><br>
          BFS guarantees shortest path. HashMap prevents revisiting words!<br>
          <small style="color:#8892b0">LeetCode #127: Word Ladder ✨</small>
        </div>
        <button class="bfsh-win-btn" id="bfsh-replay">🔄 Try Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#bfsh-replay').addEventListener('click',()=>{ov.remove();step=0;queue=[START];visited=new Map([[START,null]]);done=false;
        container.querySelector('#bfsh-btn').disabled=false;
        container.querySelector('#bfsh-status').textContent='👆 BFS explores all one-letter changes at each step!';
        renderAll();updateStepIndicator(1,BFS_PATH.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('bfs-hashmap',{init,
      nextStep:()=>processNext(),
      prevStep:()=>{step=0;queue=[START];visited=new Map([[START,null]]);done=false;
        container.querySelector('#bfsh-btn').disabled=false;
        container.querySelectorAll('.bfsh-win').forEach(e=>e.remove());
        renderAll();updateStepIndicator(1,BFS_PATH.length);},
      setMode:()=>{}});
  }
  app.registerSim('bfs-hashmap', { init });
})();