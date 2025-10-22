---
title: Impression Integration
position: 7
---

To "close the loop" and allow Shaped.ai to improve the performance of it's recommendations, we need to feed it back information about how they perform.

We want it to know which of its recommendations actually got clicked so it can account for that in its models and optimize the performance of individual recommendations.

For this to work, we need to track the recommendation IDs and clicks of the widgets we render based on its suggestions.

To do this, we need several adjustments to what we've built so far. We need to change:

- The site tracking to track the clicks (we will also track impressions generally so we can track performance)
- The Snowbridge config to account for the click events

## Tracking Impressions

First up we update our recommendation widget snippet to track the impressions and clicks.

We will use the [Element Tracking plugin](https://github.com/snowplow/snowplow-javascript-tracker/pull/1400) to implement this.

```javascript
snowplow("addPlugin", "/cdn/shop/t/3/assets/element-tracker.umd.min.js", ["snowplowElementTracking", "SnowplowElementTrackingPlugin"]);

// set up impression tracking
snowplow("startElementTracking", {
  elements: {
    name: "recommendation-impression", // name our configuration something logical
    selector: "[data-recommendation-id]", // selector will vary based on the widget implementation
    expose: { when: "element", minPercentage: .5 }, // once per widget, only once it is 50% in view
    component: true, // mark it as a component so we can get clicks
    details: { dataset: ["recommendationId"] }, // extract the recommendation ID
    contents: {
      name: "recomendation-item",
      selector: "[data-item-id]",
      details: { dataset: ["itemId"] } // also extract the shown item IDs
    }
  }
});

// set up click tracking
snowplow("getComponentListGenerator", function (_, componentGeneratorWithDetail) {
  document.addEventListener("click", function(e) {
    if (e.target.closest("a") && e.target.closest("[data-recommendation-id]")) {
      const target = e.target.closest("a");
      const details = componentGeneratorWithDetail(target);
      snowplow("trackLinkClick", { element: target, context: details });
    }
  }, false);
});
```

With this configuration, whenever our custom recommendations widget is in-view, we will fire an `expose_element` event like the following:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/expose_element/jsonschema/1-0-0",
  "data": {
    "element_name": "recommendation-impression"
  }
}
```

This event will have an `element` entity describing our widget, including the recommendation/impression ID, like so:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0","data": {
    "element_name": "recommendation-impression",
    "width": 1600,
    "height": 229.4166717529297,
    "position_x": 160,
    "position_y": 531.5,
    "doc_position_x": 160,
    "doc_position_y": 3329,
    "element_index": 1,
    "element_matches": 1,
    "originating_page_view": "3d775590-74c6-4d0a-85ee-4d63d72bda2d",
    "attributes":[
      {
        "source": "dataset",
        "attribute": "recommendationId","value": "RID-24-4a6a-8380-506b189ff622-CID-529b19"
      }
    ]
  }
}
```

And it will also contain `element_content` entities for each item in the widget, capturing their product IDs, like the following:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0",
  "data": {
    "element_name": "recomendation-item",
    "parent_name": "recommendation-impression",
    "parent_position": 1,
    "position": 1,
    "attributes": [
      {
        "source": "dataset",
        "attribute": "itemId",
        "value": "48538191331628"
      }
    ]
  }
}
```

In addition, if the links in the widget are clicked, we'll generate a regular `link_click` event -- but because our widget is defined as a component, it will extract the same entities as an impression and include those, too.

These `link_click` events are what we need to detect and forward to Shaped.ai.

## Snowbridge Impressions and Clicks

Now that we need to know about `link_click`, we need to include those in our filter:

```hcl
    regex = "^(snowplow_ecommerce_action|action|view_item|transaction_item|create_order)$" # before

    regex = "^(snowplow_ecommerce_action|action|view_item|transaction_item|create_order|link_click)$" # after
```

Our custom transform then needs to be aware of them:

```javascript
    case 'link_click': // recommendation clicks
      ep.Data.event_type = "Click";

      const element = event.contexts_com_snowplowanalytics_snowplow_element_1 || [];
      const content = event.contexts_com_snowplowanalytics_snowplow_element_content_1 || [];

      if (!element.length) return SKIP_EVENT; // unrelated link_click
      if (!content.length) return SKIP_EVENT; // unrelated link_click

      let impressionId = null;

      element.forEach((e) => {
        if (e.element_name !== "recommendation-impression") return; // some other element/component
        if (e.attributes) {
          e.attributes.forEach((a) => {
            if (a.source === "dataset" && a.attribute === "recommendationId") {
              impressionId = a.value;
            }
          });
        }
      });

      if (!impressionId) return SKIP_EVENT; // couldn't find impression info

      const items = [];

      content.forEach((ec) => {
        if (ec.parent_name !== "recommendation-impression") return;
        items.push(ec.attributes[0].value);
      });
      
      ep.Data.item_ids = items; // for simplicity we will pretend the first item was the clicked one
      ep.Data.impression_id = impressionId;
      break;
    default:
      return SKIP_EVENT;
```

Snowbridge will now send our clicked recommendation events to Shaped.ai.

Shaped.ai will now be able to optimize its recommendations based on how they perform.
