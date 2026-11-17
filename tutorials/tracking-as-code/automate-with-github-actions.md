---
title: "Check and publish the tracking with GitHub Actions"
sidebar_label: "Check and publish with GitHub Actions"
position: 3
description: "Add GitHub Actions workflows that check every pull request with Snowtype and Snowplow CLI, publish drafts to Console from develop, and release them from main."
keywords: ["github actions snowplow cli", "snowtype check ci", "tracking plan ci cd"]
date: "2026-11-13"
---

In this part of the tutorial, you'll add two GitHub Actions workflows to the repository. The first checks every pull request into `develop` or `main`. The second publishes the tracking to your Snowplow organization every time a pull request merges: from `develop` as drafts for testing, and from `main` as released versions for production.

You'll start with the checks that need no credentials. The checks against Console and the publishing need an API key, which you'll add at the point where the workflows first use it. Add the workflows on the same feature branch as the tracking definitions.

<Steps>

### Add the checks that need no credentials

The pull request workflow starts with two checks that compare the repository with itself: `snowtype check` confirms the committed tracking code matches the definitions, and `dp validate offline` checks the event specification versions against the point where the branch started. The workflow installs Snowplow CLI with the [setup-snowplow-cli](https://github.com/snowplow/setup-snowplow-cli) action, which downloads the most recent Snowplow CLI release.

```yaml title=".github/workflows/check-pull-request.yml"
on:
  pull_request:
    branches: [develop, main]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: snowplow/setup-snowplow-cli@v1

      - run: npm ci

      - run: npx snowtype check

      - if: github.base_ref == 'develop'
        run: snowplow-cli dp validate offline --base-ref origin/develop --gh-annotate
```

The `fetch-depth: 0` option fetches the full history. The offline check needs it to find the commit where the branch started. Without it, `actions/checkout` creates a shallow clone that has neither `origin/develop` nor the history, and the check fails:

```text
12:23PM ERRO could not find where the branch started from origin/develop: fetch the full history (for example actions/checkout with fetch-depth: 0) and make sure origin/develop is fetched: git merge-base HEAD origin/develop failed: exit status 128: fatal: Not a valid object name origin/develop
```

To fix `could not find where the branch started from origin/develop`, set `fetch-depth: 0` on `actions/checkout`, as in the workflow.

The offline check runs only on pull requests into `develop`. The pull request that promotes `develop` to `main` is checked against Console instead, for the reason given in [Promote develop to main](/tutorials/tracking-as-code/change-and-promote#promote-develop-to-main).

The `--gh-annotate` flag prints the errors as [GitHub workflow commands](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions), so they appear as annotations on the file in the pull request checks.

### Store an API key in the repository secrets

The checks against Console and the publishing need credentials. [Create an API key](/docs/account-management/#create-an-api-key) with permission to publish data structures to production and to create and edit tracking plans, then add three [repository secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) in GitHub: `SNOWPLOW_CONSOLE_ORG_ID`, `SNOWPLOW_CONSOLE_API_KEY_ID`, and `SNOWPLOW_CONSOLE_API_KEY`. Snowplow CLI reads these variables from the environment.

### Add the checks against Console

Add a second job to the pull request workflow for the two checks that use the secrets. `ds validate` checks the data structures, and `dp validate` checks the tracking plan and its versions against what Console holds. The secrets go only to this job, which doesn't run `npm ci`, so no package your pull request installs runs with the API key:

```yaml title=".github/workflows/check-pull-request.yml"
on:
  pull_request:
    branches: [develop, main]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: snowplow/setup-snowplow-cli@v1

      - run: npm ci

      - run: npx snowtype check

      - if: github.base_ref == 'develop'
        run: snowplow-cli dp validate offline --base-ref origin/develop --gh-annotate

  check-console:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - uses: snowplow/setup-snowplow-cli@v1

      - run: snowplow-cli ds validate --gh-annotate

      - run: snowplow-cli dp validate --gh-annotate
```

The check against Console catches what the offline check can't see: a change that reached Console from another branch while yours was open.

### Add the publish workflow

The publish workflow runs on every push to `develop` and `main`, which is what a merged pull request produces. Both branches publish the same tracking plan, because the tracking plan belongs to your organization, not to a pipeline. Two steps run only on `main`:

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

      - if: github.ref_name == 'main'
        run: snowplow-cli ds publish prod --managed-from $GITHUB_REPOSITORY

      - run: snowplow-cli dp sync

      - if: github.ref_name == 'main'
        run: snowplow-cli dp release
```

On `develop`, the workflow runs two steps:

1. `ds publish dev` publishes the data structures to the development registry, which your [Console development environment](/docs/testing/snowplow-micro/console/) reads. Console locks data structures published with Snowplow CLI against editing in the UI, and shows the `--managed-from` value, your repository, in the lock banner.
2. `dp sync` writes the source application, the tracking plan, and the event specifications to Console. A structural change creates a new event specification version in draft. Pipelines don't validate events against drafts, development environments do, as described in [Test against draft event specifications](/docs/event-studio/test-and-publish/#test-against-draft-event-specifications).

On `main`, the workflow runs four steps:

1. `ds publish dev` does nothing when `develop` already published the same data structures. It covers a fix made directly on `main`, because a data structure must reach development before it can reach production.
2. `ds publish prod` publishes the data structures to the production registry, which your production pipeline reads.
3. `dp sync` finds no changes after a promotion, because `develop` already synced the same files.
4. `dp release` publishes the draft event specifications. A release reaches every pipeline in your organization at once.

:::note[Test on a QA pipeline]
A QA pipeline usually reads the production registry, not the development one, so it doesn't know the data structures that `develop` publishes. To test on a QA pipeline, add `ds publish prod` to the `develop` run as well, and keep `dp release` on `main` only. The QA pipeline still validates events only against released event specifications.
:::

`dp release` refuses to publish an event specification whose data structures aren't in production yet. That's why `ds publish prod` runs before it. When an event specification references a data structure version that isn't in production, the release fails:

```text
12:25PM INFO validation success data products found=1 source applications found=1
12:25PM INFO sync no changes detected, nothing to apply
12:25PM INFO release will release event spec name=Signup resource name=00000000-0000-4000-8000-000000000003
12:25PM ERRO Cannot publish event specs: the following data structures are not deployed to production: iglu:com.example/signup/jsonschema/1-0-1, iglu:com.example/plan/jsonschema/1-0-0
Use `snowplow-cli ds publish prod` to resolve
```

The failed release leaves the event specification version in Console as a draft, matching your files, so `dp validate` still passes, and every retry of `dp release` fails the same way. To fix `Cannot publish event specs: the following data structures are not deployed to production`, run `snowplow-cli ds publish prod`, then run `dp release` again.

### Open the first pull request

Commit the two workflows, push the branch, and open a pull request into `develop`:

```bash
git add .github/workflows
git commit -m "Check and publish the tracking from GitHub Actions"
git push -u origin feature/signup-tracking
```

The pull request workflow runs every check, and the pull request shows them as passed. When the checks pass and the pull request is reviewed, merge it. The publish workflow then publishes the two data structures to the development registry and syncs the tracking plan. In Console, the data structures show that they're managed from your repository and are deployed to development only, and the `Signup flow` tracking plan shows the `Signup` event specification at version `0` in draft.

</Steps>
