---
title: "Check and publish the tracking with GitHub Actions"
sidebar_label: "Check and publish with GitHub Actions"
position: 3
description: "Add GitHub Actions workflows that check every pull request with Snowtype and Snowplow CLI, and publish data structures and the tracking plan to Console on every merge."
keywords: ["github actions snowplow cli", "snowtype check ci", "tracking plan ci cd"]
date: "2026-11-13"
---

In this part of the tutorial, you'll add two GitHub Actions workflows to the repository. The first checks every pull request into `develop` or `main`. The second publishes the data structures and the tracking plan to your Snowplow organization every time a pull request merges into either branch.

Both workflows install Snowplow CLI with the [setup-snowplow-cli](https://github.com/snowplow/setup-snowplow-cli) action, which downloads the most recent Snowplow CLI release. Add them on the same feature branch as the tracking definitions.

<Steps>

### Store an API key in the repository secrets

The checks against Console and the publishing need credentials. In Console, [create an API key](/docs/account-management/#create-an-api-key) with the permissions the workflows need: publishing data structures to production, and creating and editing tracking plans. See [what each permission means](/docs/account-management/managing-permissions/#what-does-each-permission-mean). Then add three [repository secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) in GitHub:

* `SNOWPLOW_CONSOLE_ORG_ID`: your organization ID, from the **Manage organization** page in Console
* `SNOWPLOW_CONSOLE_API_KEY_ID`: the API key ID
* `SNOWPLOW_CONSOLE_API_KEY`: the API key

Snowplow CLI reads these variables from the environment, so the workflows pass them to every step.

### Add the pull request workflow

The pull request workflow runs two kinds of checks. The checks that need no credentials compare the repository with itself: `snowtype check` confirms the committed tracking code matches the definitions, and `dp validate offline` checks the event specification versions against the point where the branch started. The checks against Console use the API key: `ds validate` checks the data structures, and `dp validate` checks the tracking plan and its versions against what Console holds.

```yaml title=".github/workflows/check-pull-request.yml"
on:
  pull_request:
    branches: [develop, main]

jobs:
  check:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: snowplow/setup-snowplow-cli@v1

      - run: npm ci

      - run: npx snowtype check

      - if: github.base_ref == 'develop'
        run: snowplow-cli dp validate offline --base-ref origin/develop --gh-annotate

      - run: snowplow-cli ds validate --gh-annotate

      - run: snowplow-cli dp validate --gh-annotate
```

The `fetch-depth: 0` option fetches the full history. The offline check needs it to find the commit where the branch started. Without it, `actions/checkout` creates a shallow clone that has neither `origin/develop` nor the history, and the check fails:

```text
12:23PM ERRO could not find where the branch started from origin/develop: fetch the full history (for example actions/checkout with fetch-depth: 0) and make sure origin/develop is fetched: git merge-base HEAD origin/develop failed: exit status 128: fatal: Not a valid object name origin/develop
```

To fix `could not find where the branch started from origin/develop`, set `fetch-depth: 0` on `actions/checkout`, as in the workflow.

The offline check runs only on pull requests into `develop`. The pull request that promotes `develop` to `main` is checked against Console instead, for the reason given in [Promote develop to main](/tutorials/data-structures-in-git/change-and-promote#promote-develop-to-main).

The `--gh-annotate` flag prints the errors as [GitHub workflow commands](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions), so they appear as annotations on the changed files in the pull request.

### Add the publish workflow

The publish workflow runs on every push to `develop` and `main`, which is what a merged pull request produces. Both branches publish to the same organization, because the tracking plan belongs to the organization:

```yaml title=".github/workflows/publish.yml"
on:
  push:
    branches: [develop, main]

jobs:
  publish:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - uses: snowplow/setup-snowplow-cli@v1

      - run: snowplow-cli ds publish dev --managed-from $GITHUB_REPOSITORY

      - run: snowplow-cli ds publish prod --managed-from $GITHUB_REPOSITORY

      - run: snowplow-cli dp sync

      - run: snowplow-cli dp release
```

The order of the steps matters:

1. `ds publish dev` publishes the data structures to the organization's development registry. A data structure must reach development before it can reach production.
2. `ds publish prod` publishes them to the production registry. Console locks data structures published with Snowplow CLI against editing in the UI, and shows the `--managed-from` value, your repository, in the lock banner.
3. `dp sync` writes the source application, the tracking plan, and the event specifications to Console. A structural change creates a new event specification version in draft.
4. `dp release` publishes the draft event specifications.

`dp release` refuses to publish an event specification whose data structures aren't in production yet. That's why the workflow publishes the data structures to production before it releases. When an event specification references a data structure version that isn't in production, the release fails:

```text
12:27PM INFO validation success data products found=1 source applications found=1
12:27PM INFO sync no changes detected, nothing to apply
12:27PM INFO release will release event spec name="docs-capture signup" resource name=947020bc-775c-473d-94cb-adf65501a001
12:27PM ERRO Cannot publish event specs: the following data structures are not deployed to production: iglu:com.example.docs-capture/docs_capture_plan/jsonschema/1-0-1
Use `snowplow-cli ds publish prod` to resolve
```

The failed release leaves the new event specification version in Console as a draft, matching your files, so `dp validate` still passes, and every retry of `dp release` fails the same way. To fix `Cannot publish event specs: the following data structures are not deployed to production`, run `snowplow-cli ds publish prod`, then run `dp release` again.

### Open the first pull request

Commit the two workflows, push the branch, and open a pull request into `develop`:

```bash
git add .github/workflows
git commit -m "Check and publish the tracking from GitHub Actions"
git push -u origin feature/signup-tracking
```

The pull request workflow runs every check, and the pull request shows them as passed. When the checks pass and the pull request is reviewed, merge it. The publish workflow then publishes the two data structures and releases the `docs-capture signup` event specification. In Console, the data structures show that they're managed from your repository, and the tracking plan shows the `docs-capture signup` event specification moving through **Publishing** to **Published**.

</Steps>
