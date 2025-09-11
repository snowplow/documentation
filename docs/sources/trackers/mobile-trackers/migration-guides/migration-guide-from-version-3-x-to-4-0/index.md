---
title: "From version 3.x to 4.0"
description: "Migration guide for mobile trackers upgrade from version 3.x to 4.0 with enhanced features."
schema: "TechArticle"
keywords: ["Mobile Migration", "V3 to V4", "Mobile Upgrade", "Version Migration", "Migration Guide", "Breaking Changes"]
date: "2022-08-30"
sidebar_position: -3
---

# Migration guide from version 3.x to 4.0

A breaking change in this release is the updated callback for remote configuration. The callback now in addition to the list of namespaces also receives the configuration state enum as an argument. Read more about the [new API here](../../remote-configuration/index.md).

The tracker now also returns the event ID from the `track(event)` method in `TrackerController`.
