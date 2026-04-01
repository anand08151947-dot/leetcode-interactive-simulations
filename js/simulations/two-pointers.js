/* =============================================
   Two Pointers — The Magic Bridge Quest 🌉
   INTERACTIVE GAME: Pick the right hero to move!
   Array: [1,4,5,7,9,11,14,20]  Target: 16
   ============================================= */
(() => {
  const ARRAY = [1, 4, 5, 7, 9, 11, 14, 20];
  const TARGET = 16;

  function injectStyles() {
    if (document.getElementById('tp-game-styles')) return;
    const s = document.createElement('style');
    s.id = 'tp-game-styles';
    s.textContent = `
      .tp-root{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
        padding:14px 20px 16px;gap:10px;box-sizing:border-box;
        background:linear-gradient(160deg,#0f0c29 0%,#1a1040 50%,#0d1b2a 100%);
        border-radius:12px;overflow:hidden;position:relative;font-family:Nunito,sans-serif;}
      .tp-stars{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
      .tp-star{position:absolute;background:#fff;border-radius:50%;animation:twinkle var(--d,2s) var(--dl,0s) ease-in-out infinite alternate;}
      @keyframes twinkle{0%{opacity:.2;transform:scale(.8)}100%{opacity:.9;transform:scale(1.2)}}
      .tp-hud{display:flex;align-items:center;gap:12px;width:100%;max-width:700px;z-index:1;}
      .tp-title{font-size:17px;font-weight:900;color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.5);flex:1;text-align:center;}
      .tp-hearts{font-size:18px;letter-spacing:2px;}
      .tp-movebadge{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:2px 10px;font-size:11px;color:#8892b0;white-space:nowrap;}
      .tp-story{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;
        padding:9px 16px;max-width:660px;width:100%;font-size:13px;line-height:1.55;color:#c4c9e8;text-align:center;z-index:1;}
      .tp-target-pill{background:rgba(250,204,21,.15);border:2px solid rgba(250,204,21,.4);border-radius:20px;
        padding:4px 18px;color:#facc15;font-size:14px;font-weight:800;z-index:1;}
      .tp-arena{position:relative;width:100%;max-width:700px;z-index:1;}
      .tp-hero-track{display:flex;height:68px;margin-bottom:0;}
      .tp-hero-slot{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:3px;position:relative;}
      .tp-hero-fig{font-size:34px;line-height:1;transition:transform .35s cubic-bezier(.34,1.56,.64,1);filter:drop-shadow(0 2px 8px rgba(0,0,0,.5));}
      .tp-hero-name{font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-top:1px;}
      .hero-merlin .tp-hero-name{color:#4ade80;}
      .hero-katniss .tp-hero-name{color:#a78bfa;}
      .tp-hero-fig.bounce{animation:heroBounce .4s ease-out;}
      .tp-hero-fig.shake{animation:heroShake .35s ease-out;}
      @keyframes heroBounce{0%{transform:translateY(0) scale(1)}40%{transform:translateY(-24px) scale(1.25)}100%{transform:translateY(0) scale(1)}}
      @keyframes heroShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px) rotate(-8deg)}75%{transform:translateX(10px) rotate(8deg)}}
      .tp-stones{display:flex;gap:5px;}
      .tp-stone{flex:1;height:62px;border-radius:10px;display:flex;flex-direction:column;align-items:center;
        justify-content:center;font-size:18px;font-weight:900;border:2px solid rgba(255,255,255,.1);
        background:rgba(20,24,40,.9);color:#3a4060;transition:all .3s;position:relative;}
      .tp-stone .si{font-size:9px;color:#2d3258;margin-top:2px;font-weight:600;}
      .tp-stone.sl{background:linear-gradient(135deg,#064e3b,#065f46)!important;border-color:#4ade80!important;color:#fff!important;box-shadow:0 0 20px rgba(74,222,128,.4)!important;}
      .tp-stone.sr{background:linear-gradient(135deg,#3730a3,#4338ca)!important;border-color:#818cf8!important;color:#fff!important;box-shadow:0 0 20px rgba(129,140,248,.4)!important;}
      .tp-stone.sm{background:linear-gradient(135deg,#78350f,#b45309)!important;border-color:#facc15!important;color:#fff!important;box-shadow:0 0 32px rgba(250,204,21,.7)!important;animation:stonePulse .5s ease-in-out infinite alternate!important;}
      .tp-stone.sp{opacity:.18;filter:grayscale(.8);}
      @keyframes stonePulse{from{transform:scale(1)}to{transform:scale(1.07)}}
      .tp-sum{z-index:1;padding:9px 24px;border-radius:22px;font-size:19px;font-weight:900;text-align:center;transition:all .3s;min-width:260px;}
      .s-big{background:rgba(220,38,38,.18);border:2px solid #f87171;color:#fca5a5;}
      .s-small{background:rgba(37,99,235,.18);border:2px solid #60a5fa;color:#93c5fd;}
      .s-match{background:rgba(217,119,6,.25);border:2px solid #facc15;color:#facc15;animation:sumPop .4s ease-out 3;}
      @keyframes sumPop{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}
      .tp-question{font-size:13px;color:#c4c9e8;text-align:center;z-index:1;max-width:560px;min-height:20px;}
      .tp-btns{display:flex;gap:12px;z-index:1;}
      .tp-btn{padding:12px 22px;border-radius:13px;border:none;cursor:pointer;font-size:14px;font-weight:800;
        transition:all .2s;letter-spacing:.3px;box-shadow:0 4px 14px rgba(0,0,0,.35);}
      .tp-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.45);}
      .tp-btn:active:not(:disabled){transform:translateY(-1px);}
      .tp-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
      .btn-ka{background:linear-gradient(135deg,#4338ca,#6d28d9);color:#fff;}
      .btn-me{background:linear-gradient(135deg,#047857,#059669);color:#fff;}
      .tp-btn.cf{animation:correctFlash .4s;}
      .tp-btn.wf{animation:wrongFlash .35s;background:linear-gradient(135deg,#991b1b,#dc2626)!important;}
      @keyframes correctFlash{0%{filter:brightness(1)}50%{filter:brightness(1.7)}100%{filter:brightness(1)}}
      @keyframes wrongFlash{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
      .tp-fb{min-height:28px;font-size:12px;text-align:center;z-index:1;padding:5px 14px;border-radius:9px;
        max-width:520px;transition:opacity .3s;}
      .fb-ok{background:rgba(74,222,128,.15);color:#4ade80;border:1px solid rgba(74,222,128,.3);}
      .fb-no{background:rgba(248,113,113,.15);color:#f87171;border:1px solid rgba(248,113,113,.3);}
      .fb-h{opacity:0;}
      .tp-win{position:absolute;inset:0;background:rgba(0,0,0,.9);border-radius:12px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
        z-index:100;animation:winIn .5s ease-out;}
      @keyframes winIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
      .win-big{font-size:68px;animation:winBounce .7s ease-out infinite alternate;}
      @keyframes winBounce{from{transform:translateY(0) scale(1)}to{transform:translateY(-16px) scale(1.1)}}
      .win-h1{font-size:26px;font-weight:900;color:#facc15;text-shadow:0 0 30px rgba(250,204,21,.7);}
      .win-p{color:#c4c9e8;font-size:13px;max-width:420px;text-align:center;line-height:1.6;}
      .win-stats{display:flex;gap:14px;}
      .win-stat{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:11px;padding:8px 18px;text-align:center;}
      .ws-v{font-size:22px;font-weight:900;color:#facc15;}
      .ws-l{font-size:10px;color:#8892b0;}
      .win-btn{padding:11px 28px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;
        border-radius:13px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;
        box-shadow:0 4px 20px rgba(124,58,237,.45);transition:all .2s;}
      .win-btn:hover{transform:translateY(-2px);}
      .conf{position:absolute;width:8px;height:8px;border-radius:2px;pointer-events:none;
        animation:confFall var(--d) var(--dl) ease-in forwards;}
      @keyframes confFall{0%{transform:translate(var(--sx),-10px) rotate(0);opacity:1}
        100%{transform:translate(var(--ex),420px) rotate(720deg);opacity:0}}
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

  function buildHTML() {
    return `
    <div class="tp-root" id="tp-root">
      <div class="tp-stars" id="tp-stars"></div>
      <div class="tp-hud">
        <div class="tp-title">🌉 The Magic Bridge Quest</div>
        <div class="tp-hearts" id="tp-hearts">❤️❤️❤️</div>
        <div class="tp-movebadge" id="tp-moves">Moves: 0</div>
      </div>
      <div class="tp-story" id="tp-story">
        🧙 <strong>Merlin</strong> and 🏹 <strong>Katniss</strong> stand at opposite ends of a magical bridge.
        The stones hold numbers in <em>sorted order</em>. Find two stones that
        <strong style="color:#facc15">add up to ${TARGET}</strong>!
      </div>
      <div class="tp-target-pill">🎯 Magic Number: <strong>${TARGET}</strong></div>
      <div class="tp-arena">
        <div class="tp-hero-track" id="tp-hero-track"></div>
        <div class="tp-stones" id="tp-stones"></div>
      </div>
      <div class="tp-sum s-big" id="tp-sum"></div>
      <div class="tp-question" id="tp-question"></div>
      <div class="tp-btns">
        <button class="tp-btn btn-ka" id="tp-btn-ka" aria-label="Move Katniss left – decrease the sum">🏹 Katniss Steps ← Left</button>
        <button class="tp-btn btn-me" id="tp-btn-me" aria-label="Move Merlin right – increase the sum">Merlin Steps Right → 🧙</button>
      </div>
      <div class="tp-fb fb-h" id="tp-fb"></div>
    </div>`;
  }

  function spawnStars(root) {
    const s = root.querySelector('#tp-stars');
    for (let i = 0; i < 30; i++) {
      const d = document.createElement('div');
      d.className = 'tp-star';
      const sz = 1 + Math.random() * 2;
      d.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${1.5+Math.random()*2}s;--dl:${Math.random()*2}s;`;
      s.appendChild(d);
    }
  }

  function spawnConfetti(root) {
    const colors = ['#facc15','#f472b6','#4ade80','#60a5fa','#a78bfa','#fb923c','#34d399'];
    for (let i = 0; i < 55; i++) {
      const p = document.createElement('div');
      p.className = 'conf';
      const x = Math.random() * 100;
      p.style.cssText = `--sx:${x}vw;--ex:${(Math.random()-.5)*180}px;--d:${1+Math.random()*.9}s;--dl:${Math.random()*.5}s;background:${colors[i%colors.length]};left:${x}%;top:0;`;
      root.appendChild(p);
      setTimeout(() => p.remove(), 2600);
    }
  }

  function init(container, opts) {
    const { updateStepIndicator, onComplete } = opts;
    injectStyles();
    container.innerHTML = buildHTML();
    const root = container.querySelector('#tp-root');
    // How to Play panel
    const hwBtn = document.createElement('button');
    hwBtn.className = 'hw-btn';
    hwBtn.setAttribute('aria-label', 'How to play');
    hwBtn.textContent = 'ℹ️';
    root.appendChild(hwBtn);
    const hwPanel = document.createElement('div');
    hwPanel.className = 'hw-panel';
    hwPanel.style.display = 'none';
    hwPanel.innerHTML = '<div class="hw-title">ℹ️ How to Play</div><div class="hw-body"><strong style="color:#93c5fd">Algorithm:</strong> Two Pointers use a left and right pointer on a sorted array to find pairs efficiently.<br><br><strong style="color:#93c5fd">Steps:</strong><ul><li>Merlin starts at the left; Katniss starts at the right.</li><li>If sum &gt; target: Katniss moves left (smaller). If sum &lt; target: Merlin moves right (larger).</li><li>Find the pair that sums to the magic number!</li></ul><div class="hw-insight">💡 Key insight: Sorted array + two pointers → O(n) instead of O(n²).</div></div>';
    root.appendChild(hwPanel);
    hwBtn.addEventListener('click', () => {
      hwPanel.style.display = hwPanel.style.display === 'none' ? 'block' : 'none';
    });
    spawnStars(root);

    let L = 0, R = ARRAY.length - 1;
    let hearts = 3, moves = 0, animating = false;
    let startTime = Date.now();

    const heroTrack = container.querySelector('#tp-hero-track');
    const stonesEl  = container.querySelector('#tp-stones');
    const sumEl     = container.querySelector('#tp-sum');
    const qEl       = container.querySelector('#tp-question');
    const fbEl      = container.querySelector('#tp-fb');
    const heartsEl  = container.querySelector('#tp-hearts');
    const movesEl   = container.querySelector('#tp-moves');
    const btnKa     = container.querySelector('#tp-btn-ka');
    const btnMe     = container.querySelector('#tp-btn-me');

    btnKa.addEventListener('click', () => handleMove('ka'));
    btnMe.addEventListener('click', () => handleMove('me'));

    render(); updateStepIndicator(1, 5);

    function getSum() { return ARRAY[L] + ARRAY[R]; }

    function correctBtn() {
      const s = getSum();
      if (s > TARGET) return 'ka';   // right pointer left = smaller number
      if (s < TARGET) return 'me';   // left pointer right = larger number
      return null;
    }

    function handleMove(btn) {
      if (animating) return;
      const correct = correctBtn();
      if (!correct) return;

      animating = true;
      if (btn === correct) {
        // ✅ Correct
        const movingBtn = btn === 'ka' ? btnKa : btnMe;
        movingBtn.classList.add('cf');
        setTimeout(() => movingBtn.classList.remove('cf'), 420);

        const s = getSum();
        showFb(btn === 'ka'
          ? `✅ Correct! Sum ${s} > ${TARGET} → Katniss moves left to a smaller stone!`
          : `✅ Correct! Sum ${s} < ${TARGET} → Merlin moves right to a larger stone!`, 'ok');

        // Bounce the moving hero
        const heroFig = btn === 'ka'
          ? container.querySelector('#hero-r .tp-hero-fig')
          : container.querySelector('#hero-l .tp-hero-fig');
        if (heroFig) { heroFig.classList.add('bounce'); setTimeout(() => heroFig.classList.remove('bounce'), 420); }

        if (btn === 'ka') R--; else L++;
        moves++;
        movesEl.textContent = `Moves: ${moves}`;

        setTimeout(() => {
          animating = false;
          render();
          if (getSum() === TARGET) {
            setTimeout(celebrate, 600);
          }
        }, 460);
      } else {
        // ❌ Wrong
        hearts = Math.max(0, hearts - 1);
        heartsEl.textContent = '❤️'.repeat(hearts) + '🖤'.repeat(3 - hearts);
        const wrongBtn = btn === 'ka' ? btnKa : btnMe;
        wrongBtn.classList.add('wf');
        setTimeout(() => wrongBtn.classList.remove('wf'), 360);
        const s = getSum();
        showFb(s > TARGET
          ? `❌ That makes sum even bigger! Sum is ${s} > ${TARGET}. Move to a smaller stone — Katniss goes left!`
          : `❌ That makes sum even smaller! Sum is ${s} < ${TARGET}. Move to a larger stone — Merlin goes right!`, 'no');
        animating = false;

        // Shake the hero that shouldn't move
        const shakeFig = btn === 'ka'
          ? container.querySelector('#hero-l .tp-hero-fig')
          : container.querySelector('#hero-r .tp-hero-fig');
        if (shakeFig) { shakeFig.classList.add('shake'); setTimeout(() => shakeFig.classList.remove('shake'), 360); }
      }
    }

    function render() {
      // stones
      stonesEl.innerHTML = '';
      ARRAY.forEach((val, i) => {
        const d = document.createElement('div');
        d.className = 'tp-stone' +
          (i === L && i === R ? ' sm' : i === L ? ' sl' : i === R ? ' sr' : i < L || i > R ? ' sp' : '');
        d.innerHTML = `${val}<span class="si">[${i}]</span>`;
        stonesEl.appendChild(d);
      });
      // heroes
      heroTrack.innerHTML = '';
      ARRAY.forEach((_, i) => {
        const slot = document.createElement('div');
        slot.className = 'tp-hero-slot';
        if (i === L) slot.innerHTML = `<div class="hero-merlin" id="hero-l"><div class="tp-hero-fig">🧙</div><div class="tp-hero-name">Merlin</div></div>`;
        if (i === R && i !== L) slot.innerHTML = `<div class="hero-katniss" id="hero-r"><div class="tp-hero-fig">🏹</div><div class="tp-hero-name">Katniss</div></div>`;
        heroTrack.appendChild(slot);
      });
      // sum
      const s = getSum();
      sumEl.className = `tp-sum ${s > TARGET ? 's-big' : s < TARGET ? 's-small' : 's-match'}`;
      sumEl.textContent = `${ARRAY[L]} + ${ARRAY[R]} = ${s}  ${s > TARGET ? '🔴 Too Big!' : s < TARGET ? '🔵 Too Small!' : '✨ Magic Match!'}`;
      // question
      if (s === TARGET) {
        qEl.innerHTML = `🌟 <strong style="color:#facc15">You found it!</strong> ${ARRAY[L]} + ${ARRAY[R]} = ${TARGET}!`;
        btnKa.disabled = btnMe.disabled = true;
      } else if (s > TARGET) {
        qEl.innerHTML = `💡 Sum is <strong style="color:#f87171">too big (${s} > ${TARGET})</strong>. Which hero moves to reduce it?`;
      } else {
        qEl.innerHTML = `💡 Sum is <strong style="color:#60a5fa">too small (${s} < ${TARGET})</strong>. Which hero moves to increase it?`;
      }
      updateStepIndicator(Math.min(moves + 1, 5), 5);
    }

    function showFb(msg, type) {
      fbEl.className = `tp-fb fb-${type}`;
      fbEl.innerHTML = msg;
      clearTimeout(fbEl._t);
      fbEl._t = setTimeout(() => { fbEl.className = 'tp-fb fb-h'; }, 2800);
    }

    function celebrate() {
      const elapsed = Date.now() - startTime;
      const stars = hearts === 3 ? 3 : hearts >= 2 ? 3 : 2;
      spawnConfetti(root);
      const ov = document.createElement('div');
      ov.className = 'tp-win';
      ov.innerHTML = `
        <div class="win-big">🎉</div>
        <div class="win-h1">Magic Pair Found!</div>
        <div class="win-p">
          <strong style="color:#facc15">${ARRAY[L]} + ${ARRAY[R]} = ${TARGET}</strong><br>
          Two Pointers scanned <em>inward from both ends</em> — found in just ${moves} moves!<br>
          <small style="color:#8892b0">Key insight: sorted array + pair sum → Two Pointers ✨</small>
        </div>
        <div class="win-stats">
          <div class="win-stat"><div class="ws-v">${moves}</div><div class="ws-l">Moves</div></div>
          <div class="win-stat"><div class="ws-v">${'⭐'.repeat(stars)}</div><div class="ws-l">Stars Earned</div></div>
          <div class="win-stat"><div class="ws-v">O(n)</div><div class="ws-l">Complexity</div></div>
        </div>
        <button class="win-btn" id="tp-replay">🔄 Try Again</button>`;
      root.appendChild(ov);
      ov.querySelector('#tp-replay').addEventListener('click', () => {
        ov.remove(); L = 0; R = ARRAY.length - 1; hearts = 3; moves = 0;
        startTime = Date.now();
        btnKa.disabled = btnMe.disabled = false;
        heartsEl.textContent = '❤️❤️❤️'; movesEl.textContent = 'Moves: 0';
        fbEl.className = 'tp-fb fb-h'; render();
      });
      onComplete && onComplete(stars, elapsed);
    }

    app.registerSim('two-pointers', {
      init,
      nextStep: () => { const c = correctBtn(); if (c) handleMove(c); },
      prevStep: () => {
        container.querySelectorAll('.tp-win').forEach(e => e.remove());
        L = 0; R = ARRAY.length - 1; hearts = 3; moves = 0; startTime = Date.now();
        btnKa.disabled = btnMe.disabled = false;
        heartsEl.textContent = '❤️❤️❤️'; movesEl.textContent = 'Moves: 0';
        fbEl.className = 'tp-fb fb-h'; render();
      },
      setMode: () => {}
    });
  }
})();