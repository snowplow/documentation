---
title: "Change an event specification and promote it to production"
sidebar_label: "Change and promote"
position: 4
description: "Make a structural change to an event specification on a feature branch, fix the version and the generated code that the checks report, test the draft from develop, and release it from main."
keywords: ["event specification version", "snowplow cli validate offline", "promote tracking plan to production"]
date: "2026-11-13"
---

In this part of the tutorial, you'll take one change to the tracking through the whole flow: a feature branch, a pull request into `develop`, a draft you test in your development environment, and the promotion to `main` that releases it. On the way, you'll see what each check reports when the change is incomplete, and how to fix it.

The change makes the plan entity optional on the `Signup` event specification, for users who sign up before they pick a plan.

<Steps>

### Make a structural change on a feature branch

Create a branch from `develop` and change the entity's minimum cardinality from `1` to `0`:

```bash
git switch develop
git pull
git switch -c feature/optional-plan
```

```diff title="data-products/signup-flow.yaml"
           entities:
             tracked:
                 - source: iglu:com.example/plan/jsonschema/1-0-0
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
12:23PM ERRO validating file=data-products/signup-flow.yaml path=/data/eventSpecifications/0
  errors=
  │ Signup: version 0 needs a bump
  │ changed: entities
  │ expected version: 1
  │ run `snowplow-cli dp validate offline --base-ref develop --fix` to update it

12:23PM ERRO validation failed 1 errors
```

To fix `version 0 needs a bump`, run the `--fix` command the error names, which changes only the `version` field from `0` to `1`:

```bash
snowplow-cli dp validate offline --base-ref develop --fix
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

The check against Console catches a change that reached Console while your branch was open, for example a teammate's pull request that changed the same event specification and merged first. Console then holds a version your files don't reflect, and `dp validate` fails with `needs a bump`. For example, if your files declare version `5` and another change has already taken Console to version `5` with different entities, the expected version is `6`:

```text
12:35PM ERRO validating file=data-products/signup-flow.yaml path=/data/eventSpecifications/0
  errors=
  │ Signup: version 5 needs a bump
  │ changed: entities
  │ expected version: 6
  │ run `snowplow-cli dp validate --fix` to update it

12:35PM ERRO validation failed 1 errors
```

To fix `needs a bump` from the check against Console:

1. Run `git fetch origin`.
2. Merge `origin/develop` into your branch, and resolve any conflict in the tracking plan file so it keeps the other change and yours.
3. Run `snowplow-cli dp validate offline --base-ref origin/develop --fix`, which needs no credentials and writes the same version Console expects.
4. Regenerate the code.
5. Push.

Check against `origin/develop`, not your local `develop`: unless you pulled it, your local `develop` doesn't have the other change, and the check passes without raising the version. Don't run `--fix` before updating the branch: it would write the expected version into a file that doesn't hold the other change, and the next sync would publish your file over it.

Your pull request reports this failure only if its checks run after the other merge. Before you merge, update your branch with the latest `develop`, or run the checks again, so the version check sees changes other people merged after your checks ran.

:::tip[Require up-to-date branches]
In your repository's branch protection for `develop`, turn on **Require branches to be up to date before merging** (see [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)). GitHub then runs the checks again against the latest `develop` before every merge, and a version conflict with someone else's change fails in the pull request instead of in the publish workflow.
:::

If a pull request merges with checks that ran before the other merge, the publish workflow fails at `dp sync` with the same `needs a bump` error, before it writes the tracking plan to Console.

For the other errors the checks can report, see [Troubleshooting](/docs/api-reference/snowplow-cli/tracking-plans/#troubleshooting).

### Test the draft from develop

When the checks pass and the pull request is reviewed, merge it into `develop`. The publish workflow syncs the change, and Console gives the `Signup` event specification version `1` in draft. Each structural change merged into `develop` raises the draft version by one, the same way the offline check counts it, so your files and Console keep matching.

Deploy your application from `develop` to its staging environment, sending events to your [Console development environment](/docs/testing/snowplow-micro/console/). The development environment validates each event against the draft version that the generated code declares. See [Test against draft event specifications](/docs/event-studio/test-and-publish/#test-against-draft-event-specifications) for how to read the result.

Your production pipeline doesn't know version `1` yet, so nothing changes in production until you promote the change to `main`.

### Promote develop to main

Open a pull request from `develop` into `main`. The pull request workflow runs `snowtype check` and the checks against Console, but not the offline check.

The offline check compares your files with the point where the branch started, and expects at most one version raise per event specification. A promotion can carry several structural changes to the same event specification, each one merged into `develop` separately and each one already given its own version by Console. For example, two changes take an event specification from version `0` to `2` on `develop`, but compared with `main`, the offline check expects version `1`, and its `--fix` would write a version Console doesn't hold. Console already holds every version `develop` synced, so the check against Console is the one that matches.

When the checks pass, merge the pull request. The publish workflow runs from `main`: it publishes the data structures to the production registry, finds no changes to sync, and releases the draft. The `dp release` step prints:

```text
12:26PM INFO validation success data products found=1 source applications found=1
12:26PM INFO sync no changes detected, nothing to apply
12:26PM INFO release will release event spec name=Signup resource name=00000000-0000-4000-8000-000000000003
12:26PM INFO release successfully released event specs count=1
```

In Console, the `Signup` event specification moves through **Publishing** to **Published**, which takes a few minutes. Deploy your application from `main` only after the publish workflow succeeds and the event specification shows **Published**. Until the release reaches the pipelines, production events that declare the new version can't be matched to it.

:::note[A change reaches develop during the promotion]
Both branches publish to the same tracking plan. If a change merged into `develop` syncs to Console after you merge the promotion, but before the publish workflow on `main` reaches `dp sync`, Console already holds a newer version than `main`. The `dp sync` step then fails without writing anything, and the release doesn't run:

```text
5:03PM ERRO validating file=data-products/signup-flow.yaml path=/data/eventSpecifications/0
  errors=
  │ Signup: version 1 needs a bump
  │ changed: entities
  │ expected version: 3
  │ run `snowplow-cli dp validate --fix` to update it

5:03PM ERRO validation failed 1 errors
```

To fix it, promote `develop` to `main` again. The new pull request brings the latest change from `develop`, and its publish releases both changes. Don't run the `--fix` command from the message on `main`: the next sync from `main` would overwrite the draft that `develop` synced.
:::

### Bring fixes made on main back to develop

A fix made directly on `main` publishes and releases like a promotion, so Console moves on without `develop`. Merge `main` back into `develop` before the next merge into `develop`. If you don't, the next pull request into `develop` that changes the same event specification fails the check against Console with `needs a bump`, as described in [Open the pull request into develop](#open-the-pull-request-into-develop), and so does the next sync.

To fix it:

1. Merge `main` into your branch.
2. Resolve any conflict in the tracking plan file so it keeps both changes.
3. Run `snowplow-cli dp validate --fix` with credentials to write the version Console expects.
4. Regenerate the code.
5. Push.

</Steps>
