---
title: "Telemetry"
description: "Configure telemetry and metrics collection for monitoring Snowbridge behavioral event forwarding performance."
schema: "TechArticle"
keywords: ["Telemetry Configuration", "Monitoring Setup", "Metrics Collection", "Performance Monitoring", "System Monitoring", "Observability"]
date: "2022-10-20"
sidebar_position: 500
---

# Telemetry Configuration

You can read about our telemetry principles [here](/docs/get-started/snowplow-community-edition/telemetry/index.md).

## Configuration options

Enabling telemetry:

```hcl
# Optional. Set to true to disable telemetry.
disable_telemetry = false

# Optional. See here for more information: https://docs.snowplow.io/docs/get-started/snowplow-community-edition/telemetry/#how-can-i-help
user_provided_id = "elmer.fudd@acme.com"
```

Disabling telemetry:

```hcl
# Optional. Set to true to disable telemetry.
disable_telemetry = false
```