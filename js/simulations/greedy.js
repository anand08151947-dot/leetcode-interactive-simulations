/* Greedy — The Pirate's Coin Change 🏴‍☠️
   INTERACTIVE: Make change using fewest coins.
   Greedy always picks the LARGEST coin that fits! */
(() => {
  const COINS=[25,10,5,1];
  const COIN_NAMES=['Quarter','Dime','Nickel','Penny'];
  const COIN_EMOJIS=['🪙','💰','🔵','🟡'];
  const TARGET=67;
  function injectStyles(){
    if(document.getElementById('gr-styles'))return;
    const s=document.createElement('style');s.id='gr-styles';
    s.textContent=`
      .gr-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:12px 18px 14px;gap:9px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a0a00 0%,#0d1a1a 50%,#0a0a1e 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .gr-title{font-size:16px;font-weight:900;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.5);z-index:1;}
      .gr-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .gr-target{background:rgba(251,191,36,.12);border:2px solid rgba(251,191,36,.4);border-radius:20px;
        padding:4px 20px;color:#fbbf24;font-size:14px;font-weight:900;z-index:1;}
      .gr-coin-bar{display:flex;gap:10px;z-index:1;flex-wrap:wrap;justify-content:center;}
      .gr-coin-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 14px;
        border-radius:12px;border:2.5px solid rgba(255,255,255,.1);background:#0f172a;
        cursor:pointer;transition:all .2s;min-width:82px;}
      .gr-coin-btn:hover:not(:disabled){transform:translateY(-4px);box-shadow:0 6px 20px rgba(0,0,0,.4);}
      .gr-coin-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
      .gr-coin-btn.best{border-color:#fbbf24!important;background:rgba(251,191,36,.1)!important;
        box-shadow:0 0 16px rgba(251,191,36,.4)!important;animation:bestPulse .9s ease-in-out infinite alternate!important;}
      @keyframes bestPulse{from{box-shadow:0 0 8px rgba(251,191,36,.3)}to{box-shadow:0 0 22px rgba(251,191,36,.7)}}
      .gc-em{font-size:28px;} .gc-v{font-size:14px;font-weight:900;color:#fbbf24;} .gc-n{font-size:9px;color:#6b7280;}
      .gc-cnt{font-size:10px;font-weight:800;color:#4ade80;background:rgba(74,222,128,.1);border-radius:8px;padding:1px 8px;}
      .gr-progress{width:100%;max-width:620px;z-index:1;}
      .gr-prog-label{display:flex;justify-content:space-between;font-size:11px;color:#6b7280;margin-bottom:5px;}
      .gr-prog-bar{height:16px;border-radius:8px;background:#0f172a;border:1px solid rgba(255,255,255,.07);overflow:hidden;}
      .gr-prog-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#b45309,#fbbf24);transition:width .4s;}
      .gr-remaining{font-size:24px;font-weight:900;text-align:center;color:#fbbf24;z-index:1;}
      .gr-chest{min-height:56px;display:flex;flex-wrap:wrap;gap:5px;justify-content:center;
        background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:11px;
        padding:8px;max-width:620px;width:100%;z-index:1;align-content:flex-start;}
      .gr-chest-label{font-size:10px;color:#4b5563;font-weight:800;text-align:center;width:100%;}
      .gr-coin-chip{background:rgba(251,191,36,.15);border:1.5px solid rgba(251,191,36,.4);border-radius:6px;
        padding:3px 8px;font-size:11px;font-weight:800;color:#fbbf24;animation:chipIn .2s ease-out;}
      @keyframes chipIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
      .gr-status{font-size:12.5px;color:#94a3b8;text-align:center;z-index:1;max-width:560px;min-height:18px;}
      .gr-btns{display:flex;gap:8px;z-index:1;}
      .gr-rset-btn{padding:9px 18px;border-radius:11px;border:none;cursor:pointer;font-size:12px;font-weight:800;
        background:linear-gradient(135deg,#374151,#4b5563);color:#e2e8f0;transition:all .2s;}
      .gr-rset-btn:hover{transform:translateY(-1px);}
      .gr-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .gr-win-big{font-size:64px;animation:wB .65s ease-out infinite alternate;}
      @keyframes wB{from{transform:translateY(0)}to{transform:translateY(-14px)}}
      .gr-win-h1{font-size:22px;font-weight:900;color:#fbbf24;}
      .gr-win-p{color:#c4c9e8;font-size:12.5px;max-width:400px;text-align:center;line-height:1.6;}
      .gr-win-btn{padding:10px 26px;background:linear-gradient(135deg,#b45309,#f59e0b);border:none;border-radius:11px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;}
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
    let remaining=TARGET,coinCounts=new Array(COINS.length).fill(0),totalCoins=0,done=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="gr-root" id="gr-root">
        <div class="gr-title">🏴‍☠️ The Pirate's Coin Chest</div>
        <div class="gr-story">
          🦜 <strong>Captain Parrot</strong> owes the treasure keeper <strong style="color:#fbbf24">${TARGET}¢</strong>!
          He must use the <em>fewest coins possible</em>. The greedy trick: always pick the
          <strong style="color:#fbbf24">LARGEST coin that still fits</strong> the remaining amount!
        </div>
        <div class="gr-target">💰 Amount to make: <strong>${TARGET}¢</strong></div>
        <div class="gr-coin-bar" id="gr-coin-bar"></div>
        <div class="gr-progress">
          <div class="gr-prog-label"><span>0¢</span><span id="gr-rem-label">${TARGET}¢ remaining</span><span>${TARGET}¢</span></div>
          <div class="gr-prog-bar"><div class="gr-prog-fill" id="gr-fill" style="width:0%"></div></div>
        </div>
        <div class="gr-remaining" id="gr-remaining">${TARGET}¢ left</div>
        <div class="gr-chest" id="gr-chest"><div class="gr-chest-label">🏴‍☠️ Treasure Chest (coins used)</div></div>
        <div class="gr-btns">
          <button class="gr-rset-btn" id="gr-hint" aria-label="Get a hint for the best coin to pick">💡 Hint</button>
          <button class="gr-rset-btn" id="gr-reset" aria-label="Reset the coin chest">🔄 Reset</button>
        </div>
        <div class="gr-status" id="gr-status">👆 Pick the largest coin that fits ${remaining}¢!</div>
      </div>`;
    const root=container.querySelector('#gr-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> The Greedy algorithm always picks the locally best option hoping for a global optimum.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Make change for an amount using fewest coins.</li><li>Always pick the largest coin that fits the remaining amount.</li><li>Works perfectly when coin denominations allow greedy choice!</li></ul><div class="hw-insight">💡 Key insight: Greedy coin change: always use the biggest coin ≤ remaining amount.</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#gr-hint').addEventListener('click',doHint);
    container.querySelector('#gr-reset').addEventListener('click',doReset);
    renderCoins();updateStepIndicator(1,COINS.length+2);

    function bestCoin(){return COINS.findIndex(c=>c<=remaining);}
    function addCoin(ci){
      if(done||COINS[ci]>remaining)return;
      const notBest=bestCoin()!==ci;
      if(notBest){
        container.querySelector('#gr-status').innerHTML=`💡 That works but it's not the <strong style="color:#fbbf24">greedy choice</strong>! Try the <strong>${COIN_NAMES[bestCoin()]}</strong> (${COINS[bestCoin()]}¢) — it's bigger and still fits!`;
        return;
      }
      coinCounts[ci]++;totalCoins++;
      remaining-=COINS[ci];
      const chest=container.querySelector('#gr-chest');
      const chip=document.createElement('div');chip.className='gr-coin-chip';
      chip.textContent=`${COIN_EMOJIS[ci]} ${COINS[ci]}¢`;chest.appendChild(chip);
      const fill=Math.round(((TARGET-remaining)/TARGET)*100);
      container.querySelector('#gr-fill').style.width=fill+'%';
      container.querySelector('#gr-remaining').textContent=remaining>0?`${remaining}¢ left`:'Done! 🎉';
      container.querySelector('#gr-rem-label').textContent=`${remaining}¢ remaining`;
      if(remaining===0){
        done=true;container.querySelector('#gr-status').innerHTML=`🎉 <strong style="color:#4ade80">Perfect!</strong> Made ${TARGET}¢ with just ${totalCoins} coins!`;
        setTimeout(celebrate,500);
      } else {
        container.querySelector('#gr-status').innerHTML=`✅ Added ${COIN_NAMES[ci]} (${COINS[ci]}¢). ${remaining}¢ remaining — what's the biggest coin that fits?`;
      }
      renderCoins();updateStepIndicator(Math.min(totalCoins+1,COINS.length+2),COINS.length+2);
    }
    function doHint(){
      const bi=bestCoin();
      if(bi>=0)container.querySelector('#gr-status').innerHTML=`💡 Greedy hint: pick the <strong style="color:#fbbf24">${COIN_NAMES[bi]} (${COINS[bi]}¢)</strong> — it's the largest that fits ${remaining}¢!`;
    }
    function doReset(){
      remaining=TARGET;coinCounts=new Array(COINS.length).fill(0);totalCoins=0;done=false;
      container.querySelector('#gr-fill').style.width='0%';
      container.querySelector('#gr-remaining').textContent=`${TARGET}¢ left`;
      container.querySelector('#gr-rem-label').textContent=`${TARGET}¢ remaining`;
      container.querySelector('#gr-status').textContent=`👆 Pick the largest coin that fits ${TARGET}¢!`;
      container.querySelectorAll('.gr-win').forEach(e=>e.remove());
      const chest=container.querySelector('#gr-chest');
      chest.innerHTML='<div class="gr-chest-label">🏴‍☠️ Treasure Chest (coins used)</div>';
      renderCoins();updateStepIndicator(1,COINS.length+2);
    }
    function renderCoins(){
      const bar=container.querySelector('#gr-coin-bar');bar.innerHTML='';
      COINS.forEach((c,i)=>{
        const btn=document.createElement('button');
        const isBest=bestCoin()===i&&!done;
        btn.className='gr-coin-btn'+(isBest?' best':'');
        btn.disabled=c>remaining||done;
        btn.innerHTML=`<span class="gc-em">${COIN_EMOJIS[i]}</span><span class="gc-v">${c}¢</span><span class="gc-n">${COIN_NAMES[i]}</span><span class="gc-cnt">×${coinCounts[i]}</span>`;
        btn.setAttribute('aria-label',`Add ${COIN_NAMES[i]} coin – ${c} cents`);
        btn.addEventListener('click',()=>addCoin(i));
        bar.appendChild(btn);
      });
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const colors=['#fbbf24','#4ade80','#60a5fa','#f472b6','#fb923c'];
      for(let i=0;i<50;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.7}s;--dl:${Math.random()*.35}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),1900);
      }
      const breakdown=COINS.map((c,i)=>coinCounts[i]>0?`${coinCounts[i]}×${c}¢`:null).filter(Boolean).join(' + ');
      const ov=document.createElement('div');ov.className='gr-win';
      ov.innerHTML=`
        <div class="gr-win-big">🏴‍☠️</div>
        <div class="gr-win-h1">Treasure Paid!</div>
        <div class="gr-win-p">
          Made <strong style="color:#fbbf24">${TARGET}¢</strong> with just <strong style="color:#4ade80">${totalCoins} coins</strong>!<br>
          ${breakdown}<br>
          Greedy worked because coin values are "nice" (each is a multiple of smaller ones).<br>
          <small style="color:#8892b0">Key insight: "minimum number / local best choice" → Greedy ✨</small>
        </div>
        <button class="gr-win-btn" id="gr-replay">🔄 New Treasure!</button>`;
      root.appendChild(ov);
      ov.querySelector('#gr-replay').addEventListener('click',()=>{ov.remove();doReset();});
      onComplete&&onComplete(3,elapsed);
    }
    app.registerSim('greedy',{init,
      nextStep:()=>{const bi=bestCoin();if(bi>=0)addCoin(bi);},
      prevStep:()=>doReset(),
      setMode:()=>{}});
  }
  app.registerSim('greedy', { init });
})();