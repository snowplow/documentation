---
position: 2
title: Tracking Setup
---


## Snowplow JavaScript Initialization

Before any tracking can take place, initialize the Snowplow JavaScript tracker. Below is an example of how to set up the tracker:

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

// Production
var collector = "yourcollector.site.com";

// Testing
// var tracker = "https://com-snplow-sales-gcp-prod1.mini.snplow.net";
// window.snowplow('newTracker', 'rt', collector, {
//   encodeBase64: false,
//   appId: 'ShopifyDemo',
//   platform: 'web',
//   contexts: {
//     webPage: true,
//     performanceTiming: true
//   }
// });

window.snowplow('newTracker', 'awsSales', awsSalesTracker, {
  encodeBase64: false,
  appId: 'ShopifyDemo',
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

### Time Spent Tracking

Use the `enableActivityTracking` function to track user activity on the page:

```javascript
snowplow('enableActivityTracking', {
  minimumVisitLength: 5,
  heartbeatDelay: 5
});
```

### Explanation of Parameters

- **minimumVisitLength**: The minimum time (in seconds) a user must stay on the page before tracking starts.
- **heartbeatDelay**: The interval (in seconds) at which activity pings are sent.

### Page View Tracking

After setting up activity tracking, implement the page view tracking with enhanced e-commerce context:

```javascript
snowplow('trackPageView', {
  context: [{
    schema: "iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0",
    data: {
      id: {{productId}},
      name: {{productName}},
      brand: {{productBrand}},
      category: {{productCategory}},
      price: {{price}},
      currency: {{currency}},
      variant: {{productVariantTitle}}
    }
  }]
});
```

### Add to Cart Tracking

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

// Add to cart. The cart_id parameter is not included because Shopify uses a cookie instead.
window.snowplow("trackAddToCart", { 
  products: product, 
  total_value: newTotalValue, 
  currency: {{currency}} 
});
```

### Explanation of Parameters

- **id**: The unique identifier for the product.
- **name**: The product's name.
- **price**: The product's price as a floating-point number.
- **brand**: The brand associated with the product.
- **currency**: The currency code (e.g., USD, EUR).
- **category**: The product's category or taxonomy.
- **variant**: The product variant (if applicable).
- **total_value**: The updated total cart value after adding the product.

With this implementation, each "add to cart" event is enriched with product and cart details.