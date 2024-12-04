---
title: "HubSpot"
date: "2020-08-10"
sidebar_position: 20
---

## Overview

This webhook adapter lets you track events logged by [HubSpot](https://www.hubspot.com/).

## Implementation

### Event source

The [HubSpot webhook API](https://developers.hubspot.com/docs/methods/webhooks/webhooks-overview) sends events as a JSON body in a `POST` request.

### Snowplow adapter

Implementation: HubSpotAdapter

HubSpot webhook support was implemented in [Snowplow R113](https://github.com/snowplow/snowplow/releases/tag/r113-filitosa).

## Events

All resources for this webhook's events:

| **Event**        | **JSON Schema**                                                                                                                       |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Company change   | [company_change 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/company_change/jsonschema/1-0-0)     |
| Company creation | [company_creation 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/company_creation/jsonschema/1-0-0) |
| Company deletion | [company_deletion 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/company_deletion/jsonschema/1-0-0) |
| Contact change   | [contact_change 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/contact_change/jsonschema/1-0-0)     |
| Contact creation | [contact_creation 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/contact_creation/jsonschema/1-0-0) |
| Contact deletion | [contact_deletion 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/contact_deletion/jsonschema/1-0-0) |
| Deal change      | [deal_change 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/deal_change/jsonschema/1-0-0)           |
| Deal creation    | [deal_creation 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/deal_creation/jsonschema/1-0-0)       |
| Deal deletion    | [deal_deletion 1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.hubspot/deal_deletion/jsonschema/1-0-0)       |

Iglu HubSpot definitions

## Setup

The webhook address can be found here on [official HubSpot documentation](https://developers.hubspot.com/docs/methods/webhooks/webhooks-overview).

The endpoint should be:

```markup
http://<collector host>/com.hubspot/v1
```
