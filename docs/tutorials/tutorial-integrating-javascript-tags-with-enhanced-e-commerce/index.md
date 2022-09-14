---
title: "Tutorial: Integrating Javascript tags with Enhanced E-commerce"
date: "2021-03-26"
sidebar_position: 50
---

**Warning: This functionality depends on Snowplow JavaScript Tracker v2.6.0 or above**.

Please visit the [technical documentation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracking-specific-events/index.md#Enhanced_Ecommerce_tracking) to see example use of the Enhanced E-commerce functions.

### 1. Overview

This guide will show you how to configure Google Tag Manager to load the Snowplow JavaScript Tracker and send Enhanced E-commerce data to Snowplow as well as Google without changing any of your calls to `dataLayer.push`. We will assume that you have already implemented the GTM `dataLayer` for Enhanced E-commerce as described in the Enhanced E-commerce (UA) Developer Guide.

We also assume that any ecommerce-related call to `dataLayer.push` which does not contain an "event" field is made before Google Tag Manager loads, as described [here](http://www.simoahava.com/analytics/ecommerce-tips-google-tag-manager/#tip1).

If you are sending very large ecommerce events containing lots of impressions, the size of your events may exceed maximum querystring size for GET requests. In this case we recommend configuring the tracker to use POST instead as described [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracker-setup/initializing-a-tracker-2/index.md).

### 2. Creating the Data Layer Variable

In the Variables tab, create a Data Layer Variable. Set the name of this variable to "ecommerce". This variable will hold all ecommerce-related data and will be updated when you call `dataLayer.push` with a JSON containing the key "ecommerce".

### 3. Creating the trigger

The trigger will detect ecommerce data pushed into the data layer and cause the main tag to fire.

In the Triggers tab, Create a new trigger named "Enhanced Ecommerce". In the "Choose Event" section, choose "Custom Event". Set "Fire On" to something like the string `gtm.dom|checkout|checkoutOption|productClick|addToCart|removeFromCart|promotionClick|purchase` and check the "Use regex matching" box.

The regex should consist of "gtm.dom" together with every string which you set as a the value of the "event" key in the enhanced ecommerce objects you push to the data layer, separated by the "|" pipe character.

### 4. Writing the JavaScript

Your tag will fire both when the page loads and also every time an ecommerce event is pushed to the data layer.

When the page loads, the tag will load the Snowplow JavaScript Tracker, make the API calls necessary to set up tracking. If the data layer contains ecommerce data, like product impressions, the tag will also send that data to Snowplow.

Whenever ecommerce data is pushed to the data layer, the tag will fire again. It will not attempt to set up tracking again; instead it will send the ecommerce event to Snowplow.

The example script below will be used as the basis for your tag. There are some changes you should make to this script. In the example "SNOWPLOW_NAME_HERE" is used as the name of the Snowplow function. This is the global function used to make API calls to the Snowplow JavaScript Tracker. You should change this string to something unique so that if there is another Snowplow user on the page the namespaces will not collide. Similarly, you should change "MY_COOKIE_NAME" to a unique value. You should change "MY_COLLECTOR" to the URL of your Snowplow collector (minus the http/https scheme), for example "c.mydomain.com".

You can also customize the part of the tag between the comments containing "!!!". The example below creates a tracker instance, sets page pings to fire every 10 seconds, and sends a page view event. See the [JavaScript Tracker page](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracking-specific-events/index.md) for more information on other tracking methods.

```javascript
<script>
  // If this tag fires more than once (e.g. page view followed by ecommerce action),
  // we don't want to repeat the trackPageView here
  if (!window.SNOWPLOW_NAME_HERE) {
    ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
    p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
    };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
    n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","//cdn.jsdelivr.net/gh/snowplow/sp-js-assets@2.18.2/sp.js","SNOWPLOW_NAME_HERE"));

    // !!! Customizable section starts
    // Track page views, enable link clicks, and so on here

    SNOWPLOW_NAME_HERE('newTracker', 'snplow1', 'MY_COLLECTOR', {
      'appId': 'snowplowweb',
      'cookieName': 'MY_COOKIE_NAME'
    });

    SNOWPLOW_NAME_HERE('enableActivityTracking', 10, 10);
    SNOWPLOW_NAME_HERE('trackPageView');

    // !!! Customizable section ends
  }

  var ecommerce = {{ecommerce}};
  var actions = [
    "click",
    "detail",
    "add",
    "remove",
    "checkout",
    "checkout_option",
    "purchase",
    "refund",
    "promo_click",
    "view"
  ];
  if (ecommerce) {
    sendEnhancedEcommerceEvent(ecommerce);
  }

  function sendEnhancedEcommerceEvent(ecommerce) {
    var currencyCode = ecommerce.currencyCode;
    var relevantActions = [];

    for (var i = 0; i < actions.length; i++) {
      if (ecommerce[actions[i]]) {
        relevantActions.push(actions[i]);
      }
    }
    if (ecommerce.impressions) {
      for (var j = 0; j < ecommerce.impressions.length; j++) {
        var impression = ecommerce.impressions[j];
        SNOWPLOW_NAME_HERE('addEnhancedEcommerceImpressionContext',
          impression.id,
          impression.name,
          impression.list,
          impression.brand,
          impression.category,
          impression.variant,
          impression.position,
          impression.price,
          currencyCode
        );
      }
    }
    if (ecommerce.promoView) {
      for (var l = 0; l < ecommerce.promoView.promotions.length; l++) {
        var promo = ecommerce.promoView.promotions[l];
        SNOWPLOW_NAME_HERE('addEnhancedEcommercePromoContext',
          promo.id,
          promo.name,
          promo.creative,
          promo.position,
          currencyCode
        );
      }
    }
    if (relevantActions.length === 0) {
      SNOWPLOW_NAME_HERE('trackEnhancedEcommerceAction', 'view');
    } else {
      for (var m = 0; m < relevantActions.length; m++) {
        var relevantAction = relevantActions[m];
        if (ecommerce[relevantAction].products) {
          for (var k = 0; k < ecommerce[relevantAction].products.length; k++) {
            var product = ecommerce[relevantAction].products[k];
            SNOWPLOW_NAME_HERE('addEnhancedEcommerceProductContext',
              product.id,
              product.name,
              product.list,
              product.brand,
              product.category,
              product.variant,
              product.price,
              product.quantity,
              product.coupon,
              product.position,
              currencyCode
            );
          }
        }
        if (ecommerce[relevantAction].actionField) {
          var actionObject = ecommerce[relevantAction].actionField;
          SNOWPLOW_NAME_HERE('addEnhancedEcommerceActionContext',
            actionObject.id,
            actionObject.affiliation,
            actionObject.revenue,
            actionObject.tax,
            actionObject.shipping,
            actionObject.coupon,
            actionObject.list,
            actionObject.step,
            actionObject.option,
            currencyCode
          );
        }
        SNOWPLOW_NAME_HERE('trackEnhancedEcommerceAction', relevantAction);
      }
    }
  }
</script>
```

### 5. Creating the tag

In the Tags tab, create a new tag. Name it something like "Enhanced Ecommerce Pageview". In the "Choose Product" section, select "Custom HTML Tag". Copy and paste the JavaScript you wrote in the previous section into the textbox.

From the Fire On section, choose "More", then select the "Enhanced Ecommerce" trigger you created earlier and save.
