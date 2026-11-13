---
title: "Integrate Signals with other tools"
sidebar_position: 33
sidebar_label: "Integrations"
description: "Use Signals attributes in the tools you already run, such as experimentation platforms, so they act on what each user is doing in the current session."
keywords: ["signals integrations", "experimentation platforms", "a/b testing", "feature flags", "real-time personalization"]
date: "2026-11-13"
content_type: landing
---

Signals calculates attributes from what each user is doing right now. These pages show how to pass those attributes to tools you already run, so the tool makes its decision with in-session context, and how to record the result in Snowplow.

| I want to | Go to |
| --- | --- |
| Target experiments and feature flags on in-session behavior | [Experimentation platforms](/docs/signals/integrations/experimentation-platforms/index.md) |
| Use Signals with Conductrics | [Conductrics](/docs/signals/integrations/experimentation-platforms/conductrics/index.md) |
| Use Signals with GrowthBook | [GrowthBook](/docs/signals/integrations/experimentation-platforms/growthbook/index.md) |
| Use Signals with LaunchDarkly | [LaunchDarkly](/docs/signals/integrations/experimentation-platforms/launchdarkly/index.md) |
| Use Signals with Optimizely | [Optimizely](/docs/signals/integrations/experimentation-platforms/optimizely/index.md) |

Each integration reads attributes through a Signals [service](/docs/signals/applications/services/index.md), so start by [connecting to Signals](/docs/signals/connection/index.md) and defining one.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
