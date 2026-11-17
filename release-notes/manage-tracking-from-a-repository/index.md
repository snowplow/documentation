---
title: "Manage tracking from a repository with Snowplow CLI 0.4.0 and Snowtype 0.20.0"
sidebar_label: "Tracking from a repository"
description: "Declare event specification versions in your tracking plan files with Snowplow CLI, generate tracking code from the same files with Snowtype, and follow a new tutorial that checks and publishes every change from GitHub Actions."
keywords: ["snowplow cli", "snowtype", "tracking as code", "event specification versions", "release notes"]
date: "2026-11-16"
category:
  - "Product news"
  - "Release notes"
components:
  - "Developer tools"
  - "Event Studio"
---

You can keep your tracking plans in your application's repository and generate the tracking code from the same files. A change to an event specification and the code that sends it go through one pull request.

## Declare event specification versions with Snowplow CLI 0.4.0

Console gives every event specification a version number. Snowplow CLI 0.4.0 lets a tracking plan file declare that version, and checks that each change raises it exactly as Console does. The version in your files, and in the code Snowtype generates from them, is the version Console assigns.

Snowplow CLI 0.4.0 adds these checks:

* `dp validate offline --base-ref <branch>` compares your files with the point where your branch started. It needs no credentials, so it runs locally and on every pull request.
* `--fix` writes the expected version into your files.
* `dp validate`, `dp sync`, and `dp release` check the versions against Console, and refuse to publish when one doesn't match.

See [Declare event specification versions](/docs/api-reference/snowplow-cli/tracking-plans/#declare-event-specification-versions).

## Generate code from your repository with Snowtype 0.20.0

Snowtype 0.20.0 generates tracking code from the tracking plan files in your repository. When it reads only your repository, it needs no Console credentials. See [Local tracking plans](/docs/event-studio/implement-tracking/snowtype-config/#local-tracking-plans).

The new `snowtype check` command reports whether the generated code matches your tracking definitions, without writing anything. Run it in CI to fail a pull request that changes a tracking plan without regenerating the code. See [`check`](/docs/event-studio/implement-tracking/command-reference/#check).

## Follow a tutorial for the whole flow

[Manage tracking from a repository with Snowtype and Snowplow CLI](/tutorials/tracking-as-code/introduction/) replaces the "Manage data structures with Git" tutorial. It sets up one repository for a web app, checks every pull request with GitHub Actions, publishes changes merged to `develop` to your development environment, and promotes them to production from `main`.
