/* =============================================
   AlgoAdventures — Gamification System
   ============================================= */

const Gamification = (() => {
  const STORAGE_KEY = 'algo_adventures_progress';

  const BADGES = [
    { id: 'first_step',      name: 'First Step',       emoji: '👶', desc: 'Complete your first simulation',         condition: s => s.completed.length >= 1 },
    { id: 'pattern_spotter', name: 'Pattern Spotter',  emoji: '🔍', desc: 'Complete 5 simulations',                condition: s => s.completed.length >= 5 },
    { id: 'algo_apprentice', name: 'Algo Apprentice',  emoji: '📚', desc: 'Complete 10 simulations',               condition: s => s.completed.length >= 10 },
    { id: 'algo_knight',     name: 'Algo Knight',      emoji: '⚔️', desc: 'Complete all 18 single patterns',      condition: s => s.completed.length >= 18 },
    { id: 'combo_starter',   name: 'Combo Starter',    emoji: '🔗', desc: 'Unlock your first combo pattern',       condition: s => s.comboUnlocked.length >= 1 },
    { id: 'combo_master',    name: 'Combo Master',     emoji: '🧩', desc: 'Unlock all 3 combo patterns',           condition: s => s.comboUnlocked.length >= 3 },
    { id: 'star_collector',  name: 'Star Collector',   emoji: '⭐', desc: 'Earn 10 stars total',                   condition: s => s.totalStars >= 10 },
    { id: 'star_hoarder',    name: 'Star Hoarder',     emoji: '🌟', desc: 'Earn 30 stars total',                   condition: s => s.totalStars >= 30 },
    { id: 'speed_solver',    name: 'Speed Solver',     emoji: '⚡', desc: 'Complete a challenge in under 30 sec',  condition: s => s.fastSolves >= 1 },
    { id: 'persistent',      name: 'Persistent',       emoji: '💪', desc: 'Retry a challenge 3+ times',            condition: s => s.maxRetries >= 3 },
    { id: 'fire_starter',    name: 'Fire Starter',     emoji: '🔥', desc: 'Complete the BFS simulation',           condition: s => s.completed.includes('bfs') },
    { id: 'cave_explorer',   name: 'Cave Explorer',    emoji: '🔦', desc: 'Complete the DFS simulation',           condition: s => s.completed.includes('dfs') },
    { id: 'pattern_all',     name: 'Pattern Master',   emoji: '🏆', desc: 'Complete every simulation including combos', condition: s => s.completed.length >= 21 }
  ];

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      completed: [],
      stars: {},
      comboUnlocked: [],
      totalStars: 0,
      fastSolves: 0,
      maxRetries: 0,
      earnedBadges: []
    };
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function getStars(patternId) {
    return state.stars[patternId] || 0;
  }

  function awardStars(patternId, stars, timeMs) {
    const prev = getStars(patternId);
    if (stars > prev) {
      state.totalStars += (stars - prev);
      state.stars[patternId] = stars;
    }
    if (!state.completed.includes(patternId)) {
      state.completed.push(patternId);
    }
    if (timeMs && timeMs < 30000) state.fastSolves++;
    saveState();
    checkBadges();
    updateUI();
    return stars;
  }

  function recordRetry(patternId) {
    const key = `retries_${patternId}`;
    state[key] = (state[key] || 0) + 1;
    if (state[key] > state.maxRetries) state.maxRetries = state[key];
    saveState();
    checkBadges();
  }

  function unlockCombo(comboId) {
    if (!state.comboUnlocked.includes(comboId)) {
      state.comboUnlocked.push(comboId);
      saveState();
      checkBadges();
      showToast(`🔓 Combo Unlocked: ${comboId.replace('-', ' + ').toUpperCase()}!`, 'success');
    }
  }

  function isComboUnlocked(combo, completedList) {
    return combo.prerequisites.every(p => completedList.includes(p));
  }

  function checkBadges() {
    let newBadge = false;
    BADGES.forEach(badge => {
      if (!state.earnedBadges.includes(badge.id) && badge.condition(state)) {
        state.earnedBadges.push(badge.id);
        newBadge = true;
        setTimeout(() => {
          showToast(`🏅 Badge Earned: ${badge.emoji} ${badge.name}!`, 'badge');
        }, 800);
      }
    });
    if (newBadge) saveState();
  }

  function updateUI() {
    const starCountEl = document.getElementById('star-count');
    if (starCountEl) starCountEl.textContent = state.totalStars;

    const total = 18;
    const done = state.completed.length;
    const pct = Math.round((done / total) * 100);

    const fillEl = document.getElementById('mini-bar-fill');
    if (fillEl) fillEl.style.width = pct + '%';
    const headerText = document.getElementById('header-progress-text');
    if (headerText) headerText.textContent = `${done} / ${total} patterns`;
    const sidebarFill = document.getElementById('sidebar-progress-fill');
    if (sidebarFill) sidebarFill.style.width = pct + '%';
    const sidebarText = document.getElementById('sidebar-progress-text');
    if (sidebarText) sidebarText.textContent = `${done} / ${total} completed`;
  }

  function renderBadgeGrid() {
    const grid = document.getElementById('badge-grid');
    if (!grid) return;
    grid.innerHTML = BADGES.map(b => {
      const earned = state.earnedBadges.includes(b.id);
      return `<div class="badge-item ${earned ? 'earned' : 'locked'}">
        <div class="badge-icon">${b.emoji}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
        ${earned ? '<div style="color:#facc15;font-size:10px;margin-top:4px">✅ Earned!</div>' : ''}
      </div>`;
    }).join('');
  }

  function isCompleted(patternId) { return state.completed.includes(patternId); }
  function getState() { return state; }
  function reset() {
    state = { completed: [], stars: {}, comboUnlocked: [], totalStars: 0, fastSolves: 0, maxRetries: 0, earnedBadges: [] };
    saveState();
    updateUI();
  }

  return { getStars, awardStars, recordRetry, unlockCombo, isComboUnlocked, isCompleted, getState, updateUI, renderBadgeGrid, reset };
})();

/* ---- Toast Utility ---- */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = type === 'success' ? 'rgba(74,222,128,0.15)' :
                            type === 'badge'   ? 'rgba(250,204,21,0.15)' :
                            type === 'error'   ? 'rgba(248,113,113,0.15)' :
                            'var(--bg-card)';
  toast.style.borderColor = type === 'success' ? '#4ade80' :
                             type === 'badge'   ? '#facc15' :
                             type === 'error'   ? '#f87171' :
                             'var(--border)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
