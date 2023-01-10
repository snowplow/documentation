---
title: "Distribution and deployment"
date: "2022-10-20"
sidebar_position: 200
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Distribution options

There are two distributions of Snowbridge.

<Tabs groupId="distribution">
  <TabItem value="default" label="Default" default>

The default distribution contains everything except for the [Kinesis source](/docs/destinations/forwarding-events/snowbridge/configuration/sources/kinesis.md), i.e. the ability to read from AWS Kinesis. It’s licensed under the [Snowplow Community License](/community-license-1.0/). _(If you are uncertain how it applies to your use case, check our answers to [frequently asked questions](/docs/contributing/community-license-faq/index.md).)_

It’s available on Docker:

```bash
docker pull snowplow/snowbridge:{version}
docker run snowplow/snowbridge:{version}
```


  </TabItem>
  <TabItem value="aws" label="AWS-specific (includes Kinesis source)" default>

The AWS-specific distribution contains everything, including the [Kinesis source](/docs/destinations/forwarding-events/snowbridge/configuration/sources/kinesis.md), i.e. the ability to read from AWS Kinesis. Like the default distribution, it’s licensed under the [Snowplow Community License](/community-license-1.0/) ([frequently asked questions](/docs/contributing/community-license-faq/index.md)).

When using this distribution, you must also comply with the [Amazon Software License](https://github.com/twitchscience/kinsumer/blob/master/LICENSE) (due to a dependency on [twitchscience/kinsumer](https://github.com/twitchscience/kinsumer)). In practice, this means you can only run this distribution of Snowbridge on AWS.

It’s available on Docker:

```bash
docker pull snowplow/snowbridge:{version}-aws-only
docker run snowplow/snowbridge:{version}-aws-only
```

  </TabItem>
</Tabs>

## Deployment

The app can be deployed via services like EC2, ECS or Kubernetes using docker.

Configuration and authentication can be done by mounting the relevant files, and/or setting the relevant environment variables as per the standard authentication methods for cloud services.


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Snowbridge" since="1.0.0" idSetting="user_provided_id" disableSetting="disable_telemetry" />
```