---
title: "Managing tracking plans via the CLI"
sidebar_label: "Tracking plans"
sidebar_position: 30
description: "Use the Snowplow CLI data-products command to create, download, validate, sync, and release tracking plans, event specifications, and source applications with git-ops workflows."
keywords: ["Snowplow CLI tracking plans", "tracking plans CLI", "event specifications CLI", "source applications CLI", "CLI commands"]
content_type: how-to
---

import TrackingPlansNomenclature from '@site/docs/reusable/tracking-plans-nomenclature/_index.md';

<TrackingPlansNomenclature />

<Availability
  available={['cloud', 'pmc']}
  note="Managing data structures and tracking plans requires a Snowplow CDI (Console) account."
/>

The `data-products` subcommand of [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md) provides a collection of functionality to ease the integration of custom development and publishing workflows.
## Snowplow CLI Prerequisites
Installed and configured [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md)
## Available commands
### Creating tracking plan
```bash
snowplow-cli dp generate --data-product my-data-product
```
This command creates a minimal tracking plan template in a new file `./data-products/my-data-product.yaml`.
### Creating source application
```bash
snowplow-cli dp generate --source-app my-source-app
```
This command creates a minimal source application template in a new file `./data-products/source-apps/my-source-app.yaml`.
### Creating event specification
To create an event specification, you need to modify the existing data-product file and add an event specification object. Here's a minimal example:
```yaml title="./data-products/test-cli.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 3d3059c4-d29b-4979-a973-43f7070e1dd0
data:
    name: test-cli
    sourceApplications: []
    eventSpecifications:
        - resourceName: 11d881cd-316e-4286-b5d4-fe7aebf56fca
          name: test
          event:
            source: iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0
```
:::note
The `source` fields of events and entities must refer to a deployed data structure. Referring to a locally created data structure is not yet supported.
:::
### Linking tracking plan to a source application
To link a tracking plan to a source application, provide a list of references to the source application files in the `data.sourceApplications` field. Here's an example:
```yaml title="./data-products/test-cli.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 3d3059c4-d29b-4979-a973-43f7070e1dd0
data:
    name: test-cli
    sourceApplications:
        - $ref: ./source-apps/my-source-app.yaml
```
### Modifying the event specifications source applications
By default event specifications inherit all the source applications of the tracking plan. If you want to customise it, you can use the `excludedSourceApplications` in the event specification description to remove a given source application from an event specification.
```yaml title="./data-products/test-cli.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 3d3059c4-d29b-4979-a973-43f7070e1dd0
data:
    name: test-cli
    sourceApplications:
        - $ref: ./source-apps/generic.yaml
        - $ref: ./source-apps/specific.yaml
    eventSpecifications:
        - resourceName: 11d881cd-316e-4286-b5d4-fe7aebf56fca
          name: All source apps
          event:
            source: iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0
        - resourceName: b9c994a0-03b2-479c-b1cf-7d25c3adc572
          name: Not quite everything
          excludedSourceApplications:
            - $ref: ./source-apps/specific.yaml
          event:
            source: iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0
```
In this example event specification `All source apps` is related to both `generic` and `specific` source apps, but event specification `Not quite everything` is related only to the `generic` source application.
### Downloading tracking plans, event specifications and source apps
```bash
snowplow-cli dp download
```
This command retrieves all organization tracking plans, event specifications, and source applications. By default, it creates a folder named `data-products` in your current working directory. You can specify a different folder name as an argument if needed.
The command creates the following structure:
- A main `data-products` folder containing your tracking plan files
- A `source-apps` subfolder containing source application definitions
- Event specifications embedded within their related tracking plan files.
### Validating tracking plans, event specifications and source applications
```bash
snowplow-cli dp validate
```
This command scans all files under `./data-products` and validates them using Snowplow Console. It checks:
1. Whether each file is in a valid format (YAML/JSON) with correctly formatted fields
2. Whether all source application references in the tracking plan files are valid
3. Whether event specification rules are compatible with their schemas
If validation fails, the command displays the errors in the console and exits with status code 1.
### Syncing tracking plans, event specifications and source applications
```bash
snowplow-cli dp sync
```
This command locates all files under `./data-products`, validates them, and pushes local changes to Console. Tracking plans and source applications are updated in place. For event specifications, Console may create a new version in draft status if the change is structural: a change to the name, the event, or the entities, including their property rules and entity cardinality.

