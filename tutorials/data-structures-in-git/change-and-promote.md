---
title: "Change an event specification and promote it to production"
sidebar_label: "Change and promote"
position: 4
description: "Make a structural change to an event specification on a feature branch, fix the version and the generated code that the checks report, publish it from develop, and promote it to main."
keywords: ["event specification version", "snowplow cli validate offline", "promote tracking plan to production"]
date: "2026-11-13"
---

In this part of the tutorial, you'll take one change to the tracking through the whole flow: a feature branch, a pull request into `develop`, the publish from `develop`, and the promotion to `main`. On the way, you'll see what each check reports when the change is incomplete, and how to fix it.

The change makes the plan entity optional on the `docs-capture signup` event specification, for users who sign up before they pick a plan.

<Steps>

### Make a structural change on a feature branch

Create a branch from `develop` and change the entity's minimum cardinality from `1` to `0`:

```bash
git switch develop
git pull
git switch -c feature/docs-capture-optional-plan
```

```diff title="data-products/docs-capture-signup-flow.yaml"
           entities:
             tracked:
                 - source: iglu:com.example.docs-capture/docs_capture_plan/jsonschema/1-0-0
-                  minCardinality: 1
+                  minCardinality: 0
                   maxCardinality: 1
```

A change to the entities, including their cardinality, is structural, so Console assigns the event specification a new version when the change syncs. Run the offline check:

```bash
snowplow-cli dp validate offline --base-ref develop
```

The check fails, because the file still declares version `0` after a structural change:

```text
12:23PM ERRO validating file=data-products/docs-capture-signup-flow.yaml path=/data/eventSpecifications/0
  errors=
  │ docs-capture signup: version 0 needs a bump
  │ changed: entities
  │ expected version: 1
  │ run `snowplow-cli dp validate offline --base-ref develop --fix` to update it

12:23PM ERRO validation failed 1 errors
```

To fix `version 0 needs a bump`, run the `--fix` command the error names, which changes only the `version` field:

```bash
snowplow-cli dp validate offline --base-ref develop --fix
```

```text
12:23PM INFO validation updated event specification version file=data-products/docs-capture-signup-flow.yaml name="docs-capture signup" from=0 to=1
12:23PM INFO validation success data products found=1 source applications found=1
```

The generated code carries the event specification version, so the version change leaves it out of date. `npx snowtype check` fails and lists the file that differs:

```text
✔: Valid configuration found
⚠ Warning: Generating from local definitions only. Schemas are not checked against the environments they are deployed to.
✗ Error: The generated code is not up to date with the tracking definitions. Run `snowtype generate` and commit the result.
  src/tracking/snowplow.ts
```

To fix `The generated code is not up to date with the tracking definitions`, run `npx snowtype generate` and commit the definitions and the generated code together:

```bash
npx snowtype generate
git add data-products src/tracking
git commit -m "Make the plan entity optional on signup"
```

### Open the pull request into develop

Push the branch and open a pull request into `develop`. The pull request workflow runs the same checks you ran locally, plus the checks against Console.

The check against Console catches a change that someone else published while your branch was open. If a teammate's pull request changed the same event specification and merged first, Console holds a version your files don't reflect, and `dp validate` fails with `needs a bump`. For example, your files declare version `1`, the teammate's change has already taken Console to version `2`, and the expected version is `3`. To fix it, update your branch from `develop`, so the tracking plan file holds the teammate's change and yours, then run the `--fix` command the error names, regenerate the code, and push. Don't run `--fix` before updating the branch: it would write the expected version into a file that doesn't hold the teammate's change, and the next sync would publish your file over it.

```text
12:26PM ERRO validating file=data-products/docs-capture-signup-flow.yaml path=/data/eventSpecifications/0
  errors=
  │ docs-capture signup: version 1 needs a bump
  │ changed: entities
  │ expected version: 3
  │ run `snowplow-cli dp validate --fix` to update it

12:26PM ERRO validation failed 1 errors
```

Your pull request reports this failure only if its checks run after the teammate's merge. Before you merge, update your branch with the latest `develop`, or run the checks again, so the version check sees changes other people merged after your checks ran.

:::tip[Require up-to-date branches]
In your repository's branch protection for `develop`, turn on **Require branches to be up to date before merging** (see [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)). GitHub then runs the checks again against the latest `develop` before every merge, and a version conflict with someone else's change fails in the pull request instead of in the publish workflow.
:::

If a pull request merges with checks that ran before the teammate's merge, the publish workflow fails at `dp sync` with the same `needs a bump` error, before it writes the tracking plan to Console.

For the other errors the checks can report, see [Troubleshooting](/docs/api-reference/snowplow-cli/tracking-plans/#troubleshooting).

### Merge into develop

When the checks pass and the pull request is reviewed, merge it into `develop`. The publish workflow syncs the change and releases version `1` of the event specification. In Console, the **History** tab of the `docs-capture signup` event specification lists version `1`.

Your application's `develop` deployment sends version `1` to your QA pipeline or Snowplow Micro, where you can test the change.

Until you deploy `main`, your production code keeps sending the previous version, and Snowplow keeps validating those events against that version, so releasing the new version from `develop` doesn't affect them.

### Promote develop to main

Open a pull request from `develop` into `main`. The pull request workflow runs `snowtype check` and the checks against Console, but not the offline check.

The offline check compares your files with the point where the branch started, and expects at most one version raise per event specification. A promotion can carry several structural changes to the same event specification, each one merged into `develop` separately and each one already given its own version by Console. For example, two changes take an event specification from version `0` to `2` on `develop`, but compared with `main`, the offline check expects version `1`, and its `--fix` would write a version Console doesn't hold. Console already holds every version `develop` published, so the check against Console is the one that matches.

When the checks pass, merge the pull request. The publish workflow runs again from `main`. `develop` has already published every change, so `dp release` finds nothing to do:

```text
12:21PM INFO validation success data products found=1 source applications found=1
12:21PM INFO sync no changes detected, nothing to apply
12:21PM INFO release no event specs to release
```

Your application's `main` deployment then sends version `1` of the event specification to your production pipeline.

</Steps>
