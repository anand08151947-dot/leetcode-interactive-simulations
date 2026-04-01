# 🧩 AlgoAdventures — The Algo Chronicles

> **LeetCode patterns taught through age-appropriate stories and D3.js interactive simulations.**
> Works for 5th graders AND experienced engineers — every simulation links directly to LeetCode problem numbers.

## 🚀 Live Demo

```bash
# Option 1: Python (no install)
python -m http.server 8765
# Then open http://localhost:8765

# Option 2: Node (no install needed if Node ≥ 14)
npx serve .
# Then open the URL shown

# Option 3: VS Code Live Server extension — just click "Go Live"
```

> **Note:** Open via HTTP server (not `file://`). An inline fallback is included for `file://` protocol but a local server gives best results.

---

## 🎮 What's Inside

### 18 Pattern Simulations + 3 Combos

| # | Pattern | Story | Recognition Cue |
|---|---------|-------|----------------|
| 1 | Two Pointers | Tug-of-War | "pair sum / sorted array" |
| 2 | Sliding Window | Pizza Route | "contiguous subarray" |
| 3 | Binary Search | Enchanted Library | "sorted search space" |
| 4 | Fast & Slow Pointers | Tortoise & Hare | "cycle detection" |
| 5 | Prefix Sum | Candy Register | "range sum queries" |
| 6 | Hash Map / Set | Treasure Chest | "frequency / two-sum" |
| 7 | DFS | Cave Explorer | "tree paths / islands" |
| 8 | BFS | Spreading Wildfire | "shortest path / levels" |
| 9 | Backtracking | Queen's Chessboard | "subsets / N-queens" |
| 10 | Dynamic Programming | Frog Lily Pads | "overlapping subproblems" |
| 11 | Greedy | Trading Cards | "intervals / local best" |
| 12 | Divide & Conquer | Mail Sorter | "merge sort / split" |
| 13 | Heap / Priority Queue | Hospital Triage | "top-K / extract-min" |
| 14 | Monotonic Stack | City Skyline | "next greater element" |
| 15 | Intervals / Merge | Playdate Scheduler | "meeting rooms" |
| 16 | Trie | Hogwarts Spellbook | "prefix / autocomplete" |
| 17 | Union-Find (DSU) | Village Roads | "connected components" |
| 18 | Graph Algorithms | City Treasure Map | "Dijkstra / weighted path" |
| 🔀 | BFS + Hash Map | Word Ladder | LeetCode #127 |
| 🔀 | Heap + Sorting | K Closest Points | LeetCode #973 |
| 🔀 | DFS + Backtracking | Path Sum II | LeetCode #113 |

### 230+ LeetCode Problems Mapped

Every pattern links to real LeetCode problems (Easy / Medium / Hard) via the **LeetCode Bridge** side panel — so adults and engineers can cross-reference while kids enjoy the story.

---

## 🗂️ Project Structure

```
leetcode-interactive-simulations/
├── index.html                  # SPA shell
├── styles/
│   ├── main.css                # Layout, sidebar, theme system
│   └── simulations.css         # D3 visualization styles
├── data/
│   ├── patterns.json           # 18 patterns with LC problems
│   └── combos.json             # 3 combo patterns
├── js/
│   ├── app.js                  # Router, sidebar, gamification hooks
│   ├── gamification.js         # Stars, badges, localStorage
│   └── simulations/
│       ├── two-pointers.js
│       ├── sliding-window.js
│       ├── binary-search.js
│       ├── fast-slow-pointers.js
│       ├── prefix-sum.js
│       ├── hashmap-set.js
│       ├── dfs.js
│       ├── bfs.js
│       ├── backtracking.js
│       ├── dynamic-programming.js
│       ├── greedy.js
│       ├── divide-conquer.js
│       ├── heap-priority-queue.js
│       ├── monotonic-stack.js
│       ├── intervals-merge.js
│       ├── trie.js
│       ├── union-find.js
│       ├── graph-algorithms.js
│       └── combos/
│           ├── bfs-hashmap.js       # Word Ladder (#127)
│           ├── heap-sorting.js      # K Closest Points (#973)
│           └── dfs-backtracking.js  # Path Sum II (#113)
└── assets/
    └── icons/
```

---

## 🎯 Features

- **Story-driven simulations** — each pattern told through a relatable narrative
- **Step-by-step guided mode** — narrated walkthrough with Prev/Next controls
- **D3.js visualizations** — animated trees, graphs, arrays, grids
- **Gamification** — ⭐ stars per completion, 🏆 badges, combo unlock mechanic
- **LeetCode Bridge** — collapsible right panel with all real LC problem links
- **Dual audience** — kids see the story; developers see the LC numbers
- **Dark/light theme** — toggle in the header
- **Progress persistence** — localStorage saves your stars across sessions
- **Sidebar filtering** — filter by difficulty (Easy/Medium/Hard) and search by name
- **Combo patterns** — unlock by completing both prerequisites

---

## 🛠️ Tech Stack

- **D3.js v7** — tree, graph, array, grid visualizations
- **ECharts 5** — supplementary charts
- **Vanilla JS** — no framework, pure ES6+
- **CSS custom properties** — full dark/light theme system
- **No build step** — just open and run

---

## 🚀 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "AlgoAdventures — LeetCode for 5th Graders"
git remote add origin https://github.com/YOUR_USER/leetcode-interactive-simulations.git
git push -u origin main
# Enable GitHub Pages → Settings → Pages → Branch: main, /root
```

---

## 🏗️ Extending

Add a new simulation by creating `js/simulations/your-pattern.js`:

```js
(() => {
  function init(container, opts) {
    const { updateStepIndicator, onComplete } = opts;
    // Your D3.js simulation here
    // Call onComplete(stars, timeMs) when done
    // Call updateStepIndicator(current, total) on each step
  }
  app.registerSim('your-pattern-id', { init });
})();
```

Then add a `<script>` tag in `index.html` and a pattern entry in `data/patterns.json`.

---

## 📚 The 16 Core LeetCode Patterns

> *"Training yourself to spot recognition cues is more valuable than memorizing any single solution."*

When you see **"contiguous subarray"** → Sliding Window  
When you see **"cycle in a linked list"** → Fast & Slow Pointers  
When you see **"shortest path in unweighted graph"** → BFS  
When you see **"top K elements"** → Heap  
When you see **"prefix of words"** → Trie  

---

*Built with ❤️ for curious minds of all ages.*
