---
title: Tracking Setup
position: 3
---

The recommended tracking setup relies on events from the ["Hyper Transactional" e-commerce schema](https://iglucentral.com/?q=io.snowplow.ecomm). This includes events like:

- Page views
- Product views
- Product click
- Add to cart / Remove from cart
- Collection viewed
- Search
- Checkout start
- Purchase (checkout end)

Of these, we will use the Product View events as the main signal to train AWS Personalize on. Most code we deploy will also work with the other e-commerce plugins.

We will also use [the Element Tracking plugin](https://github.com/snowplow/snowplow-javascript-tracker/tree/master/plugins/browser-plugin-element-tracking)'s `expose_element` events for measuring impressions of our Recommendations once we are serving them.