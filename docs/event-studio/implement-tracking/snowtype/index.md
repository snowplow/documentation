---
title: "Snowtype"
sidebar_label: "Snowtype"
sidebar_position: 6
description: "Snowtype generates type-safe tracking code from your event specifications and data structures, so your tracking implementation stays in sync with your schemas."
keywords: ["Snowtype", "code generation", "type-safe tracking", "automated SDK code", "tracking automation"]
date: "2026-03-19"
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc']}
  helpContent="Snowtype is available for Snowplow CDI customers only."
/>
```

Snowtype is a CLI tool that reads your [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md) and [data structures](/docs/event-studio/data-structures/index.md) from your Snowplow account, and generates type-safe tracking code for the language and tracker you specify.

This provides several key advantages:
* Quicker implementation: reduce the manual work needed to produce production-ready tracking code
* Type safety: ensure your tracking code is consistent with your schemas and catch errors before they reach your pipeline
* Workflow integration: use CI/CD GitOps-like processes to keep your tracking code in sync with your schemas

Writing tracking code by hand, and keeping it up-to-date, is time-consuming and error-prone. Snowtype automates this process, supporting your data governance and quality efforts.

## Snowtype workflow

The workflow for using Snowtype is:

1. **Define** your events and entities in [Console](https://console.snowplowanalytics.com) or [programmatically](/docs/event-studio/programmatic-management/index.md).
2. **Generate** tracking code by running Snowtype in your project. It produces typed functions you call instead of constructing event payloads manually.
3. **Track** events using the generated functions in your application code.
4. **Update** when schemas change. Snowtype can detect new versions and regenerate your code.

You can run Snowtype from the command line, or you can find its output in the Console on the **Implementation** tab of any [event specification](/docs/event-studio/tracking-plans/event-specifications/index.md).

## Supported trackers

Snowtype generates code for the following Snowplow trackers:

| Tracker                                                         | Language               |
| --------------------------------------------------------------- | ---------------------- |
| [Browser](/docs/sources/web-trackers/index.md)                  | TypeScript, JavaScript |
| [JavaScript](/docs/sources/web-trackers/index.md)               | JavaScript             |
| [iOS](/docs/sources/mobile-trackers/index.md)                   | Swift                  |
| [Android](/docs/sources/mobile-trackers/index.md)               | Kotlin                 |
| [React Native](/docs/sources/react-native-tracker/index.md)     | TypeScript             |
| [Flutter](/docs/sources/flutter-tracker/index.md)               | Dart                   |
| [Node.js](/docs/sources/node-js-tracker/index.md)               | TypeScript, JavaScript |
| [Go](/docs/sources/golang-tracker/index.md)                     | Go                     |
| [Java](/docs/sources/java-tracker/index.md)                     | Java                   |
| [Google Tag Manager](/docs/sources/google-tag-manager/index.md) | JavaScript             |
