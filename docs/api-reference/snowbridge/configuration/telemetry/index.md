---
title: "Snowbridge telemetry configuration"
sidebar_label: "Telemetry"
date: "2022-10-20"
sidebar_position: 500
description: "Enable or disable telemetry for Snowbridge with user-provided identifiers and privacy controls."
keywords: ["snowbridge config", "telemetry", "usage tracking", "privacy", "disable telemetry"]
---

You can read about our telemetry principles [here](/docs/get-started/self-hosted/telemetry/index.md).

To enable telemetry:

```hcl
# Optional. Set to true to disable telemetry.
disable_telemetry = false

# Optional. An identifier to associate with telemetry data.
user_provided_id = "elmer.fudd@acme.com"
```

To disable telemetry:

```hcl
# Optional. Set to true to disable telemetry.
disable_telemetry = false
```
