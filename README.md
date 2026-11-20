# Horrible Industries
## CEO of a Terrible Company

A playable, offline-first, satirical business strategy game. You're a CEO selling consumer products that nobody requested. Survive twelve quarters without running out of cash or losing the confidence of the public and your board.

### Instant play on a computer (no setup)

**Open `play.html` directly in a current desktop browser.** It is self-contained: its HTML, CSS, JavaScript, and original office illustration are embedded in one file. No dependencies, account, internet, database, API key, terminal, or build process is required.

On restrictive browsers, `file://` pages might block persistent localStorage. In that case, exporting your JSON save before closing preserves your progress. For more reliable browser storage, serve the complete folder from a local web server instead.

### Install or play on iPhone and Android

The complete `index.html` edition is designed for phones, but **phone web browsers generally need a URL rather than a downloaded HTML file opened in Files/Quick Look**. There are two straightforward routes:

1. **Host the contents of this ZIP on an HTTPS static host**, e.g., GitHub Pages, Netlify, or Cloudflare Pages. The host must serve `index.html` and maintain the folder structure. No server-side application is required.
2. Open the HTTPS URL in Safari on iPhone (or Chrome on Android). Use Safari's **Share > Add to Home Screen** for an app-like installation. On Android, use **Add to Home screen** or **Install app** when offered. The service worker caches the game's resources on supported secure origins for later offline play after the first successful visit.

Do not use `play.html` for a PWA installation. That file is deliberately dependency-free for desktop double-click play. Use the full project and `index.html` for hosting and mobile.

### Run from source on your PC

```bash
cd terrible-company
python3 -m http.server 8080
```

Go to `http://localhost:8080`. `index.html` uses native ECMAScript modules and does not need npm, Vite, React, or a bundler. The `package.json` exists solely for developer conveniences and tests. No `npm install` step is needed.

### Gameplay

You begin with:

- **$180,000 cash**, **$40,000 debt**, **$120,000 factory book value**
- **4,200 units per quarter** of initial manufacturing capacity
- A dubious flagship product, the *Bluetooth Fork*
- Three competing businesses: ProperGoods, HypeSphere, and Bargain Planet
- Three customer segments with different preferences
- Twelve fiscal quarters to prove the company can survive

Each quarter, choose your retail price ($29–$119), marketing ($0/$8k/$18k/$32k), R&D ($0/$10k/$22k/$38k), people policy, optional $48k factory expansion, and borrowing/repayment. Visit the product laboratory to launch an alternative product for a $31k expense. Press **FILE QUARTERLY RESULTS** to advance one quarter. A randomized corporate event impacts demand, costs, and sentiment, while rival companies adapt their strategies.

Lose if cash falls below zero or public trust/reputation falls below 8. Survive 12 quarters to win.

Your browser auto-saves successful game states using localStorage where available. The Boardroom supports JSON save export/import. The Financial Ledger exports a CSV of your quarter-by-quarter financial records.

### Economic model (simulated, not empirically calibrated)

**Demand.** There are three markets with preferences for affordability, quality, novelty, and practicality. For each segment, a logit/softmax-like choice function distributes potential transactions among your company, three competitors, and a non-purchase option. The utility includes product scores, public trust, reputation, a small employee-morale quality modifier, and diminishing returns to advertising. Rival behavior includes stochastic strategic adjustments, with pricing and ad responses to your last quarter. Demand has a mild deterministic quarterly cycle and is modified by a randomly selected event. Units sold are capped by production capacity.

**Finance.** Revenue equals units sold times price. Cost of goods sold equals units sold times an adjusted unit manufacturing cost. Operating expenses include payroll, overhead, advertising, R&D, staff policies, launch costs, incident costs, and depreciation. Interest is charged on the outstanding debt at a simplified 9% annual rate divided by four. Income tax is 22% of positive pretax profit, with no loss carryforward. Equipment depreciation is a **2.5% quarterly declining-balance approximation**. Factory expansion increases equipment assets and capacity; it is capital spending rather than an operating expense. Borrowed funds raise both debt and cash; repayments lower both. Corporate equity satisfies `cash + net equipment − debt`, and its quarterly change equals net income.

**Not implemented:** accounts receivable/payable, inventory, debt covenants, tax-loss carryforwards, multiple concurrent product lines, asset disposals, quarterly dividend payouts, inflation, true company valuation, dynamic labor headcount, or a calibrated real-world choice model. These omissions are intentional in a compact first edition. The game makes **no claim** that its invented consumer behavior reflects actual purchase data.

### Layout

```text
terrible-company/
  index.html             Native-module web/PWA entry point
  play.html              Standalone self-contained desktop game
  styles.css             Responsive design system
  manifest.webmanifest   Installation metadata
  sw.js                  Service worker cache for hosted edition
  assets/
    icon.svg              Original stylized icon
    office.svg            Original vector office illustration
  src/
    data.js               Products, competitors, segments, events
    engine.js             Pure economic simulation & validation
    storage.js            JSON save/import & CSV helper
    app.js                Game screens and interactive UI
  tests/
    engine.test.mjs       Accounting, behavior, progression tests
    browser-smoke.py      Desktop & phone browser interaction smoke tests
  tools/
    build_singlefile.py   Rebuild standalone play.html
  package.json            Node test and build scripts
```

### Developer testing

Node.js 20+ and Python 3.10+ recommended for development:

```bash
node --test tests/engine.test.mjs
python3 tools/build_singlefile.py
```

For the browser smoke test, install Python Playwright and a compatible Chromium binary. In this environment the script renders HTML directly in an in-memory browser document and tests navigation, product switching, quarterly progression, modal reports, and finance/board tabs at 1440px and 390px viewports:

```bash
python3 tests/browser-smoke.py
```

Test limitations: A headless browser with simulated iPhone dimensions is **not a physical iPhone**. Static page screenshot checks do not replace on-device Safari, installability, or accessibility testing. The app is not hosted and it is not an App Store native binary.

### Local data and privacy

This game does not send game data over a network, does not include analytics, and has no authentication or third-party scripts. Hosted editions fetch static game assets from the host. On supported browsers, progress is stored in the origin's localStorage. JSON saves remain in your device/browser unless you manually share them.

### Credits

Original code, scenarios, product jokes, visual design, and vector art created for this game. © 2026 Horrible Industries (fictional). Third-party runtime dependencies: none.

## Continuous deployment
GitHub Pages: https://jviola1019.github.io/horrible_ceo/ (only after the repository's Pages source is set to GitHub Actions and workflow succeeds). A push to main triggers unit tests, a 2,500-game stress audit, clean builds, desktop/mobile Playwright tests against HTTP-served modules, and publication of **only** the dist/ directory. On any failed test, deployment stops. No Jekyll, Next.js or Vite runtime is required.

See docs/MODEL_VALIDATION.md for equations and explicit limitations and docs/DESIGN.md for the visual system.
