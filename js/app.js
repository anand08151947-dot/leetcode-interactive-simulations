/* =============================================
   AlgoAdventures — Main App Router & Sidebar
   ============================================= */

const app = (() => {
  let patterns = [];
  let combos = [];
  let currentSim = null;
  let currentMode = 'guided';
  let currentStep = 0;
  let bridgeCollapsed = false;
  let filterMode = 'single';
  let filterDiff = 'all';
  let searchQuery = '';

  // Simulation registry — populated by each sim file
  const simRegistry = {};

  function registerSim(id, simModule) {
    simRegistry[id] = simModule;
  }

  async function init() {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('data/patterns.json'),
        fetch('data/combos.json')
      ]);
      patterns = (await pRes.json()).patterns;
      combos = (await cRes.json()).combos;
    } catch(e) {
      // Fallback: load from window globals if fetch fails (file:// protocol)
      patterns = window.PATTERNS_DATA || [];
      combos = window.COMBOS_DATA || [];
    }

    setupEventListeners();
    renderSidebar();
    Gamification.updateUI();
    checkHashRoute();
    window.addEventListener('hashchange', checkHashRoute);
  }

  function checkHashRoute() {
    const hash = location.hash.replace('#', '');
    if (hash && (patterns.find(p => p.id === hash) || combos.find(c => c.id === hash))) {
      loadSimulation(hash);
    }
  }

  function setupEventListeners() {
    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const body = document.body;
      const isLight = body.getAttribute('data-theme') === 'light';
      body.setAttribute('data-theme', isLight ? 'dark' : 'light');
      document.getElementById('theme-toggle').textContent = isLight ? '🌙' : '☀️';
    });

    // Trophy button
    document.getElementById('trophy-btn').addEventListener('click', () => {
      Gamification.renderBadgeGrid();
      document.getElementById('trophy-modal').style.display = 'flex';
    });

    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterMode = btn.dataset.mode;
        renderSidebar();
      });
    });

    // Difficulty filter
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterDiff = btn.dataset.diff;
        renderSidebar();
      });
    });

    // Search
    document.getElementById('search-input').addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase();
      renderSidebar();
    });

    // Close modal on backdrop click
    document.getElementById('trophy-modal').addEventListener('click', e => {
      if (e.target === document.getElementById('trophy-modal')) {
        document.getElementById('trophy-modal').style.display = 'none';
      }
    });
  }

  function renderSidebar() {
    const list = document.getElementById('pattern-list');
    const completedIds = Gamification.getState().completed;
    const items = filterMode === 'single' ? patterns : combos;

    const filtered = items.filter(item => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery) &&
          !(item.storyTheme || '').toLowerCase().includes(searchQuery)) return false;

      if (filterDiff !== 'all') {
        const diffs = item.difficulty || item.leetcodeProblems.map(p => p.difficulty);
        if (!diffs.includes(filterDiff)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">No patterns match your filter</div>';
      return;
    }

    list.innerHTML = filtered.map(item => {
      const isCombo = item.type !== 'single' && filterMode === 'combo';
      const isCompleted = completedIds.includes(item.id);
      const stars = Gamification.getStars(item.id);
      const starStr = stars > 0 ? '⭐'.repeat(stars) : '○○○';
      // Combos are always unlocked — no prerequisite gate for this educational portal
      const isLocked = false;

      const lcCount = item.leetcodeProblems ? item.leetcodeProblems.length : 0;

      // Show which prerequisites power this combo
      const prereqHint = isCombo && item.prerequisites
        ? item.prerequisites.map(p => p.replace(/-/g,' ')).join(' + ')
        : '';

      return `<div class="pattern-item ${isCompleted ? 'completed' : ''} fade-in"
                   data-id="${item.id}"
                   title="${item.storyTheme}">
        <div class="pattern-emoji">${item.emoji}</div>
        <div class="pattern-info">
          <div class="pattern-name">${item.name}</div>
          <div class="pattern-subtitle">${item.storyTheme}</div>
          ${prereqHint ? `<div style="font-size:9px;color:#6b7280;margin-top:2px">Combines: ${prereqHint}</div>` : ''}
        </div>
        <div class="pattern-meta">
          <div class="pattern-stars">${starStr}</div>
          <div class="pattern-count">${lcCount} problems</div>
          ${isCombo ? '<div class="combo-badge">COMBO</div>' : ''}
        </div>
      </div>`;
    }).join('');

    // Attach click events (all items now clickable)
    list.querySelectorAll('.pattern-item').forEach(el => {
      el.addEventListener('click', () => {
        list.querySelectorAll('.pattern-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
        loadSimulation(el.dataset.id);
      });
    });
  }

  function loadSimulation(id) {
    const pattern = patterns.find(p => p.id === id) || combos.find(c => c.id === id);
    if (!pattern) return;

    currentSim = pattern;
    currentMode = 'guided';
    currentStep = 0;
    location.hash = id;

    // Show sim screen
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('simulation-screen').classList.add('active');

    // Fill header
    document.getElementById('sim-emoji').textContent = pattern.emoji;
    document.getElementById('sim-title').textContent = pattern.name;

    // Tags
    const tagsEl = document.getElementById('sim-tags');
    const tags = (pattern.tags || []).map(t => `<span class="tag tag-pattern">${t}</span>`).join('');
    const diffs = (pattern.difficulty || [...new Set(pattern.leetcodeProblems.map(p => p.difficulty))]);
    const diffTags = [...new Set(diffs)].map(d => `<span class="tag tag-${d.toLowerCase()}">${d}</span>`).join('');
    tagsEl.innerHTML = tags + diffTags;

    // Story
    document.getElementById('story-text').textContent = pattern.storyHook;

    // Recognition cue
    document.getElementById('cue-text').textContent = pattern.recognitionCue;

    // LeetCode problems
    renderLCProblems(pattern.leetcodeProblems);

    // Update guided/challenge buttons
    document.getElementById('guided-btn').classList.add('active');
    document.getElementById('challenge-btn').classList.remove('active');
    document.getElementById('challenge-area').style.display = 'none';
    document.getElementById('step-controls').style.display = 'flex';

    // Run simulation
    const container = document.getElementById('sim-container');
    container.innerHTML = '';

    const sim = simRegistry[id];
    if (sim) {
      try {
        sim.init(container, {
          mode: 'guided',
          pattern,
          onComplete: (stars, timeMs) => {
            Gamification.awardStars(id, stars, timeMs);
            renderSidebar();
            showCompletionBanner(stars, pattern);
            // Auto-unlock combos
            combos.forEach(c => {
              if (c.prerequisites && c.prerequisites.every(p => Gamification.getState().completed.includes(p))) {
                Gamification.unlockCombo(c.id);
              }
            });
          },
          onRetry: () => Gamification.recordRetry(id),
          updateStepIndicator: (cur, total) => {
            document.getElementById('step-indicator').textContent = `Step ${cur} / ${total}`;
            document.getElementById('prev-step').disabled = cur <= 1;
            document.getElementById('next-step').disabled = cur >= total;
          }
        });
      } catch(err) {
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:16px;padding:40px;text-align:center">
          <div style="font-size:48px">${pattern.emoji}</div>
          <div style="font-size:18px;font-weight:800">${pattern.name}</div>
          <div style="color:var(--text-secondary);font-size:14px;max-width:400px">${pattern.storyHook}</div>
          <div style="color:var(--text-muted);font-size:12px">Simulation loading... [${err.message}]</div>
        </div>`;
      }
    } else {
      renderPlaceholderSim(container, pattern);
    }
  }

  function renderPlaceholderSim(container, pattern) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:20px;padding:40px;text-align:center">
        <div style="font-size:72px;animation:float 3s ease-in-out infinite">${pattern.emoji}</div>
        <div style="font-size:22px;font-weight:900">${pattern.name}</div>
        <div style="font-size:14px;color:var(--text-secondary);max-width:500px;line-height:1.7">${pattern.storyHook}</div>
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:12px;padding:16px 24px;max-width:480px">
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--accent-blue);margin-bottom:8px">🎯 Recognition Cue</div>
          <div style="font-size:13px;line-height:1.6">${pattern.recognitionCue}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          ${(pattern.leetcodeProblems || []).slice(0,3).map(p => `
            <a href="${p.url}" target="_blank" style="padding:6px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;font-size:12px;text-decoration:none;color:var(--text-primary)">
              #${p.id} ${p.title} <span class="lc-diff ${p.difficulty}" style="margin-left:6px">${p.difficulty}</span>
            </a>`).join('')}
        </div>
      </div>`;
  }

  function renderLCProblems(problems) {
    const container = document.getElementById('lc-problems');
    if (!problems || !problems.length) { container.innerHTML = ''; return; }

    const byDiff = { Easy: [], Medium: [], Hard: [] };
    problems.forEach(p => (byDiff[p.difficulty] || byDiff.Medium).push(p));

    let html = '';
    ['Easy', 'Medium', 'Hard'].forEach(d => {
      if (byDiff[d].length === 0) return;
      html += `<div class="lc-section-header">${d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} ${d} (${byDiff[d].length})</div>`;
      html += byDiff[d].map(p => `
        <div class="lc-problem-item">
          <span class="lc-num">#${p.id}</span>
          <a class="lc-title" href="${p.url}" target="_blank" title="${p.title}">${p.title}</a>
          <span class="lc-diff ${p.difficulty}">${p.difficulty}</span>
        </div>`).join('');
    });
    container.innerHTML = html;
  }

  function showCompletionBanner(stars, pattern) {
    const container = document.getElementById('sim-container');
    const starStr = '⭐'.repeat(stars) + '○'.repeat(3 - stars);
    const banner = document.createElement('div');
    banner.className = 'completion-banner';
    banner.innerHTML = `
      <div class="completion-content">
        <div class="completion-emoji">${pattern.emoji}</div>
        <div class="completion-title">Mission Complete!</div>
        <div class="completion-subtitle">${pattern.name} mastered!</div>
        <div class="completion-stars">${starStr}</div>
        <button class="completion-btn" onclick="this.closest('.completion-banner').remove()">
          Continue Adventure 🚀
        </button>
      </div>`;
    container.appendChild(banner);
    showToast(`🎉 +${stars} star${stars !== 1 ? 's' : ''}! Pattern mastered!`, 'success');
  }

  function setMode(mode) {
    currentMode = mode;
    document.getElementById('guided-btn').classList.toggle('active', mode === 'guided');
    document.getElementById('challenge-btn').classList.toggle('active', mode === 'challenge');
    document.getElementById('step-controls').style.display = mode === 'guided' ? 'flex' : 'none';
    document.getElementById('challenge-area').style.display = mode === 'challenge' ? 'block' : 'none';

    if (mode === 'challenge' && currentSim) {
      const problems = (currentSim.leetcodeProblems || []).slice(0, 5);
      const prompt = document.getElementById('challenge-prompt');
      const feedback = document.getElementById('challenge-feedback');
      prompt.innerHTML = `
        <div style="font-size:13px;font-weight:800;color:#a78bfa;margin-bottom:8px;">⚔️ Challenge Mode — Apply the Pattern!</div>
        <div style="font-size:12px;color:#c4c9e8;margin-bottom:10px;">You've explored the simulation. Now try these LeetCode problems using the <strong>${currentSim.name}</strong> pattern:</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${problems.map(p => `
            <a href="${p.url}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:9px;text-decoration:none;transition:background .2s;" onmouseover="this.style.background='rgba(255,255,255,.08)'" onmouseout="this.style.background='rgba(255,255,255,.04)'">
              <span style="font-size:11px;color:#6b7280;min-width:36px">#${p.id}</span>
              <span style="font-size:12px;font-weight:700;color:#e2e8f0;flex:1">${p.title}</span>
              <span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:5px;background:${p.difficulty==='Easy'?'rgba(74,222,128,.15)':p.difficulty==='Medium'?'rgba(251,191,36,.15)':'rgba(248,113,113,.15)'};color:${p.difficulty==='Easy'?'#4ade80':p.difficulty==='Medium'?'#fbbf24':'#f87171'}">${p.difficulty}</span>
              <span style="font-size:11px;color:#60a5fa">↗</span>
            </a>`).join('')}
        </div>
        <div style="margin-top:10px;padding:8px 12px;background:rgba(167,139,250,.07);border:1px solid rgba(167,139,250,.15);border-radius:9px;font-size:11.5px;color:#c4c9e8;">
          <strong style="color:#a78bfa">🎯 Recognition Cue:</strong> ${currentSim.recognitionCue || ''}
        </div>`;
      feedback.innerHTML = '';
    }

    const sim = simRegistry[currentSim?.id];
    if (sim && sim.setMode) sim.setMode(mode);
  }

  function nextStep() {
    const sim = simRegistry[currentSim?.id];
    if (sim && sim.nextStep) sim.nextStep();
  }

  function prevStep() {
    const sim = simRegistry[currentSim?.id];
    if (sim && sim.prevStep) sim.prevStep();
  }

  function resetSim() {
    if (currentSim) loadSimulation(currentSim.id);
  }

  function toggleBridge() {
    bridgeCollapsed = !bridgeCollapsed;
    const content = document.getElementById('lc-bridge-content');
    const btn = document.getElementById('bridge-toggle');
    content.style.display = bridgeCollapsed ? 'none' : 'flex';
    btn.textContent = bridgeCollapsed ? '▶' : '▼';
  }

  return { init, registerSim, loadSimulation, setMode, nextStep, prevStep, resetSim, toggleBridge };
})();

document.addEventListener('DOMContentLoaded', () => app.init());
