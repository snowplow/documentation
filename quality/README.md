# Site quality checks

Tooling for the docs redesign: CSS linting, accessibility checks, and visual regression screenshots. The browser checks run against a production build, so run `yarn build` first. Playwright starts `yarn serve` on port 3000 unless you set `BASE_URL`.

| Command | What it does |
| --- | --- |
| `yarn lint:css` | Stylelint over `src/**/*.css`: an `!important` budget of 10 per file, and bans on `[class*=…]`, CSS module hash (`.foo_a1B2`) and `.css-…` selectors |
| `yarn qa:a11y` | axe (WCAG 2.2 AA tags) on every URL in `urls.mjs`, in light and dark themes at 1440px and 390px. Fails on `critical` and `serious` issues; set `A11Y_FAIL_ON` to change that |
| `yarn qa:a11y:summary` | Aggregates the per-page JSON reports in `quality/a11y-report/` |
| `yarn qa:visual:capture` | Writes screenshots of every URL and variant to `VR_DIR` (default `quality/.baselines/`) |
| `yarn qa:visual` | Compares the current build against the screenshots in `VR_DIR` and writes diffs to `quality/test-results/` |

To compare two versions of the site, capture baselines from the first build, then rebuild and compare:

```bash
yarn build && VR_DIR=/tmp/baselines/before yarn qa:visual:capture
# make changes
yarn build && VR_DIR=/tmp/baselines/before yarn qa:visual
npx playwright show-report quality/playwright-report
```

Third-party requests (consent banner, chat, analytics) are blocked during the checks so results are stable. None of these checks are part of `yarn build`. The `Site quality checks` GitHub workflow runs them on pull requests without blocking merges.
