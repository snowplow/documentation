---
title: "Setting up Snowplow Behavioral Data Platform"
sidebar_position: 3
sidebar_label: "Snowplow"
sidebar_custom_props:
  offerings:
    - bdp
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Enterprise: in your own cloud

Snowplow Enterprise is a version of [Snowplow](https://snowplow.io) hosted in your own cloud account (AWS, Azure or GCP). It enables you to create rich and well-structured data to power your advanced analytics and AI use cases.

:::tip Snowplow Cloud

Consider [Snowplow Cloud](#cloud-hosted-by-snowplow) for a faster setup time if you don’t wish to host your own cloud infrastructure (besides the data warehouse or lake). See [deployment model](docs/get-started/index.md) for a comparison between Snowplow Enterprise and Snowplow Cloud.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

Refer to the [AWS Setup Guide](/docs/get-started/snowplow-bdp/setup-guide-aws/index.md). Once you’ve set up your cloud environment, you can [request a new pipeline](https://console.snowplowanalytics.com/pipelines/AWS/new) via the Snowplow Console.

  </TabItem>
  <TabItem value="azure" label="Azure">

Refer to the [Azure Setup Guide](/docs/get-started/snowplow-bdp/setup-guide-azure/index.md). Once you’ve set up your cloud environment, you can [request a new pipeline](https://console.snowplowanalytics.com/pipelines/azure/new) via the Snowplow Console.

  </TabItem>
  <TabItem value="gcp" label="GCP">

Refer to the [AWS Setup Guide](/docs/get-started/snowplow-bdp/setup-guide-gcp/index.md). Once you’ve set up your cloud environment, you can [request a new pipeline](https://console.snowplowanalytics.com/pipelines/gcp/new) via the Snowplow Console.

  </TabItem>
</Tabs>

### Where is the infrastructure installed?

Snowplow’s internal team of data engineering experts set up, manage and upgrade your data pipeline within your own cloud environment bringing all the security, data quality and data activation benefits that come from owning your infrastructure.

:::tip

If you’d like to learn more about Snowplow you can **[book a demo with our team](https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/?utm-medium=related-content&utm_campaign=snowplow-docs)**.

:::

## Cloud: hosted by Snowplow

Snowplow Cloud is a hosted version of [Snowplow](https://snowplow.io) designed to get your organization up and running and delivering value from behavioral data as quickly as possible. It enables you to create rich and well-structured data to power your advanced analytics and AI use cases.

With Snowplow Cloud, you don’t need to set up any cloud infrastructure yourself. See [deployment model](docs/get-started/index.md) for a comparison between Snowplow Cloud and Snowplow Enterprise.

### Where is the Snowplow pipeline hosted?

All data processed and collected with Snowplow Cloud is undertaken within Snowplow’s own cloud account. Data is stored in Snowplow’s cloud account for 7 days to provide resilience against potential failures.

For more information, please see our [full product description](https://snowplow.io/).

:::tip

If you’d like to learn more about Snowplow you can **[book a demo with our team](https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/?utm-medium=related-content&utm_campaign=snowplow-docs)**.

:::
