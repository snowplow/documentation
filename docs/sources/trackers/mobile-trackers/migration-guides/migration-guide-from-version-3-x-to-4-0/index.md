---
title: "From version 3.x to 4.0"
date: "2022-08-30"
sidebar_position: -3
---

# Migration guide from version 3.x to 4.0

A breaking change in this release is the updated callback for remote configuration. The callback now in addition to the list of namespaces also receives the configuration state enum as an argument. Read more about the [new API here](../../remote-configuration/index.md).

The tracker now also returns the event ID from the `track(event)` method in `TrackerController`.
