---
title: "Google Analytics Plugin"
description: "Google Analytics plugin for Snowplow to enable behavioral event collection from existing GA implementations."
schema: "TechArticle"
keywords: ["Google Analytics", "GA Plugin", "Analytics Integration", "GA Migration", "Universal Analytics", "GA4 Integration"]
date: "2020-08-21"
sidebar_position: 280
---

The Google Analytics plugin allows you to mirror the events sent to GA to your Snowplow collector as well.

## Quickstart

You can use the plugin by requiring it and specifying your Snowplow endpoint:

```javascript
<script>
  // usual isogram
  ga('create', 'UA-XXXXX-Y', 'auto');
  ga('require', 'spGaPlugin', { endpoint: 'https://mycollector.mydomain.net' });
  ga('send', 'pageView');
</script>
<script async src="https://cdn.jsdelivr.net/gh/snowplow/sp-js-assets/sp-ga-plugin/0.1.0/sp-ga-plugin.js"></script>
```

Where `https://mycollector.mydomain.net` is your Snowplow collector endpoint.

## Deployment with Google Tag Manager

Google Tag Manager does not currently support loading plugins when using Google Analytics tag templates. A common workaround is to use a Custom HTML tag to load the tracker with the plugin, but this has the unfortunate consequence of requiring that _all_ tags to which the plugin should be applied use the same tracker name. This is difficult to do with Google Tag Manager in a way that doesn't compromise data collection quality.

The best way to deploy this using Google Tag Manager is to replicate the plugin functionality by overwriting the relevant task in the GA hit builder task queue. But instead of modifying `sendHitTask` directly, a safer way is to approach it via `customTask`.

### 1. Create a new Custom JavaScript variable

Create a new Custom JavaScript variable, and name it `{{customTask - Snowplow duplicator}}`. Add the following code within:

```javascript
function() {
  // Add your snowplow collector endpoint here
  var endpoint = 'https://mycollector.mydomain.com/';

  return function(model) {
    var vendor = 'com.google.analytics';
    var version = 'v1';
    var path = ((endpoint.substr(-1) !== '/') ? endpoint + '/' : endpoint) + vendor + '/' + version;

    var globalSendTaskName = '_' + model.get('trackingId') + '_sendHitTask';

    var originalSendHitTask = window[globalSendTaskName] = window[globalSendTaskName] || model.get('sendHitTask');

    model.set('sendHitTask', function(sendModel) {
      var payload = sendModel.get('hitPayload');
      originalSendHitTask(sendModel);
      var request = new XMLHttpRequest();
      request.open('POST', path, true);
      request.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');
      request.send(payload);
    });
  };
}
```

This stores a reference to the original `sendHitTask` in a globally scoped variable (e.g. `window['_UA-12345-1_sendHitTask']`) to avoid multiple runs of this `customTask` from cascading on each other.

### 2. Add `{{customTask - Snowplow duplicator}}` to Google Analytics tags

This variable must be added to every single Google Analytics tag in the GTM container, whose hits you want to duplicate to Snowplow.

The best way to do this is to leverage the Google Analytics Settings variable.

Regardless of whether you choose to add this variable directly to the tags' settings or into a Google Analytics Settings variable, you need to do the following.

1. Browse to the tags' **More Settings** option, expand it, and then expand **Fields to set**. If you are editing the tag directly (i.e. not using a Google Analytics Settings variable), you will need to check "Enable overriding settings in this tag" first.
2. Add a new field with:
    - **Field name**: customTask
    - **Value**: `{{customTask - Snowplow duplicator}}`

All tags which have this field set will now send the Google Analytics payload to the Snowplow endpoint.

Further reading on the topic:

- [_Google Analytics Settings Variable_](https://www.simoahava.com/analytics/google-analytics-settings-variable-in-gtm/)
- [_#GTMTips: Automatically Duplicate Google Analytics Hits To Snowplow_](https://www.simoahava.com/analytics/automatically-fork-google-analytics-hits-snowplow/)

## Data structure

You can find the specific schema for the properties that will be collected via Google Analytics in the IgluCentral repository:
[Google](https://github.com/snowplow/iglu-central/tree/master/schemas/com.google.analytics)

[Google Measurement Protocol](https://github.com/snowplow/iglu-central/tree/master/schemas/com.google.analytics.measurement-protocol)

[Google ecommerce](https://github.com/snowplow/iglu-central/tree/master/schemas/com.google.analytics.ecommerce)

[Google ecommerce-enhanced](https://github.com/snowplow/iglu-central/tree/master/schemas/com.google.analytics.enhanced-ecommerce)
