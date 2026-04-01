/* Binary Search — The Royal Library 📚
   INTERACTIVE: You know the target (31). Open the
   middle book — then decide: go left or right! */
(() => {
  const BOOKS = [3,7,12,18,24,31,45,52,67,89];
  const TARGET = 31;
  const EMOJIS = ['📘','📗','📙','📕','📒','📔','📓','📃','📜','📄'];
  function injectStyles(){
    if(document.getElementById('bs-styles'))return;
    const s=document.createElement('style'); s.id='bs-styles';
    s.textContent=`
      .bs-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:14px 20px 16px;gap:10px;box-sizing:border-box;
        background:linear-gradient(160deg,#1a0a2e 0%,#0d1a3e 60%,#0a1a0a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .bs-hud{display:flex;align-items:center;gap:10px;width:100%;max-width:700px;z-index:1;}
      .bs-title{font-size:16px;font-weight:900;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.5);flex:1;text-align:center;}
      .bs-hearts{font-size:18px;letter-spacing:2px;}
      .bs-steps{background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.3);border-radius:20px;padding:3px 12px;font-size:12px;color:#fbbf24;font-weight:800;}
      .bs-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:11px;
        padding:7px 14px;max-width:660px;width:100%;font-size:12.5px;line-height:1.5;color:#a0aec0;text-align:center;z-index:1;}
      .bs-target{background:rgba(251,191,36,.12);border:2px solid rgba(251,191,36,.4);border-radius:20px;
        padding:4px 20px;color:#fbbf24;font-size:14px;font-weight:900;z-index:1;}
      .bs-shelf{width:100%;max-width:680px;display:flex;flex-direction:column;gap:6px;z-index:1;}
      .bs-books{display:flex;gap:3px;height:72px;align-items:flex-end;padding:0 4px;}
      .bs-book{flex:1;border-radius:5px 5px 2px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-size:10px;font-weight:900;cursor:default;transition:all .35s;border:2px solid transparent;position:relative;}
      .bs-book.active{border-color:rgba(255,255,255,.25);height:100%;}
      .bs-book.elim{height:30%;opacity:.25;filter:grayscale(.8);}
      .bs-book.mid{border-color:#fbbf24!important;box-shadow:0 0 24px rgba(251,191,36,.6)!important;height:100%;
        animation:bookGlow .9s ease-in-out infinite alternate;}
      @keyframes bookGlow{from{box-shadow:0 0 12px rgba(251,191,36,.4)}to{box-shadow:0 0 28px rgba(251,191,36,.8)}}
      .bs-book .bv{font-size:13px;font-weight:900;color:#fff;}
      .bs-book .bi{font-size:8px;color:rgba(255,255,255,.5);margin-top:2px;}
      .bs-book .be{font-size:18px;}
      .bs-markers{display:flex;gap:3px;padding:0 4px;}
      .bs-marker-slot{flex:1;display:flex;justify-content:center;font-size:9px;font-weight:800;height:16px;align-items:center;}
      .bs-marker-slot .ml{color:#4ade80;} .bs-marker-slot .mr{color:#f87171;}
      .bs-marker-slot .mm{color:#fbbf24;font-size:11px;}
      .bs-compare{font-size:18px;font-weight:900;text-align:center;padding:7px 22px;border-radius:14px;z-index:1;}
      .bs-compare.big{background:rgba(248,113,113,.15);border:2px solid rgba(248,113,113,.4);color:#fca5a5;}
      .bs-compare.small{background:rgba(96,165,250,.15);border:2px solid rgba(96,165,250,.4);color:#93c5fd;}
      .bs-compare.eq{background:rgba(251,191,36,.2);border:2px solid #fbbf24;color:#fbbf24;}
      .bs-compare.guess{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#6b7280;font-size:13px;}
      .bs-btns{display:flex;gap:10px;z-index:1;flex-wrap:wrap;justify-content:center;}
      .bs-btn{padding:11px 20px;border-radius:13px;border:none;cursor:pointer;font-size:13px;font-weight:800;
        box-shadow:0 4px 14px rgba(0,0,0,.3);transition:all .2s;}
      .bs-btn:hover:not(:disabled){transform:translateY(-3px);}
      .bs-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
      .btn-left{background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;}
      .btn-here{background:linear-gradient(135deg,#b45309,#d97706);color:#fff;}
      .btn-right{background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff;}
      .bs-fb{min-height:22px;font-size:12px;text-align:center;z-index:1;padding:4px 14px;border-radius:8px;max-width:600px;opacity:1;transition:opacity .3s;}
      .fb-ok{background:rgba(74,222,128,.12);color:#4ade80;border:1px solid rgba(74,222,128,.3);}
      .fb-no{background:rgba(248,113,113,.12);color:#f87171;border:1px solid rgba(248,113,113,.3);}
      .fb-h{opacity:0;}
      .bs-win{position:absolute;inset:0;background:rgba(0,0,0,.92);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        z-index:100;animation:winFade .5s;}
      @keyframes winFade{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
      .bs-win-big{font-size:66px;animation:wBig .65s ease-out infinite alternate;}
      @keyframes wBig{from{transform:translateY(0) scale(1)}to{transform:translateY(-14px) scale(1.12)}}
      .bs-win-h1{font-size:24px;font-weight:900;color:#fbbf24;}
      .bs-win-p{color:#c4c9e8;font-size:13px;max-width:400px;text-align:center;line-height:1.6;}
      .bs-win-stats{display:flex;gap:12px;}
      .bws{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:8px 16px;text-align:center;}
      .bwsv{font-size:20px;font-weight:900;color:#fbbf24;} .bwsl{font-size:9px;color:#6b7280;}
      .bs-win-btn{padding:10px 26px;background:linear-gradient(135deg,#b45309,#f59e0b);border:none;
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
  function init(container, opts){
    const {updateStepIndicator,onComplete}=opts;
    injectStyles();
    let lo=0,hi=BOOKS.length-1,steps=0,hearts=3,found=false;
    const startTime=Date.now();
    container.innerHTML=`
      <div class="bs-root" id="bs-root">
        <div class="bs-hud">
          <div class="bs-title">📚 The Royal Library</div>
          <div class="bs-hearts" id="bs-hearts">❤️❤️❤️</div>
          <div class="bs-steps" id="bs-steps-el">Steps: 0</div>
        </div>
        <div class="bs-story">
          🧙 The Royal Wizard asks: find the book with magic power <strong style="color:#fbbf24">${TARGET}</strong>!
          The books are <em>sorted by power</em>. You can always open the <strong>middle book</strong>
          and decide: is our target <strong>smaller</strong> (go left) or <strong>larger</strong> (go right)?
        </div>
        <div class="bs-target">🎯 Seeking: Magic Power <strong>${TARGET}</strong></div>
        <div class="bs-shelf">
          <div class="bs-books" id="bs-books"></div>
          <div class="bs-markers" id="bs-markers"></div>
        </div>
        <div class="bs-compare guess" id="bs-compare">👆 Look at the glowing middle book — is it our target?</div>
        <div class="bs-btns">
          <button class="bs-btn btn-left" id="bs-btn-left" aria-label="Guess: book number is too low">← Search Left<br><small>Target is smaller</small></button>
          <button class="bs-btn btn-here" id="bs-btn-here" aria-label="Guess: book number is just right">🎯 Found It!<br><small>This IS it!</small></button>
          <button class="bs-btn btn-right" id="bs-btn-right" aria-label="Guess: book number is too high">Search Right →<br><small>Target is larger</small></button>
        </div>
        <div class="bs-fb fb-h" id="bs-fb"></div>
      </div>`;
    const root=container.querySelector('#bs-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Binary Search finds a target by halving the sorted search space each guess.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>A book number is hidden in sorted order (1–10).</li><li>Each guess cuts the remaining range in half.</li><li>Choose Too Low / Just Right / Too High!</li></ul><div class="hw-insight">💡 Key insight: Binary Search = cut sorted space in half each step → O(log n).</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#bs-btn-left').addEventListener('click',()=>choose('left'));
    container.querySelector('#bs-btn-here').addEventListener('click',()=>choose('here'));
    container.querySelector('#bs-btn-right').addEventListener('click',()=>choose('right'));
    render();updateStepIndicator(1,4);
    function getMid(){return Math.floor((lo+hi)/2);}
    function choose(dir){
      if(found)return;
      const mid=getMid(),mv=BOOKS[mid];
      const correct=mv===TARGET?'here':mv>TARGET?'left':'right';
      if(dir===correct){
        const compEl=container.querySelector('#bs-compare');
        if(dir==='here'){found=true;steps++;render();setTimeout(celebrate,400);return;}
        if(dir==='left'){hi=mid-1;}else{lo=mid+1;}
        steps++;
        container.querySelector('#bs-steps-el').textContent=`Steps: ${steps}`;
        showFb(`✅ Correct! ${mv} ${dir==='left'?'>':'<'} ${TARGET} — search ${dir==='left'?'left':'right'} half!`,'ok');
        render();updateStepIndicator(Math.min(steps+1,4),4);
      } else {
        hearts=Math.max(0,hearts-1);
        container.querySelector('#bs-hearts').textContent='❤️'.repeat(hearts)+'🖤'.repeat(3-hearts);
        const mv2=BOOKS[getMid()];
        showFb(`❌ Oops! Middle book has power ${mv2}. ${mv2===TARGET?'It\'s exactly '+TARGET+'! Click Found It!':mv2>TARGET?mv2+' > '+TARGET+' — the book we want is in the LEFT half!':mv2+' < '+TARGET+' — the book we want is in the RIGHT half!'}`,'no');
      }
    }
    function render(){
      const mid=getMid();
      const booksEl=container.querySelector('#bs-books');
      const markersEl=container.querySelector('#bs-markers');
      const compEl=container.querySelector('#bs-compare');
      booksEl.innerHTML='';markersEl.innerHTML='';
      BOOKS.forEach((v,i)=>{
        const d=document.createElement('div');
        const isElim=i<lo||i>hi;
        const isMid=i===mid&&!found;
        d.className='bs-book'+(isMid?' mid':isElim?' elim':' active');
        const colors=['#1e40af','#166534','#92400e','#6d28d9','#065f46','#9a3412','#1e3a8a','#14532d','#7c2d12','#4a1d96'];
        d.style.background=`linear-gradient(to bottom,${colors[i%colors.length]},${colors[i%colors.length]}cc)`;
        d.innerHTML=`<span class="be">${EMOJIS[i]}</span><span class="bv">${v}</span><span class="bi">[${i}]</span>`;
        booksEl.appendChild(d);
        const ms=document.createElement('div');ms.className='bs-marker-slot';
        if(i===lo&&i===hi&&i===mid)ms.innerHTML='<span class="mm">▲ LO MID HI</span>';
        else if(i===mid)ms.innerHTML='<span class="mm">▲ MID</span>';
        else if(i===lo)ms.innerHTML='<span class="ml">▲ LO</span>';
        else if(i===hi)ms.innerHTML='<span class="mr">▲ HI</span>';
        markersEl.appendChild(ms);
      });
      const midV=BOOKS[mid];
      compEl.className='bs-compare '+(midV===TARGET?'eq':midV>TARGET?'big':'small');
      compEl.innerHTML=midV===TARGET?`✨ Middle book = <strong>${midV}</strong> — That's exactly ${TARGET}! 🎯`:
        midV>TARGET?`📖 Middle book power = <strong>${midV}</strong> is <em>too big</em>. Our target ${TARGET} is in the LEFT half →`:
        `📖 Middle book power = <strong>${midV}</strong> is <em>too small</em>. Our target ${TARGET} is in the RIGHT half →`;
    }
    function showFb(msg,type){
      const el=container.querySelector('#bs-fb');
      el.className=`bs-fb fb-${type}`;el.innerHTML=msg;
      clearTimeout(el._t);el._t=setTimeout(()=>el.className='bs-fb fb-h',3000);
    }
    function celebrate(){
      const elapsed=Date.now()-startTime;
      const stars=hearts===3?3:hearts>=2?3:2;
      const colors=['#fbbf24','#4ade80','#60a5fa','#f472b6','#a78bfa'];
      for(let i=0;i<55;i++){
        const p=document.createElement('div');p.className='conf';
        p.style.cssText=`--ex:${(Math.random()-.5)*200}px;--d:${.8+Math.random()*.8}s;--dl:${Math.random()*.4}s;background:${colors[i%colors.length]};left:${5+Math.random()*90}%;top:0;`;
        root.appendChild(p);setTimeout(()=>p.remove(),2000);
      }
      const ov=document.createElement('div');ov.className='bs-win';
      const logN=Math.ceil(Math.log2(BOOKS.length));
      ov.innerHTML=`
        <div class="bs-win-big">📚</div>
        <div class="bs-win-h1">Book Found!</div>
        <div class="bs-win-p">
          Magic power <strong style="color:#fbbf24">${TARGET}</strong> found in just <strong style="color:#4ade80">${steps} steps</strong>!<br>
          Binary Search cut the library in HALF each time.<br>
          <small style="color:#8892b0">10 books needs at most ${logN} steps — that's O(log n) magic! ✨</small>
        </div>
        <div class="bs-win-stats">
          <div class="bws"><div class="bwsv">${steps}</div><div class="bwsl">Steps</div></div>
          <div class="bws"><div class="bwsv">${'⭐'.repeat(stars)}</div><div class="bwsl">Stars</div></div>
          <div class="bws"><div class="bwsv">O(log n)</div><div class="bwsl">Speed</div></div>
        </div>
        <button class="bs-win-btn" id="bs-replay">🔄 Search Again!</button>`;
      root.appendChild(ov);
      ov.querySelector('#bs-replay').addEventListener('click',()=>{ov.remove();lo=0;hi=BOOKS.length-1;steps=0;hearts=3;found=false;
        container.querySelector('#bs-hearts').textContent='❤️❤️❤️';container.querySelector('#bs-steps-el').textContent='Steps: 0';
        container.querySelector('#bs-fb').className='bs-fb fb-h';render();updateStepIndicator(1,4);});
      onComplete&&onComplete(stars,elapsed);
    }
    app.registerSim('binary-search',{init,
      nextStep:()=>{const mid=getMid(),mv=BOOKS[mid];choose(mv===TARGET?'here':mv>TARGET?'left':'right');},
      prevStep:()=>{lo=0;hi=BOOKS.length-1;steps=0;hearts=3;found=false;
        container.querySelector('#bs-hearts').textContent='❤️❤️❤️';container.querySelector('#bs-steps-el').textContent='Steps: 0';
        container.querySelector('#bs-fb').className='bs-fb fb-h';
        container.querySelectorAll('.bs-win').forEach(e=>e.remove());render();updateStepIndicator(1,4);},
      setMode:()=>{}});
  }
  app.registerSim('binary-search', { init });
})();