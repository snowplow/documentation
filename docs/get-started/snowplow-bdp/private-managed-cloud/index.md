---
title: "Behavioral Data Platform — Enterprise"
description: "A version of Snowplow hosted in your own cloud account for maximum privacy and security."
sidebar_position: 1
sidebar_label: "BDP Enterprise"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

# Introduction

BDP Enterprise is a version of [Snowplow](https://snowplow.io) hosted in your own cloud account (AWS, Azure or GCP). It enables you to create rich and well-structured data to power your advanced analytics and AI use cases.

:::tip BDP Cloud

Consider [BDP Cloud](/docs/get-started/snowplow-bdp/cloud/index.md) for a faster setup time if you don’t wish to host your own cloud infrastructure (besides the data warehouse or lake). See [deployment model](/docs/get-started/deployment-model/index.md) for a comparison between BDP Enterprise and BDP Cloud.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

Refer to the [AWS Setup Guide](/docs/get-started/snowplow-bdp/private-managed-cloud/setup-guide-aws/index.md). Once you’ve set up your cloud environment, you can [request a new pipeline](https://console.snowplowanalytics.com/pipelines/AWS/new) via the Snowplow BDP Console.

  </TabItem>
  <TabItem value="azure" label="Azure">

Refer to the [Azure Setup Guide](/docs/get-started/snowplow-bdp/private-managed-cloud/setup-guide-azure/index.md). Once you’ve set up your cloud environment, you can [request a new pipeline](https://console.snowplowanalytics.com/pipelines/azure/new) via the Snowplow BDP Console.

  </TabItem>
  <TabItem value="gcp" label="GCP">

Refer to the [AWS Setup Guide](/docs/get-started/snowplow-bdp/private-managed-cloud/setup-guide-gcp/index.md). Once you’ve set up your cloud environment, you can [request a new pipeline](https://console.snowplowanalytics.com/pipelines/gcp/new) via the Snowplow BDP Console.

  </TabItem>
</Tabs>

## Where is the infrastructure installed?

Snowplow’s internal team of data engineering experts set up, manage and upgrade your data pipeline within your own cloud environment bringing all the security, data quality and data activation benefits that come from owning your infrastructure.

:::tip

If you’d like to learn more about Snowplow BDP you can **[book a demo with our team](https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/?utm-medium=related-content&utm_campaign=snowplow-docs)**.

:::
