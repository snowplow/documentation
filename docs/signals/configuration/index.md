---
title: "Configuring Signals"
sidebar_position: 20
sidebar_label: "Configuration"
---

You can configure Signals attributes using the BDP Console (recommended), or programmatically using the Python SDK or Signals API.

By default, Signals calculates attributes in real time, in stream. Check out the [quick start tutorial](/tutorials/signals-quickstart/start) to get started.

## Using BDP Console (recommended)

The easiest way to configure Signals is through the [BDP Console](https://console.snowplowanalytics.com) interface. This provides a visual way to define attributes, attribute groups, and manage your Signals configuration without writing code.

1. Log in to [Console](https://console.snowplowanalytics.com)
2. Navigate to the **Signals** section
3. Use the configuration interface to define [attribute groups](/docs/signals/configuration/attribute-groups/index.md), [services](/docs/signals/configuration/services/index.md), and [interventions](/docs/signals/interventions/index.md)

<!-- TODO image landing page with deployment, shows credentials -->

### Setting up Signals

If you're new to Signals, you'll need to set up a Signals connection. Log in to [Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section.

<!-- TODO image initial landing page no deployment -->

Click **Enable** to start setting up a Signals connection. You'll need to provide your warehouse account details.

<!-- TODO image initial landing page no deployment -->

Click **Test and create connection** to trigger the Signals deployment. You'll be able to start using Signals as soon as the infrastructure is ready.

## Programmatic configuration

We recommend against choosing this route, especially for production use. The Console UI will help you safely configure your Signals deployment.

### Signals Python SDK

For programmatic configuration, you can use the [Signals Python SDK](https://github.com/snowplow-incubator/snowplow-signals-sdk) to define attribute groups, services, and interventions via code. Check out the [SDK configuration section](/docs/signals/configuration/using-python-sdk/index.md) for instructions.

### Signals API

The Signals API allows you to manually configure and retrieve attributes and interventions. To access the full Swagger API documentation for your Signals deployment, use your Signals API URL followed by `/docs/`:

```bash
{{API_URL}}/docs/
```

Your Signals API URL will be available within Console once you've deployed Signals.

## Example use cases

Check out the Signals tutorials:
* [Quick Start](/tutorials/signals-quickstart/start) for defining stream attributes
* [Real-time prospect scoring with ML](/tutorials/signals-ml-prospect-scoring/intro) solution accelerator
