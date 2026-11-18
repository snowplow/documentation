---
title: "Full example of the repository"
sidebar_label: "Full example"
position: 5
description: "Every file the tutorial on managing tracking as code adds, in its final state: data structures, tracking plan, source application, Snowtype configuration, and GitHub Actions workflows."
keywords: ["tracking plan repository example", "snowtype config example", "snowplow cli github actions example"]
date: "2026-11-17"
---

This page shows every file the tutorial adds to your application's repository, in its state at the end of [Change and promote](/tutorials/tracking-as-code/change-and-promote/), after the plan entity became optional.

The files the tutorial adds, alongside the rest of your app:

```text
.
├── .github
│   └── workflows
│       ├── check-pull-request.yml
│       └── publish.yml
├── data-products
│   ├── signup-flow.yaml
│   └── source-apps
│       └── web-app.yaml
├── data-structures
│   └── com.example
│       ├── plan.yaml
│       └── signup.yaml
├── snowtype.config.json
└── src
    └── tracking
        └── snowplow.ts
```

Snowtype writes `src/tracking/snowplow.ts` when you run `npx snowtype generate`, so it isn't shown here.

```yaml title="data-structures/com.example/signup.yaml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#
  self:
    vendor: com.example
    name: signup
    format: jsonschema
    version: 1-0-0
  type: object
  description: Someone created an account on the web app
  properties:
    method:
      type: string
      description: How the account was created
      enum:
        - email
        - google
        - github
  required:
    - method
  additionalProperties: false
```

```yaml title="data-structures/com.example/plan.yaml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: entity
  customData: {}
data:
  $schema: http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#
  self:
    vendor: com.example
    name: plan
    format: jsonschema
    version: 1-0-0
  type: object
  description: The pricing plan the account is on
  properties:
    name:
      type: string
      description: The name of the plan
      maxLength: 64
  required:
    - name
  additionalProperties: false
```

```yaml title="data-products/source-apps/web-app.yaml"
apiVersion: v1
resourceType: source-application
resourceName: 00000000-0000-4000-8000-000000000001
data:
    name: Web app
    description: The web app
    appIds:
        - web-app
    entities:
        tracked: []
        enriched: []
```

```yaml title="data-products/signup-flow.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 00000000-0000-4000-8000-000000000002
data:
    name: Signup flow
    description: Signups on the web app
    sourceApplications:
        - $ref: ./source-apps/web-app.yaml
    eventSpecifications:
        - resourceName: 00000000-0000-4000-8000-000000000003
          name: Signup
          version: 1
          description: Someone created an account and picked a plan
          event:
            source: iglu:com.example/signup/jsonschema/1-0-0
          entities:
            tracked:
                - source: iglu:com.example/plan/jsonschema/1-0-0
                  minCardinality: 0
                  maxCardinality: 1
```

```json title="snowtype.config.json"
{
  "tracker": "@snowplow/browser-tracker",
  "language": "typescript",
  "outpath": "src/tracking",
  "repositories": ["data-structures"],
  "localDataProducts": ["data-products"],
  "igluCentralSchemas": [],
  "dataStructures": [],
  "eventSpecificationIds": [],
  "dataProductIds": []
}
```

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
