---
position: 6
title: Conclusion
description: "Complete the Signals Sandbox tutorial and explore next steps for real-time personalization."
---

Congratulations! You've successfully completed the Signals Sandbox tutorial and experienced real-time personalization in action.

## What you've accomplished

In this tutorial, you:

* Deployed a Signals Sandbox instance
* Used the Signals Python SDK to programmatically define attributes
* Created a service to expose calculated attributes
* Defined rule-based interventions for common e-commerce scenarios
* Tested your configuration with an interactive demo application
* Saw real-time personalization triggered by actual user behavior

## Key concepts

You've worked with the core Signals concepts:

* **[Attributes](/docs/signals/define-attributes/attributes/)**: real-time calculations of user behavior patterns
* **[Attribute groups](/docs/signals/define-attributes/attribute-groups/)**: organized collections of related attributes
* **[Services](/docs/signals/define-attributes/services/)**: interfaces for applications to retrieve attributes
* **[Interventions](/docs/signals/define-interventions/)**: rules that trigger personalized experiences

## Next steps

Now that you understand how Signals works, here are some ways to continue your journey:

### Explore more Signals capabilities

* Try defining attributes with different [aggregations](/docs/signals/define-attributes/attributes/#aggregation-options) (min, max, average, etc.)
* Experiment with [time windows](/docs/signals/define-attributes/attributes/#time-period) for attributes
* Create more complex intervention criteria using multiple attributes
* Define attributes based on different [event types](/docs/fundamentals/events/)

### Try other tutorials

* [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start) using the Snowplow Console UI
* [Score prospects in real time using Signals and ML](/tutorials/signals-ml-prospect-scoring/intro) for machine learning integration
* [Set up the Signals batch engine](/tutorials/signals-batch-engine/start) for warehouse-based attribute calculation

### Move to production

Ready to use Signals in production? You'll need:

* A [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/) account
* A [Signals connection](/docs/signals/connection/) configured
* Integration of the [browser tracker plugin](/docs/signals/receive-interventions/#using-the-browser-tracker-plugin) or API calls in your application

### Learn more

* Read the full [Signals documentation](/docs/signals/)
* Explore the [Signals Python SDK reference](https://pypi.org/project/snowplow-signals/)
* Join the [Snowplow community](https://discourse.snowplow.io/) to discuss use cases and best practices

## Sandbox limitations

Remember that the Signals Sandbox is designed for exploration and learning:

* Sandbox instances are temporary and will be deleted after some period
* Data is not persisted long-term
* Performance and rate limits apply
* For production use cases, use Snowplow BDP with Signals

Thank you for trying Signals! We hope this tutorial has inspired ideas for how you can use real-time behavioral data to create personalized experiences for your users.
