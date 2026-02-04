---
title: "How does Signals fit into a Snowplow CDI pipeline?"
sidebar_position: 1
sidebar_label: "Where does Signals run?"
description: "Create rule-based interventions with criteria and targeting to automatically trigger actions when attribute values change. Configure using Console UI, Python SDK, or API."
keywords: ["interventions", "rule-based triggers", "intervention criteria", "attribute targeting"]
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'addon']}
  helpContent="Signals is a paid addon for Snowplow CDI."
/>
```

You will need a [Snowplow CDI pipeline](/docs/get-started/index.md) to use Signals. Your Signals infrastructure is deployed into the same cloud as your pipeline.

Signals consists of several new infrastructure components. When running Signals, your Snowplow pipeline will continue to process events as usual.

The core Signals components are:
* **Profiles Store**: stores calculated attributes and configurations
* Signals **SDKs** and **API**: allow you to manage and fetch attributes and interventions
* **Streaming engine**: computes attributes from Snowplow events in stream, and sends them directly to the Profiles Store
* **Sync engine**: periodically updates the Profiles Store with batch attributes
* **Batch engine**: runs in your warehouse to compute attributes from warehouse tables

![Snowplow Signals architecture diagram showing core components including Profiles Store, SDKs, streaming engine, and batch engine](../images/overview-incl-batch-engine.svg)

:::note Warehouse support
Only Snowflake and BigQuery are supported currently. However, you can also use Signals without the warehouse functionality.
:::
