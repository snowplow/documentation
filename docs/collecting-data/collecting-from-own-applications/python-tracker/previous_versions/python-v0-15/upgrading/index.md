---
title: "Upgrading to Newer Versions"
date: "2023-01-25"
sidebar_position: 100
---

This page gives instructions to upgrading to newer versions of the Python Tracker

## Upgrading to v0.13.0+
There are a number of breaking changes in this release, in order to make use of the new features please make sure to:

- Use the `batch_size` argument instead of `buffer_size` in the Emitter initialization.
- Users should no longer use the `on_failure` method to determine retry behaviors. Retry failed events is now a built in feature which can be configured in the `Emitter` directly or via `EmitterConfiguration` object.
