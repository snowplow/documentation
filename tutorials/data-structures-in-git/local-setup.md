---
title: "Define the tracking in your repository"
sidebar_label: "Define the tracking"
position: 2
description: "Add data structures and a tracking plan to your application's repository, generate the tracking code with Snowtype, and check event specification versions locally without credentials."
keywords: ["snowplow cli tracking plan files", "snowtype local tracking plans", "snowtype generate"]
date: "2026-11-13"
---

In this part of the tutorial, you'll add the tracking definitions to your application's repository and generate the tracking code from them. Everything on this page runs on your machine without Console credentials.

The repository holds the definitions in the format Snowplow CLI reads and writes: data structures under `data-structures/`, and the tracking plan and its source application under `data-products/`. Work on a feature branch created from `develop`:

```bash
git switch develop
git switch -c feature/signup-tracking
```

<Steps>

### Add the data structures

Create one file per data structure, under a directory named after the vendor. The event `docs_capture_signup` records how someone created an account:

```yaml title="data-structures/com.example.docs-capture/docs_capture_signup.yaml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#
  self:
    vendor: com.example.docs-capture
    name: docs_capture_signup
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

The entity `docs_capture_plan` records the pricing plan the account picked:

```yaml title="data-structures/com.example.docs-capture/docs_capture_plan.yaml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: entity
  customData: {}
data:
  $schema: http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#
  self:
    vendor: com.example.docs-capture
    name: docs_capture_plan
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

The `meta.schemaType` field marks each data structure as an event or an entity. For every field in the file, and for `snowplow-cli ds generate`, which writes a new file for you, see [Snowplow CLI data structures](/docs/api-reference/snowplow-cli/data-structures/).

### Add the source application and the tracking plan

The source application lists the app IDs your web app sends events with:

```yaml title="data-products/source-apps/docs-capture-web-app.yaml"
apiVersion: v1
resourceType: source-application
resourceName: 735620cd-d7b5-4b8d-8f99-aea44d93ee53
data:
    name: docs-capture web app
    description: The web app
    appIds:
        - docs-capture-web
    entities:
        tracked: []
        enriched: []
```

The tracking plan references the source application and holds one event specification. The event specification names the event and the entity it carries, with `version: 0`, because Console starts a new event specification at version `0`:

```yaml title="data-products/docs-capture-signup-flow.yaml"
apiVersion: v1
resourceType: data-product
resourceName: b8fda510-7dd5-4689-9f7f-11f58d2005c5
data:
    name: docs-capture signup flow
    description: Signups on the web app
    sourceApplications:
        - $ref: ./source-apps/docs-capture-web-app.yaml
    eventSpecifications:
        - resourceName: 947020bc-775c-473d-94cb-adf65501a001
          name: docs-capture signup
          version: 0
          description: Someone created an account and picked a plan
          event:
            source: iglu:com.example.docs-capture/docs_capture_signup/jsonschema/1-0-0
          entities:
            tracked:
                - source: iglu:com.example.docs-capture/docs_capture_plan/jsonschema/1-0-0
                  minCardinality: 1
                  maxCardinality: 1
```

Each `resourceName` must be a UUID v4 of your own, for example from `uuidgen`. The `version` field is what lets Snowplow CLI check every change against the version Console assigns, as described in [Declare event specification versions](/docs/api-reference/snowplow-cli/tracking-plans/#declare-event-specification-versions).

If the tracking plan already exists in Console, start from Console's copy instead. `snowplow-cli dp download --versions` writes every tracking plan and source application in the organization, with the versions Console holds, so keep only the files for this tracking plan. [Add the versions Console holds](/docs/api-reference/snowplow-cli/tracking-plans/#add-the-versions-console-holds) explains how to commit the versions.

### Configure Snowtype

Point Snowtype at the two directories in `snowtype.config.json`. With `localDataProducts` set, and no `dataStructures`, `eventSpecificationIds`, or `dataProductIds`, Snowtype reads only the repository and doesn't need Console credentials:

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

For what Snowtype reads from each file, see [Local tracking plans](/docs/event-studio/implement-tracking/snowtype-config/#local-tracking-plans).

### Generate the tracking code

Generate the code from the repository files:

```bash
npx snowtype generate
```

Snowtype warns that it doesn't check the schemas against the environments they're deployed to, because it doesn't contact Console:

```text
✔: Valid configuration found
⚠ Warning: Generating from local definitions only. Schemas are not checked against the environments they are deployed to.
✔: Code generated, writing...
```

Snowtype writes `src/tracking/snowplow.ts`. Call the event specification's function where the signup happens, passing the plan as an entity:

```typescript
import { trackDocsCaptureSignupSpec, createDocsCapturePlan } from './tracking/snowplow';

trackDocsCaptureSignupSpec({
  method: 'email',
  context: [createDocsCapturePlan({ name: 'free' })],
});
```

The function attaches the event specification's ID and version to every event, so the pipeline can match the event to its specification.

Commit the generated file together with the definitions. Later, `npx snowtype check` confirms that the committed code still matches what `snowtype generate` writes:

```text
✔: Valid configuration found
⚠ Warning: Generating from local definitions only. Schemas are not checked against the environments they are deployed to.
✔: Generated code is up to date
```

### Check the versions before you push

Check the event specification versions against the point where your branch started from `develop`. The check reads the files at that commit with `git`, so it needs no credentials:

```bash
snowplow-cli dp validate offline --base-ref develop
```

A new event specification must start at `0`, and every later [structural change](/docs/api-reference/snowplow-cli/tracking-plans/#declare-event-specification-versions) must raise its version by one. When a version is wrong, the error names the event specification and the `--fix` command that writes the expected version.

If you have Console credentials, for example from `snowplow-cli setup`, you can also check against Console and let the CLI write the versions Console expects:

```bash
snowplow-cli dp validate --fix
```

The credentials are optional on your machine. The pull request workflow runs the check against Console for you, as described in [Check and publish with GitHub Actions](/tutorials/data-structures-in-git/automate-with-github-actions).

Commit the files:

```bash
git add data-structures data-products snowtype.config.json src/tracking
git commit -m "Add signup tracking"
```

</Steps>