:::note[Deprecated alias]

The old `publish` command has been renamed to `sync`. Running `dp publish` still works as an alias for backward compatibility, but it may be removed in a future release. Update your scripts to use `dp sync` instead.

:::

### Releasing event specifications
```bash
snowplow-cli dp release
```
This command first syncs local files with Console (like `sync`), then releases any draft event specifications. Releasing marks event specifications as published and enables event spec inference. Only event specifications that are part of the local tracking plan files are affected — other event specifications in Console are left unchanged. Event specifications without an event are skipped.

Use `sync` if you only want to push changes without changing event specification status.


## Declare event specification versions

<AppliesTo feature="snowplow-cli-event-specification-versions" />

Console gives every event specification a version number. When you declare that version in your tracking plan files, the CLI checks that each change to a file raises it exactly as Console will, so the version in your files is the version Console assigns. The CLI doesn't check an event specification without a `version` field.

The expected version follows one rule:

* A new event specification starts at `0`
* A change to the name, the event, or the entities, including their property rules and entity cardinality, raises the version by one
* Any other change, such as a new description, keeps the same version

Console counts versions per organization, so the versions in your files belong to the organization you validate against. If your pipeline publishes the same files to two organizations, the declared versions can match only one of them, and the check fails for the other.

To declare versions and keep them correct, follow these steps.

<Steps>

### Add the versions Console holds

To start declaring versions in files that already exist, write the version Console holds into each event specification. Run `dp validate --fix` with credentials, against the organization you publish to:

```bash
snowplow-cli dp validate --fix
```

The command adds one `version` line per event specification and changes nothing else in your files. Adding versions changes nothing in Console: `dp sync` and `dp release` report no changes to apply.

You can also write the versions with `snowplow-cli dp download --versions`. The command writes every tracking plan in the organization in Console's own layout. If you download over your files, keep only the `version` lines from the diff.

