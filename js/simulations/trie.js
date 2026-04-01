/* Trie — The Wizard Spellbook 🧙
   INTERACTIVE: Type letters and watch the trie path light up!
   Autocomplete reveals matching spells! */
(() => {
  const WORDS=['fire','fireball','fireblast','frostbolt','frost','flood','fly','flow',
    'thunder','thunderstrike','teleport','tidal','blast','blaze','blizzard'];
  class TrieNode{constructor(){this.children={};this.isEnd=false;this.word='';}}
  function buildTrie(){
    const root=new TrieNode();
    WORDS.forEach(w=>{
      let node=root;
      for(const ch of w){
        if(!node.children[ch])node.children[ch]=new TrieNode();
        node=node.children[ch];
      }
      node.isEnd=true;node.word=w;
    });
    return root;
  }
  const TRIE_ROOT=buildTrie();
  function injectStyles(){
    if(document.getElementById('tr-styles'))return;
    const s=document.createElement('style');s.id='tr-styles';
    s.textContent=`
      .tr-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0c0828 0%,#150a35 50%,#0a0828 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .tr-title{font-size:16px;font-weight:900;color:#c084fc;text-shadow:0 0 18px rgba(192,132,252,.4);z-index:1;}
      .tr-story{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .tr-main{display:flex;gap:14px;z-index:1;width:100%;max-width:720px;align-items:flex-start;}
      .tr-input-panel{min-width:200px;display:flex;flex-direction:column;gap:10px;}
      .tr-input-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;}
      .tr-keyboard{display:flex;flex-direction:column;gap:4px;}
      .tr-krow{display:flex;gap:4px;justify-content:center;}
      .tr-key{width:30px;height:30px;border-radius:7px;background:rgba(192,132,252,.1);
        border:1.5px solid rgba(192,132,252,.2);color:#c4c9e8;font-size:12px;font-weight:800;
        cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
      .tr-key:hover{background:rgba(192,132,252,.25);transform:scale(1.1);}
      .tr-key.active{background:rgba(192,132,252,.4);border-color:#c084fc;color:#fff;}
      .tr-key.backspace{width:44px;font-size:10px;}
      .tr-typed{background:rgba(192,132,252,.08);border:1.5px solid rgba(192,132,252,.25);border-radius:10px;
        padding:8px 14px;font-size:15px;font-weight:800;color:#e9d5ff;text-align:center;min-height:40px;
        letter-spacing:3px;}
      .tr-search-label{font-size:10px;color:#6b7280;text-align:center;}
      .tr-right{flex:1;display:flex;flex-direction:column;gap:8px;}
      .tr-trie-panel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:11px;
        padding:10px;min-height:100px;overflow-x:auto;}
      .tr-trie-title{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
      .tr-trie-svg{width:100%;min-height:80px;}
      .tr-results{background:rgba(74,222,128,.05);border:1.5px solid rgba(74,222,128,.2);border-radius:10px;padding:8px 12px;}
      .tr-results-title{font-size:10px;font-weight:800;color:#4ade80;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
      .tr-spell-list{display:flex;flex-wrap:wrap;gap:5px;}
      .tr-spell{padding:4px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;
        transition:all .2s;border:1.5px solid;}
      .tr-spell:hover{transform:scale(1.05);}
      .tr-spell.prefix{background:rgba(192,132,252,.12);border-color:rgba(192,132,252,.35);color:#c084fc;}
      .tr-spell.exact{background:rgba(74,222,128,.15);border-color:rgba(74,222,128,.4);color:#4ade80;}
      .tr-status{font-size:12px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .tr-no-match{color:#374151;font-size:11px;font-style:italic;}
      .tr-node-circle{fill:rgba(192,132,252,.15);stroke:rgba(192,132,252,.3);stroke-width:1.5;}
      .tr-node-circle.on-path{fill:rgba(192,132,252,.5);stroke:#c084fc;stroke-width:2.5;}
      .tr-node-circle.end-word{fill:rgba(74,222,128,.4);stroke:#4ade80;stroke-width:2;}
      .tr-node-text{fill:#a0aec0;font-size:9px;font-family:Nunito,sans-serif;font-weight:800;
        text-anchor:middle;dominant-baseline:central;}
      .tr-node-text.on-path{fill:#fff;}
      .tr-link{stroke:rgba(192,132,252,.2);stroke-width:1.5;}
      .tr-link.on-path{stroke:#c084fc;stroke-width:2.5;}
      .tr-edge-label{fill:#7c3aed;font-size:8px;font-family:Nunito,sans-serif;font-weight:800;text-anchor:middle;}
      .tr-edge-label.on-path{fill:#e879f9;}
      .tr-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .tr-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .tr-win-h1{font-size:22px;font-weight:900;color:#c084fc;}
      .tr-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .tr-win-btn{padding:10px 26px;background:linear-gradient(135deg,#4c1d95,#7c3aed);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
  function search(prefix){
    let node=TRIE_ROOT;const path=[node];
    for(const ch of prefix){
      if(!node.children[ch])return{node:null,path,found:[]};
      node=node.children[ch];path.push(node);
    }
    const found=[];
    function dfs(n,w){if(n.isEnd)found.push(w);Object.entries(n.children).forEach(([ch,nn])=>dfs(nn,w+ch));}
    dfs(node,prefix);
    return{node,path,found};
  }
  function init(container,opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    let typed='',spellsFound=new Set(),challenge=false;
    const startTime=Date.now();
    const TARGET_SPELLS=['fire','fireball','frost','fly'];
    container.innerHTML=`
      <div class="tr-root" id="tr-root">
        <div class="tr-title">🧙 The Wizard Spellbook</div>
        <div class="tr-story">
          📖 <strong>Zara the Wizard</strong> needs to find spells quickly!
          Each letter you type travels down the <strong>Trie tree</strong>, revealing matching spells.
          Type to search — the Trie finds all matching spells <strong>instantly</strong>!
          <strong style="color:#fbbf24">Goal:</strong> Find "fire", "fireball", "frost", and "fly"!
        </div>
        <div class="tr-main">
          <div class="tr-input-panel">
            <div class="tr-input-title">🔤 Type a Spell</div>
            <div class="tr-typed" id="tr-typed">_</div>
            <div class="tr-search-label" id="tr-slabel">Type letters below</div>
            <div class="tr-keyboard" id="tr-keyboard"></div>
          </div>
          <div class="tr-right">
            <div class="tr-trie-panel">
              <div class="tr-trie-title">🌳 Trie Tree (first few levels)</div>
              <svg class="tr-trie-svg" id="tr-trie-svg" viewBox="0 0 380 110"></svg>
            </div>
            <div class="tr-results">
              <div class="tr-results-title">✨ Matching Spells</div>
              <div class="tr-spell-list" id="tr-spell-list"><div class="tr-no-match">Type letters to search...</div></div>
            </div>
          </div>
        </div>
        <div class="tr-status" id="tr-status">🧙 Type any letters to search the Trie spellbook!</div>
      </div>`;
    const root=container.querySelector('#tr-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> A Trie stores strings character-by-character in a tree for ultra-fast prefix lookups.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Type letters on the keyboard to search for spells.</li><li>The trie highlights all spells that share your typed prefix.</li><li>Find all 5 target spells to master the spellbook!</li></ul><div class="hw-insight">💡 Key insight: Trie prefix search: O(L) where L = length of prefix typed.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    buildKeyboard();drawTrie('');updateStepIndicator(1,TARGET_SPELLS.length);

    function buildKeyboard(){
      const rows=[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m','⌫']];
      const kb=container.querySelector('#tr-keyboard');
      rows.forEach(row=>{
        const rowEl=document.createElement('div');rowEl.className='tr-krow';
        row.forEach(ch=>{
          const k=document.createElement('div');
          k.className='tr-key'+(ch==='⌫'?' backspace':'');k.textContent=ch;k.setAttribute('aria-label',ch==='⌫'?'Delete last letter':'Type letter '+ch.toUpperCase());
          k.addEventListener('click',()=>{
            if(ch==='⌫'){if(typed.length>0)typed=typed.slice(0,-1);}
            else if(typed.length<8)typed+=ch;
            updateSearch();
          });
          rowEl.appendChild(k);
        });
        kb.appendChild(rowEl);
      });
    }
    function updateSearch(){
      const typedEl=container.querySelector('#tr-typed');
      const slabel=container.querySelector('#tr-slabel');
      const statusEl=container.querySelector('#tr-status');
      const spellsEl=container.querySelector('#tr-spell-list');
      typedEl.textContent=typed||'_';
      // Highlight active keys
      container.querySelectorAll('.tr-key').forEach(k=>{
        k.classList.toggle('active',typed.endsWith(k.textContent)&&k.textContent!=='⌫');
      });
      if(!typed){
        slabel.textContent='Type letters below';
        spellsEl.innerHTML='<div class="tr-no-match">Type letters to search...</div>';
        drawTrie('');return;
      }
      const {node,path,found}=search(typed);
      drawTrie(typed);
      if(!node){
        slabel.textContent='No spells start with "'+typed+'"';
        spellsEl.innerHTML='<div class="tr-no-match">No matching spells...</div>';
        statusEl.innerHTML=`❌ No spells start with "<strong>${typed}</strong>" — the trie path ends here!`;
        return;
      }
      slabel.textContent=`${found.length} spell${found.length!==1?'s':''} found!`;
      spellsEl.innerHTML='';
      found.forEach(sp=>{
        const d=document.createElement('div');
        d.className='tr-spell'+(sp===typed?' exact':' prefix');
        d.textContent='🪄 '+sp;
        d.addEventListener('click',()=>{
          if(TARGET_SPELLS.includes(sp)&&!spellsFound.has(sp)){
            spellsFound.add(sp);
            updateStepIndicator(spellsFound.size,TARGET_SPELLS.length);
            if(spellsFound.size>=TARGET_SPELLS.length)setTimeout(celebrate,400);
            else statusEl.innerHTML=`✨ <strong>${sp}</strong> found! ${TARGET_SPELLS.length-spellsFound.size} more target spell(s) to go!`;
          }
        });
        spellsEl.appendChild(d);
      });
      statusEl.innerHTML=`🌳 Path "<strong style="color:#c084fc">${typed}</strong>" found ${found.length} spell(s): O(prefix_length) search!`;
    }
    function drawTrie(prefix){
      const svg=container.querySelector('#tr-trie-svg');svg.innerHTML='';
      const rootKeys=Object.keys(TRIE_ROOT.children).slice(0,8);
      const nodeW=46,levelH=30;
      rootKeys.forEach((ch,i)=>{
        const x=22+i*46,y=15;
        const onPath=prefix.length>0&&prefix[0]===ch;
        // edge from root
        const l=document.createElementNS('http://www.w3.org/2000/svg','line');
        l.setAttribute('x1','190');l.setAttribute('y1','0');l.setAttribute('x2',String(x));l.setAttribute('y2',String(y-8));
        l.setAttribute('class','tr-link'+(onPath?' on-path':''));svg.appendChild(l);
        const el=document.createElementNS('http://www.w3.org/2000/svg','text');
        el.setAttribute('x',String((x+190)/2));el.setAttribute('y',String((y-8)/2+2));
        el.setAttribute('class','tr-edge-label'+(onPath?' on-path':''));el.textContent=ch;svg.appendChild(el);
        const node=TRIE_ROOT.children[ch];
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',String(x));c.setAttribute('cy',String(y));c.setAttribute('r','10');
        c.setAttribute('class','tr-node-circle'+(onPath?' on-path':'')+(node.isEnd?' end-word':''));svg.appendChild(c);
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',String(x));t.setAttribute('y',String(y));
        t.setAttribute('class','tr-node-text'+(onPath?' on-path':''));t.textContent=ch;svg.appendChild(t);
        // Second level
        if(onPath&&prefix.length>1){
          const nextCh=prefix[1];const nextNode=node.children[nextCh];
          if(nextNode){
            const x2=x,y2=y+levelH;
            const l2=document.createElementNS('http://www.w3.org/2000/svg','line');
            l2.setAttribute('x1',String(x));l2.setAttribute('y1',String(y+10));l2.setAttribute('x2',String(x2));l2.setAttribute('y2',String(y2-10));
            l2.setAttribute('class','tr-link on-path');svg.appendChild(l2);
            const el2=document.createElementNS('http://www.w3.org/2000/svg','text');
            el2.setAttribute('x',String((x+x2)/2+6));el2.setAttribute('y',String((y+y2)/2));
            el2.setAttribute('class','tr-edge-label on-path');el2.textContent=nextCh;svg.appendChild(el2);
            const c2=document.createElementNS('http://www.w3.org/2000/svg','circle');
            c2.setAttribute('cx',String(x2));c2.setAttribute('cy',String(y2));c2.setAttribute('r','10');
            c2.setAttribute('class','tr-node-circle on-path'+(nextNode.isEnd?' end-word':''));svg.appendChild(c2);
            const t2=document.createElementNS('http://www.w3.org/2000/svg','text');
            t2.setAttribute('x',String(x2));t2.setAttribute('y',String(y2));
            t2.setAttribute('class','tr-node-text on-path');t2.textContent=prefix.slice(0,2);svg.appendChild(t2);
            if(prefix.length>2){
              const nextCh3=prefix[2];const nextNode3=nextNode.children[nextCh3];
              if(nextNode3){
                const x3=x2,y3=y2+levelH;
                const l3=document.createElementNS('http://www.w3.org/2000/svg','line');
                l3.setAttribute('x1',String(x2));l3.setAttribute('y1',String(y2+10));l3.setAttribute('x2',String(x3));l3.setAttribute('y2',String(y3-10));
                l3.setAttribute('class','tr-link on-path');svg.appendChild(l3);
                const el3=document.createElementNS('http://www.w3.org/2000/svg','text');
                el3.setAttribute('x',String((x2+x3)/2+6));el3.setAttribute('y',String((y2+y3)/2));
                el3.setAttribute('class','tr-edge-label on-path');el3.textContent=nextCh3;svg.appendChild(el3);
                const c3=document.createElementNS('http://www.w3.org/2000/svg','circle');
                c3.setAttribute('cx',String(x3));c3.setAttribute('cy',String(y3));c3.setAttribute('r','10');
                c3.setAttribute('class','tr-node-circle on-path'+(nextNode3.isEnd?' end-word':''));svg.appendChild(c3);
                const t3=document.createElementNS('http://www.w3.org/2000/svg','text');
                t3.setAttribute('x',String(x3));t3.setAttribute('y',String(y3));
                t3.setAttribute('class','tr-node-text on-path');t3.textContent=prefix.slice(0,3);svg.appendChild(t3);
              }
            }
          }
        }
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#c084fc','#fbbf24','#4ade80','#60a5fa','#f472b6'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const ov=document.createElement('div');ov.className='tr-win';
      ov.innerHTML=`
        <div class="tr-win-big">🧙</div>
        <div class="tr-win-h1">All Spells Found!</div>
        <div class="tr-win-p">
          The Trie searches by <strong>prefix in O(m)</strong> time (m = prefix length).<br>
          Shared prefixes share nodes → huge memory savings!<br>
          <small style="color:#8892b0">Key insight: "autocomplete / word search" → Trie ✨</small>
        </div>
        <button class="tr-win-btn" id="tr-replay">🔄 New Search!</button>`;
      root.appendChild(ov);
      ov.querySelector('#tr-replay').addEventListener('click',()=>{ov.remove();typed='';spellsFound=new Set();
        container.querySelector('#tr-typed').textContent='_';
        container.querySelector('#tr-spell-list').innerHTML='<div class="tr-no-match">Type letters to search...</div>';
        drawTrie('');updateStepIndicator(0,TARGET_SPELLS.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('trie',{init,nextStep:()=>updateSearch(),prevStep:()=>{typed='';spellsFound=new Set();
      container.querySelector('#tr-typed').textContent='_';
      container.querySelector('#tr-spell-list').innerHTML='<div class="tr-no-match">Type letters to search...</div>';
      container.querySelectorAll('.tr-win').forEach(e=>e.remove());
      drawTrie('');updateStepIndicator(0,TARGET_SPELLS.length);},setMode:()=>{}});
  }
})();