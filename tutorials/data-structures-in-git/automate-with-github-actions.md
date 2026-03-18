---
title: "Automate data structure workflows with GitHub Actions"
sidebar_label: "Automate with GitHub Actions"
position: 4
description: "Set up GitHub Actions workflows to automatically validate pull requests and publish data structures to development and production environments."
keywords: ["github actions snowplow cli", "automated data structure deployment"]
---

We'll not go into the details of creating github repositories and initial commits here, the [github docs](https://docs.github.com/) do an excellent job of that already. The next few steps will assume a working github repository containing the directory and data structure we created in the previous section. It will have two branches named `main` and `develop` which should be in sync.

## Publish to develop workflow

We would like pushes to our `develop` branch to be automatically published to our [development](/docs/testing/) environment. Github workflows can be [triggered](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow) by all kinds of repository events. The one we are interested in here:
```yml
on:
  push:
    branches: [develop]
```

With our trigger point worked out we need to complete a series of steps:
1. Configure snowplow-cli via environment variables provided as [github action secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
2. Checkout our repo
3. Install snowplow-cli. We'll use our [setup-snowplow-cli](https://github.com/snowplow/setup-snowplow-cli) github action here. Behind the scenes it is downloading the [latest](https://github.com/snowplow/snowplow-cli/releases/latest) snowplow-cli release and making it available via the workflow job's `path`.
4. Run the `snowplow-cli ds publish dev` command as we did earlier

The full action:

```yml title=".github/workflows/publish-develop.yml"
on:
  push:
    branches: [develop]

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
```
:::tip
The value of the `--managed-from` flag will be displayed inside the 'This data structure is locked' banner we saw earlier in the UI. It is designed to help people track down the source of truth for this data structure.
:::

## Publish to production workflow

In the same way we want our `develop` branch to deploy to our `develop` environment we want our `main` branch to deploy to our `production` environment.

As we saw earlier publishing to production is very similar to publishing to development. The only new thing we need here is a different workflow trigger.

```yml title=".github/workflows/publish-production.yml"
on:
  push:
    branches: [main]

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

      - run: snowplow-cli ds publish prod --managed-from $GITHUB_REPOSITORY
```

## Validate on pull request workflow

A core component of version control based workflows is the [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). For our repository we would like to ensure as best we can that any data structure changes are valid and problem free before they get merged into develop. Lucky for us there is a github workflow event for that.

By combining the `snowplow-cli ds validate` command and the github workflow pull request event we arrive at this:
```yml title=".github/workflows/validate-pull-request.yml"
on:
  pull_request:
    branches: [develop, main]

jobs:
  validate:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - uses: snowplow/setup-snowplow-cli@v1

      - run: snowplow-cli ds validate --gh-annotate
```
:::tip
The `--gh-annotate` flag will make the validate command output [github workflow command](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions) compatible output. We'll see an example of what that looks like in the next section.
:::
