# FAQ: Snowplow Limited Use License Agreement (SLULA)

:::info Note

This FAQ is not a substitute for reading the license text:

* [version 1.0](/limited-use-license-1.0/)
* [version 1.1](/limited-use-license-1.1/)

:::

## Why was the Snowplow Limited Use License Agreement introduced?

Previously, many of our Snowplow core pipeline components and dbt models were licensed as open source under the Apache 2.0 license. For more than a decade, our team has invested significant time and resources into researching, developing, and maintaining this code in an open source manner.

Looking forward, we have an exciting technology roadmap that will deliver additional value to all of our core pipeline users. It includes plans to reduce the cost of running the pipeline at scale, improve processing speed, provide more flexibility for custom in-stream processing steps, and support non-HTTP protocols for more efficient data ingestion from server-side and mobile devices. In order to fund these developments, we are asking Snowplow users who are running the Snowplow behavioral data pipeline in production to pay for the value they receive in return.

## What is the Snowplow Limited Use License Agreement?

Snowplow is moving new versions of the Snowplow pipeline components to a source-available license. This license is based on the [Snowplow Community License](/docs/resources/community-license-faq/index.md), with additional deployment and provisioning restrictions. Notably, this license includes restrictions that prohibit deploying the Snowplow software for production workloads.

## How does the Snowplow Limited Use License Agreement work in practice?

Under the Snowplow Limited Use License Agreement, you can access the source code and modify it, but you cannot distribute it or use it to make a competing SaaS or on-premises offering. Nor can you deploy the Snowplow software in production. Non-production use of the software, such as with development and quality assurance pipelines, are allowed.

<details>
<summary>Excerpt: the exact language in the license</summary>

Licensee is not granted the right to, and Licensee shall not, exercise the License for any Competing Use, and Licensee may exercise the License only for Non-Production Use or Non-Commercial Use.

* “Competing Use” is making available any on-premises or distributed software product, or any software-as-a-service, platform-as-a-service, infrastructure-as-a-service, or other similar online service, that competes with any products or services that Snowplow or any of its affiliates provides using the Software.

* “Non-Production Use” means any use of the Software to process test or synthetic data to evaluate the sufficiency of the Software for use by Licensee.

* “Non-Commercial Use” is only: (a) personal use for research, experiment, personal study, or hobby projects, without any anticipated commercial application, or (b) use for teaching purposes by lecturers of a school or university.

</details>

If you are not doing what is excluded, this license change will not affect your current use.

## Is Snowplow moving away from open source?

```mdx-code-block
import MovingAway from '../_moving_away.md'
```

<MovingAway/>

## When do these license changes take effect?

The Snowplow Limited Use License Agreement (SLULA) version 1.0 was rolled out in January, 2024. Version 1.1 is rolled out in December, 2024.

## What changed in version 1.1?

The Snowplow Limited Use License v1.1 (SLULA v1.1) simplifies the terms of acceptable use. It allows you to run SLULA-licensed software in test environments or for academic or research purposes. It does not allow you to run in production or commercial environments. To run in these environments you must obtain a commercial license from Snowplow.

This change does not take away your rights under SLULA 1.0, for versions that were released under that license.

### Summary of changes

Here is a summary of the specific changes in SLULA v1.1 over the v1.0 license:

* Section 1.1 was updated to clarify acceptable use as “Non-Production” or “Non-Commercial” use only
* Section 1.2 and its subsections were replaced completely. We have removed the “Highly Available” provision in the v1.0 license. If you are running the software in production in either a non-highly available or highly available manner, you must obtain a commercial license
* Section 1.2.2 now defines the definitions of “Non-Production Use”. You may use the software on test or synthetic data in a non-commercial manner
* Section 1.2.3, a new section, now defines “Non-Commercial Use”, which includes research, experimentation, personal study or hobby projects with no anticipated commercial application

## What components of Snowplow are offered under this new license?

See the [licensing overview](/docs/resources/copyright-license/index.md) page.

## What does this mean for me?

If you currently run Snowplow’s open source pipeline code in production (on live data) or in a competitive manner, and wish to use versions of Snowplow released under the SLULA, please contact the team [here](https://snowplow.io/snowplow-oss-license-change/).

If you are a current user of Snowplow open source software but do not run the core pipeline code in production or in a competitive manner, you may continue to use new Snowplow Limited Use License Agreement versions of Snowplow.

If you are a commercial Snowplow Enterprise or Snowplow Cloud customer, this license change does not impact your use of Snowplow.

### Examples

Here are some examples what is or is not acceptable under the terms of the SLULA license version 1.1.

#### Allowed

* I want to download and deploy Snowplow internally in either single point of failure (SPOF) or highly available (HA) manner, and run synthetic data through it, for example for product evaluation or load testing purposes
* I want to download the Snowplow software and do research on it (university, hobby, etc), replaying old (real) data, or synthetic data through the pipeline
* I want to download and deploy in a Highly Available (HA) or Single Point of Failure (SPOF) manner Snowplow and publicly expose the pipeline to the internet, capturing events from my personal non-commercial website

#### Not allowed. Requires a commercial license

* I want to download and deploy in a HA or SPOF manner Snowplow and publicly expose the pipeline to the internet, capturing events from my personal website where I have a hobby business selling photos or art or crafts for my ‘side hustle’
* I want to download and deploy in a HA or SPOF manner Snowplow and publicly expose the pipeline to the internet, capturing events from my company website or mobile app.
* I want to download and deploy in a HA or SPOF manner Snowplow and publicly expose the pipeline to the internet, capturing events from my company website or mobile app to test if Snowplow can handle the event volume for my company on live data

## Can my company or I provide support to others who are running software under the Snowplow Limited Use License Agreement?

This license is not intended to stop you from providing professional services, such as development, installation, or support, to others who are running software under the Snowplow Limited Use License Agreement. Clients can engage you to do this work for them as long as they themselves are complying with our licenses. We do not consider this a competitive use.

## Can my company or I embed software under the Snowplow Limited Use License Agreement in the software I distribute?

Only the MIT/BSD and Apache 2 licensed software from Snowplow can be embedded and distributed. The Snowplow Limited Use License Agreement does not grant you rights to distribute software licensed under it. You do not have the right to distribute components licensed under the Snowplow Limited Use License Agreement as part of an on-premises deployed package, and you do not have the right to use them as Software-as-a-Service (SaaS), Platform-as-a-Service (PaaS), or Infrastructure-as-a-Service (IaaS).

## How can I contact Snowplow in case of doubts?

For any further questions on licensing of Snowplow software, please send us an email at [ip-portfolio@snowplow.io](mailto:ip-portfolio@snowplow.io).
