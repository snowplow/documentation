---
position: 2
title: Tracking Setup
---

## Initialize Snowplow JavaScript Tracker

To begin, we will set up Snowplow tracking on your eCommerce website. We assume that you already have a Snowplow pipeline. Please refer to the [Introduction](/tutorials/abandoned-browse-ccdp/installation) for more information on the different options. 

![website](images/retl-shopfront.png)

First, initialize the Snowplow JavaScript tracker. Below is an example of how to set up the tracker:

```javascript
; (function (p, l, o, w, i, n, g) {
  if (!p[i]) {
    p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
    p.GlobalSnowplowNamespace.push(i); p[i] = function () {
      (p[i].q = p[i].q || []).push(arguments)
    }; p[i].q = p[i].q || []; n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1;
    n.src = w; g.parentNode.insertBefore(n, g)
  }
}(window, document, "script", "https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@latest/dist/sp.lite.js", "snowplow"));

// Replace with your collector URL
var collector = "yourcollector.site.com";

window.snowplow('newTracker', 'trackerName', collector, {
  encodeBase64: false,
  appId: 'eCommerceDemo',
  platform: 'web',
  contexts: {
    webPage: true,
    performanceTiming: true
  }
});

// Add ecommerce accelerator plugin
window.snowplow(
  'addPlugin',
  'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@latest/dist/index.umd.min.js',
  ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']
);
```

### Track User Engagement Time

Use the `enableActivityTracking` function to calculate the time the user is actively engaged on the page:
- **minimumVisitLength**: The minimum time (in seconds) a user must stay on the page before tracking starts.
- **heartbeatDelay**: The interval (in seconds) at which activity pings are sent.

If you change these parameters, make sure to update the values in the [Data Modeling](./data-modeling.md#identifying-most-viewed-but-not-added-to-cart-products) step. This event must be called before the `trackPageView` function.

```javascript
snowplow('enableActivityTracking', {
  minimumVisitLength: 5,
  heartbeatDelay: 5
});
```

### Track Page Views with the Product Context

After setting up activity tracking, implement the page view tracking with enhanced e-commerce context:

```javascript
var floatPrice = parseFloat({{productPrice}});

snowplow('trackPageView', {
  context: [{
    schema: "iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0",
    data: {
      id: {{productId}},
      name: {{productName}},
      brand: {{productBrand}},
      category: {{productCategory}},
      price: floatPrice,
      currency: {{currency}},
      variant: {{productVariantTitle}}
    }
  }]
});
```

### Track "Add to Cart" Events

After tracking page views, you can track "add to cart" events. Below is an example implementation:

```javascript
var floatPrice = parseFloat({{productPrice}});
var currentCartValue = parseFloat({{cartTotalValue}});
var newTotalValue = floatPrice + currentCartValue;

var product = [{
  "id": {{productId}},
  "name": {{productName}},
  "price": floatPrice,
  "brand": {{productBrand}},
  "currency": {{currency}},
  "category": {{productCategory}},
  "variant": {{productVariantTitle}}
}];

window.snowplow("trackAddToCart", { 
  products: product, 
  total_value: newTotalValue, 
  currency: {{currency}} 
});
```

### Explanation of "Add to Cart" Parameters

- **id**: The unique identifier for the product.
- **name**: The product's name.
- **price**: The product's price as a floating-point number.
- **brand**: The brand associated with the product.
- **currency**: The currency code (e.g., USD, EUR).
- **category**: The product's category or taxonomy.
- **variant**: The product variant (if applicable).
- **total_value**: The updated total cart value after adding the product.

## Test your tracking
To verify your tracking implementation, use the [Snowplow Chrome Extension](https://chrome.google.com/webstore/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm). This extension allows you to inspect Snowplow events in real-time as they are sent from your website. Navigate to your product pages and add items to cart while monitoring the extension to ensure events are firing correctly with all expected parameters. The extension will show you the full event payload including all contexts and properties, making it easy to debug your implementation.


## Next Step

With this implementation, you have page view, time spent, and add to cart tracking. If you want to add more eCommerce tracking, please refer to the [Snowplow Ecommerce Accelerator](https://docs.snowplow.io/accelerators/ecommerce) or the detailed [eCommerce documentation](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/ecommerce). Next progress to the [Data Modeling](./data-modeling.md) step to verify your tracking setup in the data warehouse.