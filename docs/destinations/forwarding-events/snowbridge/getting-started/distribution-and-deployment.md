---
title: "Distribution and deployment"
date: "2022-10-20"
sidebar_position: 200
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Distribution options

There are two distributions of Snowbridge.

<Tabs groupId="cloud" queryString>
  <TabItem value="default" label="Default" default>

The default distribution contains everything except for the [Kinesis source](/docs/destinations/forwarding-events/snowbridge/configuration/sources/kinesis.md), i.e. the ability to read from AWS Kinesis. This distribution is all licensed under the [Snowplow Community License](/community-license-1.0/). _(If you are uncertain how it applies to your use case, check our answers to [frequently asked questions](/docs/contributing/community-license-faq/index.md).)_

It’s available on Docker:

<CodeBlock language="bash">{
`docker pull snowplow/snowbridge:${versions.snowbridge}
docker run snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>


  </TabItem>
  <TabItem value="aws" label="AWS-specific (includes Kinesis source)" default>

The AWS-specific distribution contains everything, including the [Kinesis source](/docs/destinations/forwarding-events/snowbridge/configuration/sources/kinesis.md), i.e. the ability to read from AWS Kinesis. Like the default distribution, it’s licensed under the [Snowplow Community License](/community-license-1.0/) ([frequently asked questions](/docs/contributing/community-license-faq/index.md)). However, this distribution has a dependency on [twitchscience/kinsumer](https://github.com/twitchscience/kinsumer), which is licensed by Twitch under the [Amazon Software License](https://github.com/twitchscience/kinsumer/blob/master/LICENSE).

To comply with the [Amazon Software License](https://github.com/twitchscience/kinsumer/blob/master/LICENSE), you may only use this distribution of Snowbridge _“with the web services, computing platforms or applications provided by Amazon.com, Inc. or its affiliates, including Amazon Web Services, Inc.”_

It’s available on Docker:

<CodeBlock language="bash">{
`docker pull snowplow/snowbridge:${versions.snowbridge}-aws-only
docker run snowplow/snowbridge:${versions.snowbridge}-aws-only`
}</CodeBlock>

  </TabItem>
</Tabs>

## Deployment

The app can be deployed via services like EC2, ECS or Kubernetes using docker.

Configuration and authentication can be done by mounting the relevant files, and/or setting the relevant environment variables as per the standard authentication methods for cloud services.


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Snowbridge" since="1.0.0" idSetting="user_provided_id" disableSetting="disable_telemetry" />
```
