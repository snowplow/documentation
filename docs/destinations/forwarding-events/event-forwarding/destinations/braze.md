---
title: "Braze"
sidebar_position: 10
---

Send Snowplow events to Braze for real-time personalization, user tracking, and campaign automation using the [Track Users API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track).

## API and authentication

Event Forwarding supports the following Braze object types:

- **[User attributes](https://www.braze.com/docs/api/objects_filters/user_attributes_object)**: Profile data and custom user properties
- **[Custom events](https://www.braze.com/docs/api/objects_filters/event_object)**: User actions and behaviors
- **[Purchases](https://www.braze.com/docs/api/objects_filters/purchase_object)**: Transaction data with product details

### Prerequisites

Before setting up the forwarder, ensure you have these requirements:

- **Braze REST API key** with these permissions:
  - `users.track`
  - `users.alias.new`
  - `users.identify`
  - `users.export.ids`
  - `users.merge`
  - `users.external_ids.rename`
  - `users.alias.update`
- **Braze REST API endpoint** – found in Braze under **Settings** > **APIs and Identifiers**

## Setup steps

### 1. Create a connection

1. In Console, navigate to **Destinations** > **Connections**
2. Select **Set up connection**
3. Choose **Loader connection**, then **Braze**
4. Enter your API key and endpoint
5. Select **Confirm** to deploy the connection

### 2. Create the forwarder

1. Navigate to **Destinations** > **Destination list**
2. Go to **Available** tab, filter for **SaaS applications**
3. Select **Configure** under Braze
4. Choose your pipeline and Braze connection
5. Select **Enriched events** as the event type
6. Choose from these Braze object types:
   - **Attributes**: User profile data
   - **Events**: Custom user actions
   - **Purchases**: Transaction events

### 3. Configure filtering and mapping

**Event filtering**: Use JavaScript expressions to select which events to forward. For example:
```javascript
// Forward page views from website
event.app_id == "website" && event.event == "page_view"

// Forward custom events
event.event_name == "add_to_cart" || event.event_name == "purchase"
```

**Field mapping**: Configure how Snowplow data maps to Braze fields using the default mappings or custom expressions.

:::info
To learn more about the supported filter and mapping expressions, check out the [Filter and mapping reference](/docs/destinations/forwarding-events/event-forwarding/reference.md).
:::

### 4. Deploy and validate

Select **Deploy** to create the forwarder. This will deploy the underlying Snowbridge instance to your cloud account and begin forwarding events based on your configuration.

You can confirm events are reaching Braze using these methods:

1. **Braze Custom Events Report**: Braze > **Analytics** > **Custom Events Report**
<!-- TODO: add screenshot -->
2. **Braze API Usage Dashboard**: Braze > **Settings** > **API and Identifiers**
<!-- TODO: add screenshot -->

## Default field mappings


| Field | Details |
|-------|---------|
| **field_name** `string` | _Required._ Brief description of what this field represents<br />**Default:** N/A |
| **email** `string` | _Required._ User's email address for authentication<br />**Default:** N/A |
| **age** `integer` | _Optional._ User's age in years<br />**Default:** `null` |
| **is_active** `boolean` | _Optional._ Whether the user account is currently active<br />**Default:** `true` |

### User attributes

| Braze field | Default mapping | Description |
|-------------|-----------------|-------------|
| `external_id` | `event.domain_userid` | Primary user identifier |
| `user_alias` | `event.user_id` | Alternative user identifier |
| `email` | `event.contexts_com_snowplowanalytics_snowplow_client_session_1?.[0]?.email` | User email address |
| `first_name` | Custom mapping required | User's first name |
| `last_name` | Custom mapping required | User's last name |

### Custom events

| Braze field | Default mapping | Description |
|-------------|-----------------|-------------|
| `external_id` | `event.domain_userid` | User identifier |
| `name` | `event.event_name` | Event name |
| `time` | `event.collector_tstamp` | Event timestamp |
| `properties` | Custom mapping | Event-specific data |

### Purchases

| Braze field | Default mapping | Description |
|-------------|-----------------|-------------|
| `external_id` | `event.domain_userid` | User identifier |
| `product_id` | Custom mapping required | Product identifier |
| `currency` | `event.tr_currency` | Transaction currency |
| `price` | `event.tr_total` | Purchase price |
| `quantity` | Custom mapping required | Number of items |
| `time` | `event.collector_tstamp` | Purchase timestamp |


<!-- TODO: Add troubleshooting steps when feedback is received -->