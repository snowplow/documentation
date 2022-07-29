---
title: "Piinguin"
date: "2021-03-26"
sidebar_position: 1000
---

The piinguin and snowplow-piinguin-relay are intended to complete the PII handling functionality provided by [snowplow](https://github.com/snowplow/snowplow).

## Background

Following the release of [R106](https://snowplowanalytics.com/blog/2018/05/10/snowplow-r106-acropolis) which adds the capability to emit a stream of PII events, Snowplow wanted to continue leading the pack in terms of responsible PII management.

If you want to learn more about PII and how they are managed during Snowplow PII enrichment, you can read more in the release post for [R100](https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/) and [R106](https://snowplowanalytics.com/blog/2018/05/10/snowplow-r106-acropolis).

## Aims

Piinguin aims to complete the PII management system which starts with the PII enrichment in snowplow, by providing a service which stores PII and helps control access by requiring that anyone who reads PII data, provides a justification in the form of a [lawful basis for processing PII](https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/#ib3) specified under [GDPR](https://www.eugdpr.org/).

## Overview

The two components sit beside snowplow ans store and serve PII data. Here is a component overview:

The piinguin and snowplow-piinguin-relay are intended to complete the PII handling functionality provided by [snowplow](https://github.com/snowplow/snowplow).

## Background

Following the release of [R106](https://snowplowanalytics.com/blog/2018/05/10/snowplow-r106-acropolis) which adds the capability to emit a stream of PII events, Snowplow wanted to continue leading the pack in terms of responsible PII management.

If you want to learn more about PII and how they are managed during Snowplow PII enrichment, you can read more in the release post for [R100](https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/) and [R106](https://snowplowanalytics.com/blog/2018/05/10/snowplow-r106-acropolis).

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/03/piinguin-diagram.png?w=1024)

## Processing steps in order

### Piignuin Relay

The first component that receives that data out of the stream is the Piinguin Relay. That is simply an AWS Lambda function which uses the piinguin-client artifact from piinguin to send data to piinguin. You can read more details about this project in [piinguin technical documentation](/docs/migrated/pipeline-components-and-applications/piinguin/piinguin-technical-documentation/) and detailed instructions on how to install and run it under [setting up piinguin](/docs/migrated/pipeline-components-and-applications/piinguin/setting-up-piinguin/).

### Piinguin Server

The second component is the piinguin-server itself which has to be in the same secure VPC as the Lambda function. In addition it needs to have access to an AWS Dynamo DB table to store the data. You can read more details about this project in [piinguin technical documentation](/docs/migrated/pipeline-components-and-applications/piinguin/piinguin-technical-documentation/) and detailed instructions on how to install and run it under [setting up piinguin](/docs/migrated/pipeline-components-and-applications/piinguin/setting-up-piinguin/).

### Piinguin client(s)

There is also another component named "piinguin-client" this refers to your own code in which you have made use of either the piinguin-client artifact or another implementation based on the GRPC protocol provided in piinguin. More detail on that under [piinguin technical documentation](http://piin).