Commit the versions in a pull request of their own, with no other change. On that pull request, the [check against the point where the branch started](#check-versions-against-the-point-where-the-branch-started) finds no version at the base, skips those event specifications, and passes.

### Raise the version when you change an event specification

When you make a structural change to an event specification, raise its `version` by one. For example, making the plan entity optional changes the entity cardinality, so `docs-capture signup` moves from version `0` to `1`:

```yaml title="./data-products/docs-capture-signup-flow.yaml"
    eventSpecifications:
        - resourceName: 947020bc-775c-473d-94cb-adf65501a001
          name: docs-capture signup
          version: 1
          description: Someone created an account and picked a plan
          event:
            source: iglu:com.example.docs-capture/docs_capture_signup/jsonschema/1-0-0
          entities:
            tracked:
                - source: iglu:com.example.docs-capture/docs_capture_plan/jsonschema/1-0-0
                  minCardinality: 0
                  maxCardinality: 1
```

Instead of editing the number by hand, you can add `--fix` to the [offline check](#check-versions-against-the-point-where-the-branch-started) or to the [check against Console](#verify-the-versions-against-console). The `--fix` flag writes the expected version into each event specification: it replaces a declared version that differs, and adds one where none is declared and the expected version is known. It changes only the `version` field. Update your branch from the base branch before you run `--fix`, as the warning in [Troubleshooting](#troubleshooting) explains.

```bash
snowplow-cli dp validate offline --base-ref develop --fix
```

### Check versions against the point where the branch started

`dp validate offline` compares the versions in your files with the same files at the commit where your branch started from `--base-ref`. The offline check needs no credentials and doesn't contact Console. It runs `git`, so `git` must be installed, and it needs the full history and the base ref.

```bash
snowplow-cli dp validate offline --base-ref develop
```

The offline check exits with status 0 when every version matches, and with status 1 when a version is wrong. See [Troubleshooting](#troubleshooting) for each error and its fix.

In GitHub Actions, fetch the full history, because the shallow clone that `actions/checkout` creates by default has no point to compare with:

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
- run: snowplow-cli dp validate offline --base-ref origin/develop --gh-annotate
```

The offline check covers event specification versions only. For a data structure that skips a version, see [Validating data structures](/docs/api-reference/snowplow-cli/data-structures/index.md#validating-data-structures).

### Verify the versions against Console

`dp validate` compares the versions in your files with the versions Console holds, and needs credentials:

```bash
snowplow-cli dp validate
```

The command exits with status 0 when every declared version matches the version Console will assign. `dp sync` and `dp release` run the same check before they write anything, including with `--dry-run`, and refuse to publish when a version doesn't match. See [Troubleshooting](#troubleshooting) for each error and its fix.

</Steps>

## Troubleshooting

The version checks print these errors and exit with status 1. Each error names the event specification it applies to.

`docs-capture signup: version 0 needs a bump` means your files, or Console, hold a structural change that the declared version doesn't reflect. The message names what changed and the expected version, and the offline check, `dp validate`, `dp sync`, and `dp release` all print it. Update your branch from the base branch first, so your files hold every change already published from other branches. Then run the `--fix` command that the message names, and run the check again.

```text
12:23PM ERRO validating file=data-products/docs-capture-signup-flow.yaml path=/data/eventSpecifications/0
  errors=
  │ docs-capture signup: version 0 needs a bump
  │ changed: entities
  │ expected version: 1
  │ run `snowplow-cli dp validate offline --base-ref develop --fix` to update it

12:23PM ERRO validation failed 1 errors
```

:::warning[Update your branch before running --fix]

If you run `--fix` on a branch that isn't up to date, it writes the expected version into a file that still holds the older entities, and the next sync publishes them over the other change.

:::

`docs-capture github signup: version 2 does not match` means the declared version differs from the expected one for any other reason, such as a new event specification that doesn't start at `0`, which the message marks as `new event specification`. Run the `--fix` command that the message names.

```text
12:23PM ERRO validating file=data-products/docs-capture-signup-flow.yaml path=/data/eventSpecifications/2
  errors=
  │ docs-capture github signup: version 2 does not match
  │ new event specification
  │ expected version: 0
  │ run `snowplow-cli dp validate offline --base-ref develop --fix` to update it

12:23PM ERRO validation failed 1 errors
```

`Version mismatch on event spec` means someone made a structural change to the event specification in Console after `dp sync` or `dp release` checked your files, but before the command wrote them. Console refuses the write, because it would assign a different version from the one in your files, and the command writes nothing. Update your branch so your files hold that change, then run `snowplow-cli dp validate --fix` and run `dp sync` or `dp release` again. If you run `dp validate` first instead, it reports the change as a `needs a bump` error with the new expected version.

```text
11:42AM ERRO bad response: {Version mismatch on event spec docs-capture signup id: 947020bc-775c-473d-94cb-adf65501a001: expected version 5, the platform would assign version 6}
```

`could not find where the branch started from origin/develop` means the repository doesn't have the base ref, or doesn't have enough history to find where the branch started from it. This happens in the shallow clone that `actions/checkout` creates by default. A clone without the base ref prints `fatal: Not a valid object name origin/develop`, and a clone that has the base ref but not the history prints `exit status 1:` with nothing after it. Fetch the full history, for example with `fetch-depth: 0` on `actions/checkout`, and make sure the base ref is fetched.

```text
12:23PM ERRO could not find where the branch started from origin/develop: fetch the full history (for example actions/checkout with fetch-depth: 0) and make sure origin/develop is fetched: git merge-base HEAD origin/develop failed: exit status 128: fatal: Not a valid object name origin/develop
12:23PM ERRO could not find where the branch started from origin/develop: fetch the full history (for example actions/checkout with fetch-depth: 0) and make sure origin/develop is fetched: git merge-base HEAD origin/develop failed: exit status 1:
```
