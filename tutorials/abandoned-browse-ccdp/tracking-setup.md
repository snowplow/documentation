---
position: 2
title: Tracking Setup
---

## Initialize Snowplow JavaScript tracker

To begin, we will set up Snowplow tracking on your ecommerce website. We assume that you already have a Snowplow pipeline. Please refer to the [Introduction](/tutorials/abandoned-browse-ccdp/installation) for more information on the different options. 

![website](images/retl-shopfront.png)

First, [initialize the Snowplow JavaScript tracker](/docs/sources/trackers/javascript-trackers/web-tracker/quick-start-guide). Below is an example of how to set up the tracker:

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
  appId: 'ecommerceDemo',
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

### Track page views and user engagement time

We want to understand how long a product is viewed for in order to determine the which product each customer is paying the most attention to. 

Use the `enableActivityTracking` function to calculate the time the user is actively engaged on the page:
- **minimumVisitLength**: the minimum time (in seconds) a user must stay on the page before tracking starts
- **heartbeatDelay**: the interval (in seconds) at which activity pings are sent

If you change these parameters, make sure to update the values in the [data modeling](./data-modeling.md#identifying-most-viewed-but-not-added-to-cart-products) step. 

This event must be called before the `trackPageView` function.

```javascript
snowplow('enableActivityTracking', {
  minimumVisitLength: 5,
  heartbeatDelay: 5
});

snowplow('trackPageView');
```

### Track product views

Implement the product view tracking when a product is viewed. This will create a column in the warehouse dedicated to storing information on viewed products.
`
```javascript
var floatPrice = parseFloat({{productPrice}});

  snowplow('trackProductView', {
    id: {{productId}},
    name: {{productName}},
    brand: {{productBrand}},
    category: {{productCategory}},
    price: price,
    currency: {{currency}},
    variant: {{productVariantTitle}}
});
```

### Track "add to cart" events

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

### Explanation of "add to cart" parameters

- **id**: the unique identifier for the product
- **name**: the product's name
- **price**: the product's price as a floating-point number
- **brand**: the brand associated with the product
- **currency**: the currency code (e.g., USD, EUR)
- **category**: the product's category or taxonomy
- **variant**: the product variant (if applicable)
- **total_value**: the updated total cart value after adding the product

## Test your tracking

To verify your tracking implementation, use the [Snowplow Chrome Extension](https://chrome.google.com/webstore/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm). This extension allows you to inspect Snowplow events in real-time as they are sent from your website. Navigate to your product pages and add items to cart while monitoring the extension to ensure events are firing correctly with all expected parameters. The extension will show you the full event payload including all contexts and properties, making it easy to debug your implementation.

## Next step

With this implementation, you have page view, time spent, and add to cart tracking. If you want to add more ecommerce tracking, please refer to the [Snowplow ecommerce accelerator](https://docs.snowplow.io/accelerators/ecommerce) or the detailed [ecommerce documentation](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/ecommerce). Next progress to the [data modeling](./data-modeling.md) step to verify your tracking setup in the data warehouse.
