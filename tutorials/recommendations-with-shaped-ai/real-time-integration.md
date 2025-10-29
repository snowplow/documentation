---
title: Real-time Integration
position: 6
---

Now that we have recommendations appearing on site and influencing behavior, we want to give Shaped.ai a feed of events as they occur so it can keep up to date with its suggestions.

To do this, we'll utilize Snowbridge to intercept events coming from the site, and send them to Shaped.ai. [Shaped.ai receives our Snowbridge events through AWS Kinesis](https://docs.shaped.ai/docs/connectors/snowplow), either using Snowbridge or using Custom Kinesis Forwarding, so the Kinesis connector should be configured beforehand. The best way to request this is [through their Slack server](https://docs.shaped.ai/docs/support/contact/), but email requests also work.

## Kinesis Connector Creation Flow

When contacting Shaped.ai team, make sure the have your AWS Account ID ready. After providing the information, Shaped.ai team will give you AWS Kinesis credentials, that will be used by Snowplow team to configure Snowbridge. They look like this:

```
"kinesisStreamArn": "arn:aws:kinesis:us-east-2:1234567890:stream/ShapedDatasetStream-1234567890e3fad47fa8eabf03a4",
"kinesisIamRoleArn": "arn:aws:iam::1234567890:role/ShapedDatasetAccessRole-1234567890e3fad47fa8eabf03a4",
```

Open a ticket with Snowplow support, providing these credentials, and additional pieces of information, as follows:

- All payloads should be sent as JSON, not as TSV (the default);
- Not all the events should be sent. We will need to filter events to use only events with an `item_ids` property defined. To do this in Snowbridge, we will need to apply a specific configuration, that filters the event we will forward, as well as JS transform that will check if our events have the fundamental pieces of information to be forwarded. The configuration is a HCL file (normally named `config.hcl`), and its contents are like this one below:

```hcl
transform {
  use "spEnrichedFilter" {
    atomic_field = "event_name"
    regex = "^(snowplow_ecommerce_action|action|view_item|transaction_item|create_order)$" # filter to only ecommerce events we're interested in
    filter_action = "keep"
  }
}

transform {
  use "js" {
    script_path = "/tmp/transform.js" # use a custom JS transform on the payload; not all ecommerce events can be filtered by just event_name so we need to do more checks there
    snowplow_mode = true # turn the TSV record into JSON for our transform function to handle
  }
}
```

