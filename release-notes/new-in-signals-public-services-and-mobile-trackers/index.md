---
title: "New in Signals: read attributes from websites and apps, and Signals in the mobile trackers"
sidebar_label: "Public services and mobile tracker support"
description: "Public Signals services can be read directly from a website or app without an API token, and the iOS and Android trackers can now read attributes and receive interventions."
keywords: ["snowplow signals", "public services", "mobile trackers", "interventions", "release notes"]
date: "2026-11-08"
category:
  - "Release notes"
components:
  - "Signals"
  - "Trackers"
---
Your websites and apps can now read Signals attributes directly, without an API token or a backend to proxy the request.

### Public services

A service now has an access mode. Services are `authenticated` by default, and need an API token to read, as before. A service with the `public` access mode can also be read without a token, for one UUID identifier at a time, such as the current user's `domain_userid`. Set the access mode in Console, where public services are marked with a **Public** badge, or with the Python SDK.

Anyone who has an identifier can read a public service's attributes for it, so only include attributes that are safe to show to the user they describe. See [Read attributes from websites and apps](/docs/signals/applications/public-services/).

### Browser plugin

The Signals browser plugin adds `getServiceAttributes()`, which reads a public service for the tracker's `domain_userid` by default.

### Signals in the iOS and Android trackers

The iOS and Android trackers add a Signals controller, `tracker.signals`, configured with `SignalsConfiguration`. It reads public services and subscribes to interventions for the current app user and session, and tracks the same intervention events as the browser plugin. See [Use Signals attributes and interventions in your app](/docs/sources/mobile-trackers/signals/).

### Built-in attribute keys for mobile apps

Two new built-in attribute keys, `client_session_user_id` and `client_session_session_id`, read the user and session IDs from the mobile trackers' session entity. Use them to calculate attributes and target interventions for mobile apps. See [Attribute keys](/docs/signals/attributes/attribute-keys/).
