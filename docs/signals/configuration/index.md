---
title: "Configuring Signals"
sidebar_position: 20
sidebar_label: "Defining attributes"
---

There are three methods for defining attributes and interventions in Signals:
* BDP Console UI
* Signals Python SDK
* Signals API

## Setting up a new connection

If you're new to Signals, you'll need to set up a Signals connection. Log in to [Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section.

<!-- TODO image initial landing page no deployment -->

Click **Enable** to start setting up a Signals connection. You'll need to provide your warehouse account details.

<!-- TODO image setup page -->

Click **Test and create connection** to trigger the Signals deployment. You'll be able to start using Signals as soon as the infrastructure is ready.

## Snowplow BDP Console

To use the UI to manage Signals, log in to [Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section.

Use the configuration interface to define [attribute groups](/docs/signals/configuration/attribute-groups/index.md), [services](/docs/signals/configuration/services/index.md), and [interventions](/docs/signals/configuration/interventions/index.md).

<!-- TODO image initial landing page -->

## Signals Python SDK

Use the [Signals Python SDK](https://github.com/snowplow-incubator/snowplow-signals-sdk) to define attribute groups, services, and interventions via code. Check out the [SDK configuration section](/docs/signals/configuration/using-python-sdk/index.md) for instructions.

## Signals API

The Signals API allows you to manually configure attributes and interventions. To access the full Swagger API documentation for your Signals deployment, use your Signals API URL followed by `/docs/`:

```bash
{{API_URL}}/docs/
```

Your Signals API URL will be available within Console once you've deployed Signals.

## Example use cases

Check out the Signals tutorials:
* [Quick Start](/tutorials/signals-quickstart/start) for defining stream attributes using the UI or the Python SDK
* [Real-time prospect scoring with ML](/tutorials/signals-ml-prospect-scoring/intro) solution accelerator uses the Python SDK