And we use the following as `transform.js` (it is more complicated than required because it accounts for different ecommerce plugins):
```javascript
/**
 * @typedef {object} EngineProtocol
 * @property {boolean} [FilterOut]
 * @property {string} [PartitionKey]
 * @property {string | object} [Data]
 * @property {Record<string, string>} [HTTPHeaders]
 */

const SKIP_EVENT = { FilterOut: true };

/**
 * @param {EngineProtocol} ep
 * @returns {EngineProtocol}
 */
function main(ep) {
  if (typeof ep.Data === "string") return SKIP_EVENT; // we should be in snowplow_mode

  const event = ep.Data;

  const ts = (event.derived_tstamp || event.collector_tstamp).UnixMilli();

  const client_session = (event.contexts_com_snowplowanalytics_snowplow_client_session_1 || [])[0] || {};

  ep.Data = {
    event_id: event.event_id,
    event_type: "",
    user_id: event.user_id || event.domain_userid || client_session.userId,
    session_id: event.domain_sessionid || client_session.sessionId,
    item_ids: undefined,
    sent_at: ts,
  };

  let payload = undefined;
  let products = undefined;

  switch (event.event_name) {
    case 'transaction_item': // classic ecommerce
      ep.Data.event_type = "Purchase";
      ep.Data.item_ids = [event.ti_sku];
      break;
    case 'action': // enhanced ecommerce
      payload = event.unstruct_event_com_google_analytics_enhanced_ecommerce_action_1;
      products = event.contexts_com_google_analytics_enhanced_ecommerce_product_1;
      if (!payload || !payload.action || !products) return SKIP_EVENT;
      ep.Data.item_ids = products.map((i) => i.id);
      if (payload.action === "view") {
        ep.Data.event_type = "View";
      } else if (payload.action === "click") {
        ep.Data.event_type = "Click";
      } else if (payload.action === "purchase") {
        ep.Data.event_type = "Purchase";
      } else return SKIP_EVENT;
      break;
    case 'snowplow_ecommerce_action': // snowplow ecommerce
      payload = event.unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1;
      products = event.contexts_com_snowplowanalytics_snowplow_ecommerce_product_1;
      if (!payload || !payload.type || !products) return SKIP_EVENT;
      ep.Data.item_ids = products.map((i) => i.id);
      if (payload.type === "product_view") {
        ep.Data.event_type = "View";
      } else if (payload.type === "list_view") {
        ep.Data.event_type = "View"; // ???
      } else if (payload.type === "list_click") {
        ep.Data.event_type = "Click";
      } else if (payload.type === "transaction") {
        ep.Data.event_type = "Purchase";
      } else return SKIP_EVENT;
      break;
    case 'view_item': // hyper-t ecommerce
      payload = event.unstruct_event_io_snowplow_ecomm_view_item_1;
      if (!payload) return SKIP_EVENT;
      ep.Data.event_type = "View";
      ep.Data.item_ids = [payload.item_id];
      break;
    case 'create_order': // hyper-t ecommerce
      ep.Data.event_type = "Purchase";
      payload = event.contexts_io_snowplow_ecomm_cart_1;
      if (!payload || !payload.items_in_cart) return SKIP_EVENT;
      ep.Data.item_ids = payload.items_in_cart.map((i) => i.item_id);
      break;
    default:
      return SKIP_EVENT;
  }

  if (!ep.Data.item_ids || !ep.Data.event_type) return SKIP_EVENT;
  return ep;
}
```

Now Snowbridge will:
- Filter the event stream to ecommerce events
- Transform them into a common format
- Submit the interaction to Shaped.ai as a real-time event

This allows Shaped.ai to react to new behaviour, and it will periodically retrain itself and adjust its models to accomodate the newer observations.

### Merging Snowbridge Dataset with Previously Imported Datasets

Now, we need to merge the previously imported data with the live data provided by Snowbridge. The following YAML file not just unifies both datasets into a new one, as well as separates `item_ids` (sent by Snowbridge) into one event per item ID, per Shaped.ai's requirements:

```yml
model:
  description: A model to test Snowplow data integration with online and offline data.
  name: model_initial_data_plus_snowbridge
connectors:
  - id: recommendations_ecomm
    name: recommendations_ecomm
    type: Dataset
  - id: recommendations_ecomm_model_interactions
    name: recommendations_ecomm_model_interactions
    query: |
      SELECT
        DOMAIN_USERID as user_id,
        PRODUCT_ID as item_id,
        toDateTime(toInt64(DERIVED_TSTAMP) / 1000) as created_at,
        ECOMMERCE_ACTION_TYPE as event_value
      FROM recommendations_ecomm_model_interactions
    type: Dataset
  - id: interactions
    name: Snowplow
    query: |
      select distinct
        arrayJoin(
          splitByChar(',', translate(ifNull(item_ids, ''), '[]"', ''))
        ) AS item_id,
        domain_userid as user_id,
        event_name as event_value,
        dvce_created_tstamp as created_at
      from Snowplow
    type: Dataset
fetch:
  events: |
    SELECT
      user_id,
      item_id,
      created_at,
      1 AS label,  
      event_value
    FROM recommendations_ecomm_model_interactions

    UNION ALL

    SELECT
      user_id,
      item_id,
      created_at,
      1 AS label,  
      event_value
    FROM interactions
```

Using Shaped.ai CLI, and supposing the YAML above is saved in a file with the name `model_definition_initial_data_plus_snowbridge.yaml`, you can run the following command:

```
$ shaped create-model --file ./model_definition_initial_data_plus_snowbridge.yaml
```

Make sure to update your previous calls to Shaped.ai from `testing_snowplow_model` to `model_initial_data_plus_snowbridge`.