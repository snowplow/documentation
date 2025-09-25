---
title: Real-time Integration
position: 7
---

Having recommendations being served on site and influencing behaviour, the next step is to give AWS Personalize a feed of events as they occur so it can keep up to date with its suggestions.

To do this, utilize Snowbridge to intercept events coming from the site, and send them to AWS Personalize.

While Snowbridge has support for making requests to HTTP APIs, it unfortunately isn't sophisticated enough to do the authentication required to send events to an AWS API, so the AWS Lambda function should be adjusted to do that part, and just have Snowbridge send the events to it.

Start with a Snowbridge configuration to filter our events and do some simple transforms:

```hcl
transform {
  use "spEnrichedFilter" {
    atomic_field = "event_name"
    regex = "^(snowplow_ecommerce_action|action|view_item|transaction_item|create_order)$" # filter to only ecommerce events you're interested in
    filter_action = "keep"
  }
}

transform {
  use "js" {
    script_path = "/tmp/transform.js" # use a custom JS transform on the payload; not all ecommerce events can be filtered by just `event_name` so more checks are needed there
    snowplow_mode = true # turn the TSV record into JSON for our transform function to handle
  }
}

target {
  use "http" {
    url = "https://your-lambda-instance.execute-api.your-aws-region.amazonaws.com/interaction/recommendations_demo_dsg_ecommerce" # this is the dataset group name
    content_type = "application/json"
    basic_auth_username = "snowbridge"
    basic_auth_password = ">_-G6xdYDjU?O4NXGpc4" # use a password to prevent abuse and false event submission
  }
}
```

This configuration requires a `transform.js` file that will describe how to translate different e-commerce events into interactions AWS Personaize is expecting:

```js
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
  if (typeof ep.Data === "string") return SKIP_EVENT; // should be in snowplow_mode

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

Snowbridge will:
- Filter the event stream to ecommerce events
- Transform them into a common format
- Send it to your AWS Lambda

The Lambda will then:
- Submit the interaction to AWS Personalize as a real-time event

This allows AWS Personalize to react to new behaviour, and it will periodically retrain itself and adjust its models to accomodate the newer observations.