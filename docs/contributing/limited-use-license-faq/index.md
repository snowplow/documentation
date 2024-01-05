# FAQ: Snowplow Limited Use License Agreement (SLULA)

:::info Note

This FAQ is not a substitute for reading [the license text](/limited-use-license-1.0/).

:::

## Why was the Snowplow Limited Use License Agreement introduced?

Previously, many of our Snowplow core pipeline components and dbt models were licensed as open source under the Apache 2.0 license. For more than a decade, our team has invested significant time and resources into researching, developing, and maintaining this code in an open source manner.

Looking forward, we have an exciting technology roadmap that will deliver additional value to all of our core pipeline users. It includes plans to reduce the cost of running the pipeline at scale, improve processing speed, provide more flexibility for custom in-stream processing steps, and support non-HTTP protocols for more efficient data ingestion from server-side and mobile devices. In order to fund these developments, we are asking Snowplow users who are running the Snowplow behavioral data pipeline in production in a highly available manner to pay for the value they receive in return.

## What is the Snowplow Limited Use License Agreement?

Snowplow is moving new versions of the Snowplow pipeline components to a source-available license. This license is based on the [Snowplow Community License](/docs/contributing/community-license-faq/index.md), with additional deployment and provisioning restrictions. Notably, this license includes restrictions that prohibit deploying the Snowplow software in a highly available manner for production workloads.

## How does the Snowplow Limited Use License Agreement work in practice?

Under the Snowplow Limited Use License Agreement, you can access the source code and modify it, but you cannot distribute it or use it to make a competing SaaS or on-premises offering. Nor can you deploy the Snowplow software in a highly available manner in production. Non-production use of the software, such as with development and quality assurance pipelines, are allowed to be configured as highly available. Highly available deployments for production use are not allowed by this license. In the license, the things that you are not licensed to do are defined as an Excluded Purpose.

<details>
<summary>Excerpt: the exact language in the license</summary>

**1.2** For purposes of this Agreement, an “Excluded Purpose” is any use that is either a Competing Use or a Highly-Available Production Use, or both of them.

* **1.2.1** A “Competing Use” is making available any on-premises or distributed software product, or any software-as-a-service, platform-as-a-service, infrastructure-as-a-service, or other similar online service, that competes with any products or services that Snowplow or any of its affiliates provides using the Software.

* **1.2.2** Highly-Available Production Use is any highly-available use, including without limitation any use where multiple instances of any Software component run concurrently to avoid a single point of failure, in a production environment, where production means use on live data.

</details>

For example, this does not allow the hosting of the Snowplow Collector component, or other software licensed under the Snowplow Limited Use License Agreement, to be run redundantly, either in virtual machines, containers, or pods. With this license you are only allowed to run the Snowplow software in a production deployment in a non-highly-available manner.

If you are not doing what is excluded, this license change will not affect your current use.

## Is Snowplow moving away from open source?

```mdx-code-block
import MovingAway from '../_moving_away.md'
```

<MovingAway/>

## When do these license changes take effect?

The Snowplow Limited Use License Agreement (SLULA) will be rolled out to new releases of certain Snowplow components starting January 8, 2024.

## What components of Snowplow are offered under this new license?

See the [licensing overview](/docs/contributing/copyright-license/index.md) page.

## What does this mean for me?

If you currently run Snowplow’s open source pipeline code in a highly available-manner in production (on live data) or in a competitive manner, and wish to use versions of Snowplow released under the SLULA, please contact the team [here](https://snowplow.io/snowplow-oss-license-change/).

If you are a current user of Snowplow open source software but do not run the core pipeline code in production in a highly-available or competitive manner, you may continue to use new Snowplow Limited Use License Agreement versions of Snowplow.

If you are a commercial Snowplow BDP Enterprise or BDP Cloud customer, this license change does not impact your use of Snowplow.

## Can my company or I provide support to others who are running software under the Snowplow Limited Use License Agreement?

This license is not intended to stop you from providing professional services, such as development, installation, or support, to others who are running software under the Snowplow Limited Use License Agreement. Clients can engage you to do this work for them as long as they themselves are complying with our licenses. We do not consider this a competitive use.

## Can my company or I embed software under the Snowplow Limited Use License Agreement in the software I distribute?

Only the MIT/BSD and Apache 2 licensed software from Snowplow can be embedded and distributed. The Snowplow Limited Use License Agreement does not grant you rights to distribute software licensed under it. You do not have the right to distribute components licensed under the Snowplow Limited Use License Agreement as part of an on-premises deployed package, and you do not have the right to use them as Software-as-a-Service (SaaS), Platform-as-a-Service (PaaS), or Infrastructure-as-a-Service (IaaS).

## How can I contact Snowplow in case of doubts?

For any further questions on licensing of Snowplow software, please send us an email at [ip-portfolio@snowplow.io](mailto:ip-portfolio@snowplow.io).
