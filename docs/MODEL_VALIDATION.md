# Economic specification and validation

## Scientific validity
**Synthetic game, not a real-world validated predictive model.** Coefficients, customer counts, scenario effects, rivals and employee dynamics are designed assumptions. The internally correct calculations cannot establish external validity; real demand estimation requires observations and holdout calibration.

## Mechanics
Three market segments choose among the player's product, three autonomous but simplified fictional rivals, or no purchase. Their utility weights include price, quality, practicality, novelty, trust, reputation and diminishing-return advertising. Softmax assigns probabilistic segment shares; simulated purchases are scaled by fictional traffic and bounded by capacity. Competitor strategies mutate via a deterministic seeded generator. Rivals are not given full corporate financial statements.

## Accounting identities
Revenue = unit price × units. Operating income = revenue − COGS − payroll − overhead − advertising − research − people policy − launch expense − incident expense − depreciation. Pretax = operating income − interest. Income tax is max(0, 22% × pretax) with rounding, no loss carryforward. Net income = pretax − tax. Operating cash = net income + depreciation. Closing cash = opening cash + operating cash − factory capex + loan financing. Ending equipment = beginning equipment + capex − depreciation. Ending debt = beginning debt + financing. Equity = cash + equipment − debt; change in equity equals net income.

## Reproducible verification
- `npm test`: unit and deployment preflight tests with 300 seeded playthroughs.
- `npm run audit`: five deliberately distinct strategies × 500 seeds; validates full quarter accounting in 2,500 games, reports outcomes.
- `npm run build`: recomposes offline desktop HTML and staged static Pages distribution.
- `npm run test:browser`: Playwright Chromium at 1440px and 390px viewports checks navigation, strategy execution, financial exports, state persistence and offline cache. CI requires actual HTTP-served modular build; local restrictive browser contexts can use the explicitly labeled standalone fallback.

## Known limitations
Single product, immediate factory capacity, simplified equipment depreciation and tax, no receivables/payables, inventory, credit covenants, equity financing, empirically calibrated price elasticities, full competitor accounts, cloud saves, multiplayer or native iOS binaries. Browser emulation is not a substitute for physical iPhone Safari testing.
