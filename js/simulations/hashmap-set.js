/* Hash Map — The Monster Collector 👾
   INTERACTIVE: Process each monster — find the first DUPLICATE!
   Vault = Hash Map. O(1) lookup beats O(n²) checking every pair! */
(() => {
  const MONSTERS = ['🐉','🦊','🐉','👾','🦊','💀','🐉','🧟'];
  const NAMES    = ['Dragon','Fox','Dragon','Blob','Fox','Skull','Dragon','Zombie'];
  function injectStyles(){
    if(document.getElementById('hm-styles'))return;
    const s=document.createElement('style');s.id='hm-styles';
    s.textContent=`
      .hm-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#0f0a1e 0%,#1a0f00 50%,#0a1e0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .hm-title{font-size:16px;font-weight:900;color:#f472b6;text-shadow:0 0 18px rgba(244,114,182,.5);z-index:1;}
      .hm-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .hm-queue-label{font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;z-index:1;}
      .hm-queue{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;z-index:1;max-width:640px;}
      .hm-mon{width:58px;height:64px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;
        border:2.5px solid rgba(255,255,255,.1);background:#0f172a;transition:all .4s;cursor:default;}
      .hm-mon .me{font-size:24px;} .hm-mon .mn{font-size:9px;color:#4b5563;margin-top:2px;font-weight:700;}
      .hm-mon.current{border-color:#f472b6!important;background:rgba(244,114,182,.15)!important;
        box-shadow:0 0 22px rgba(244,114,182,.5)!important;animation:curPulse .8s ease-in-out infinite alternate!important;}
      @keyframes curPulse{from{transform:scale(1)}to{transform:scale(1.1)}}
      .hm-mon.done{opacity:.35;filter:grayscale(.7);border-color:rgba(255,255,255,.04);}
      .hm-mon.dup{border-color:#fbbf24!important;background:rgba(251,191,36,.15)!important;
        box-shadow:0 0 28px rgba(251,191,36,.6)!important;opacity:1!important;filter:none!important;}
      .hm-vault-wrap{width:100%;max-width:660px;z-index:1;}
      .hm-vault-label{font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;text-align:center;margin-bottom:6px;}
      .hm-vault{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;}
      .hm-slot{width:70px;height:72px;border-radius:10px;border:2px solid rgba(255,255,255,.06);
        background:#0c0f1a;display:flex;flex-direction:column;align-items:center;justify-content:center;
        transition:all .4s;position:relative;}
      .hm-slot.filled{border-color:rgba(96,165,250,.4)!important;background:rgba(96,165,250,.1)!important;}
      .hm-slot.collision{border-color:#fbbf24!important;background:rgba(251,191,36,.2)!important;
        box-shadow:0 0 28px rgba(251,191,36,.6)!important;animation:colFlash .4s ease-out 3!important;}
      @keyframes colFlash{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
      .hm-slot .se{font-size:20px;} .hm-slot .sn{font-size:8px;color:#4b5563;margin-top:2px;font-weight:700;}
      .hm-slot .sk{position:absolute;top:2px;left:4px;font-size:7px;color:#374151;font-weight:800;}
      .hm-slot .count-badge{position:absolute;top:-5px;right:-5px;background:#f472b6;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:900;color:#fff;display:flex;align-items:center;justify-content:center;}
      .hm-btn{padding:12px 30px;border-radius:14px;border:none;cursor:pointer;font-size:14px;font-weight:800;
        background:linear-gradient(135deg,#9d174d,#db2777);color:#fff;
        box-shadow:0 4px 18px rgba(157,23,77,.4);transition:all .2s;z-index:1;}
      .hm-btn:hover:not(:disabled){transform:translateY(-3px);}
      .hm-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .hm-status{font-size:12.5px;color:#94a3b8;text-align:center;z-index:1;max-width:540px;min-height:22px;}
      .hm-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .hm-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .hm-win-h1{font-size:22px;font-weight:900;color:#f472b6;}
      .hm-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .hm-win-btn{padding:10px 26px;background:linear-gradient(135deg,#9d174d,#ec4899);border:none;
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
    let idx=0,vault=new Map(),found=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="hm-root" id="hm-root">
        <div class="hm-title">👾 The Monster Collector</div>
        <div class="hm-story">
          🧙 <strong>Zara</strong> is cataloging monsters for the Royal Museum. She needs to find the
          <strong>first monster that appears twice</strong>! Instead of comparing every pair (slow!),
          she uses a magic <strong style="color:#f472b6">Vault (Hash Map)</strong> — it remembers each monster instantly!
        </div>
        <div class="hm-queue-label">Monster Queue (unprocessed)</div>
        <div class="hm-queue" id="hm-queue"></div>
        <div class="hm-vault-wrap">
          <div class="hm-vault-label">🔐 Vault (Hash Map) — already seen</div>
          <div class="hm-vault" id="hm-vault"></div>
        </div>
        <button class="hm-btn" id="hm-btn" aria-label="Catch next monster and check for duplicates">🔍 Check Next Monster!</button>
        <div class="hm-status" id="hm-status">👇 Click to process monsters one by one!</div>
      </div>`;
    const root=container.querySelector('#hm-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> A Hash Map/Set provides O(1) average-time lookups to detect duplicates instantly.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Monsters appear one by one on the trail.</li><li>Each new monster is checked against the set of seen monsters.</li><li>First duplicate detected = you win!</li></ul><div class="hw-insight">💡 Key insight: HashSet lookup is O(1) — detect duplicates in a single pass.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#hm-btn').addEventListener('click',doCheck);
    render();updateStepIndicator(1,MONSTERS.length);

    function doCheck(){
      if(found||idx>=MONSTERS.length)return;
      const mon=MONSTERS[idx];
      const nm=NAMES[idx];
      const statusEl=container.querySelector('#hm-status');
      if(vault.has(mon)){
        found=true;
        vault.get(mon).count++;
        render();
        statusEl.innerHTML=`🚨 <strong style="color:#fbbf24">${nm} ${mon} is already in the vault!</strong> First duplicate found!`;
        container.querySelector('#hm-btn').disabled=true;
        // Mark all occurrences
        container.querySelectorAll('.hm-mon').forEach(el=>{if(el.dataset.mon===mon)el.classList.add('dup');});
        container.querySelectorAll('.hm-slot').forEach(el=>{if(el.dataset.mon===mon)el.classList.add('collision');});
        setTimeout(celebrate,700);
      } else {
        vault.set(mon,{emoji:mon,name:nm,count:1});
        idx++;
        statusEl.innerHTML=`✅ ${nm} ${mon} is <em>new</em> — added to vault. ${MONSTERS.length-idx} more to check!`;
        render();
        updateStepIndicator(Math.min(idx+1,MONSTERS.length),MONSTERS.length);
      }
    }
    function render(){
      const qEl=container.querySelector('#hm-queue');
      const vEl=container.querySelector('#hm-vault');
      qEl.innerHTML='';vEl.innerHTML='';
      MONSTERS.forEach((m,i)=>{
        const d=document.createElement('div');d.className='hm-mon'+(i===idx&&!found?' current':i<idx?' done':'');
        d.dataset.mon=m;
        d.innerHTML=`<span class="me">${m}</span><span class="mn">${NAMES[i]}</span>`;
        qEl.appendChild(d);
      });
      [...vault.entries()].forEach(([key,{emoji,name,count}])=>{
        const d=document.createElement('div');d.className='hm-slot filled';d.dataset.mon=key;
        d.innerHTML=`<span class="sk">key:</span><span class="se">${emoji}</span><span class="sn">${name}</span>`;
        if(count>1){const b=document.createElement('div');b.className='count-badge';b.textContent=count;d.appendChild(b);}
        vEl.appendChild(d);
      });
      // Empty slots
      const empties=Math.max(0,5-vault.size);
      for(let i=0;i<empties;i++){const d=document.createElement('div');d.className='hm-slot';d.innerHTML='<span style="color:#1f2937;font-size:10px">empty</span>';vEl.appendChild(d);}
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#f472b6','#fbbf24','#4ade80','#60a5fa','#a78bfa'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const dupMon=MONSTERS[idx];const dupIdx=MONSTERS.indexOf(dupMon);
      const ov=document.createElement('div');ov.className='hm-win';
      ov.innerHTML=`
        <div class="hm-win-big">${dupMon}</div>
        <div class="hm-win-h1">Duplicate Found!</div>
        <div class="hm-win-p">
          <strong style="color:#f472b6">${NAMES[dupIdx]} ${dupMon}</strong> appeared twice!<br>
          Hash Map found it in just ${idx+1} checks — no re-scanning needed!<br>
          <small style="color:#8892b0">Key insight: "find duplicate / find pair" → Hash Map = O(n) ✨</small>
        </div>
        <button class="hm-win-btn" id="hm-replay">🔄 New Collection!</button>`;
      root.appendChild(ov);
      ov.querySelector('#hm-replay').addEventListener('click',()=>{ov.remove();idx=0;vault=new Map();found=false;
        container.querySelector('#hm-btn').disabled=false;
        container.querySelector('#hm-status').textContent='👇 Click to process monsters one by one!';
        render();updateStepIndicator(1,MONSTERS.length);});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('hashmap-set',{init,
      nextStep:()=>doCheck(),
      prevStep:()=>{idx=0;vault=new Map();found=false;
        container.querySelector('#hm-btn').disabled=false;
        container.querySelector('#hm-status').textContent='👇 Click to process monsters one by one!';
        container.querySelectorAll('.hm-win').forEach(e=>e.remove());
        render();updateStepIndicator(1,MONSTERS.length);},
      setMode:()=>{}});
  }
})();