---
title: "Telemetry Principles"
date: "2021-07-09"
sidebar_position: 200
---

Telemetry can be a valuable way of understanding and tailoring our products to better meet your needs. It gives us some insight into which applications are being used, for how long and the topology of your pipeline so that we have a better understanding of where to invest our efforts going forward.

The below defines our principles on how we collect and use telemetry data. _We have only implemented telemetry into the open source Quick Start edition to date, and so the below applies to this version of open source only._

#### Privacy

We do not automatically collect any personally identifiable information other than the IP address of the computer where the terraform is running from. This IP address is subsequently pseudonymised using SHA-256 with the [Snowplow PII pseudonymization enrichment](/docs/migrated/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/).

The only other data point which could be PII is that which is explicitly provided by the user within the `user_provided_id` field. This field allows us to tie events together across resources so that we are able to get a more complete picture of how the pipeline has been orchestrated.

In general, other than those two data points, we track:

- Installation and usage data of the terraform modules, and the VMs an application is running on
- Terraform module and Snowplow application metadata such as versions, cloud and region

#### Right to be forgotten

If an email address has been provided as the `user_provided_id`, we will only ever contact you with Product & Engineering updates. In the case that you have provided a `user_provided_id` and you wish to submit a right to be forgotten request, please [let us know](https://snowplowanalytics.com/contact-us/).

#### Transparency

The [telemetry terraform module](https://github.com/snowplow-devops/terraform-snowplow-telemetry) is open source; you have the ability to inspect the code, understand to which Snowplow endpoint we are sending the data, and what we are capturing at all times. Any changes to the telemetry will be highlighted in the release notes for the module. You can subscribe to updates by watching the [/snowplow-devops/terraform-snowplow-telemetry](https://github.com/snowplow-devops/terraform-snowplow-telemetry) repo on github.

#### Control

Telemetry in the terraform modules (i.e. the quick start edition) is **opt-out**. We have not yet added telemetry to the Snowplow applications themselves, but when we do it will be opt-in. We will always be transparent about where telemetry has been added and provide documentation on how to disable it.

#### Minimalism

We only ever collect what is required at any given point in time. We do not pre-empt future requirements, or collect anything 'just in case'.
