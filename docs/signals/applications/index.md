---
title: "Use Signals in your application"
sidebar_position: 30
sidebar_label: "Use in your application"
description: "Consume Signals in your applications by retrieving calculated attributes on demand, or by subscribing to interventions that push actions in real time."
keywords: ["retrieve attributes", "subscribe interventions", "signals sdk", "profiles store", "real-time personalization"]
date: "2026-06-11"
---

Once you've defined and published your [attributes](/docs/signals/attributes/index.md) and [interventions](/docs/signals/interventions/index.md), your applications can consume them in two ways:

* **Pull**: retrieve calculated attribute values from the Profiles Store on demand, for example, to personalize a page or provide context to a chatbot
* **Push**: subscribe to interventions, so that Signals notifies your application as soon as a user meets the trigger criteria

Both patterns require a [connection to Signals](/docs/signals/connection/index.md) using the Python SDK, Node.js SDK, browser plugin, or API.

This section covers:
* [Services](/docs/signals/applications/services/index.md): stable interfaces that group attribute group versions together for your applications, recommended for production use
* [Retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md): fetch calculated attribute values using a service or directly from an attribute group
* [Subscribe to interventions](/docs/signals/applications/subscribe/index.md): receive intervention payloads and react to them in your application
* [Create training datasets](/docs/signals/applications/create-training-datasets/index.md): create training datasets from Signals attributes
