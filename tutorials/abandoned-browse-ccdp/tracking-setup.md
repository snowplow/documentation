---
position: 2
title: Tracking Setup
---


## Initialize Snowplow JavaScript Tracker

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

window.snowplow('newTracker', 'awsSales', collector, {
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

```javascript
snowplow('enableActivityTracking', {
  minimumVisitLength: 5,
  heartbeatDelay: 5
});
```

### Explanation of Activity Tracking Parameters

- **minimumVisitLength**: The minimum time (in seconds) a user must stay on the page before tracking starts.
- **heartbeatDelay**: The interval (in seconds) at which activity pings are sent.
If you change these parameters, make sure to update the values in the [Data Modeling](./data-modeling.md#identifying-most-viewed-but-not-added-to-cart-products) step.

### Track Page Views with Enhanced E-commerce Context

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

## Next Step

With this implementation, you have page view, time spent, and add to cart tracking. If you want to add more eCommerce tracking, please refer to the [Snowplow Ecommerce Accelerator](https://docs.snowplow.io/accelerators/ecommerce). Next progress to the [Data Modeling](./data-modeling.md) step to verify your tracking setup.