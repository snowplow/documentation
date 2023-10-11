---
title: "Enhanced Consent"
sidebar_position: 6500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'
<ReleaseBadge/>
```

This plugin is the recommended way to track marketing consent events on your website. Functions, usage and a complete setup journey is showcased on the [Consent Tracking for Marketing accelerator](https://docs.snowplow.io/accelerators/consent/).

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

:::note
The plugin is available since version 3.8 of the tracker.
:::

## Download

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-consent@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-enhanced-consent@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

## Initialization

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-consent@latest/dist/index.umd.min.js',
    ['snowplowEnhancedConsentTracking', 'EnhancedConsentPlugin']
);
```

## Functions

API | Used for:
-- | -- 
`trackConsentAllow` | Track an acceptance of user consent.
`trackConsentSelected` | Track a specific selection of consented scopes.
`trackConsentPending` | Track the unconfirmed selection about user consent.
`trackConsentImplicit` | Track the implicit consent on user consent preferences.
`trackConsentDeny` | Track a denial of user consent.
`trackConsentExpired` | Track the expiration of a consent selection.
`trackConsentWithdrawn` | Track the withdrawal of user consent.
`trackCmpVisible` | Track the render time of a CMP banner. 

## Usage

### trackConsentAllow

To track the complete acceptance of a user consent prompt, you can use the `trackConsentAllow` method with the following attributes:

```js
window.snowplow("trackConsentAllow:{trackerName}", {
    consentScopes: ["necessary", "marketing", "personalization"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackConsentSelected

To track the specific selection of scopes of a user consent preferences, you can use the `trackConsentSelected` method with the following attributes:

```js
window.snowplow("trackConsentSelected:{trackerName}", {
    consentScopes: ["necessary", "marketing", "personalization"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackConsentPending

Some consent management platform installations, allow the user to take website actions or/and navigating to other pages without accepting the consent prompt. To track the unconfirmed selection of user consent, you can use the `trackConsentPending` method with the following attributes:

```js
window.snowplow("trackConsentPending:{trackerName}", {
    consentScopes: ["necessary", "marketing", "personalization"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackConsentImplicit

Some consent management platforms have a configuration which allows the setting of consent implicitly after a set of user interactions like clicks, scroll etc. To track the implicit selection of a user consent, you can use the `trackConsentImplicit` method with the following attributes:

```js
window.snowplow("trackConsentImplicit:{trackerName}", {
    consentScopes: ["necessary", "marketing", "personalization"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackConsentDeny

To track the complete denial of a user consent, you can use the `trackConsentDeny` method with the following attributes:

```js
window.snowplow("trackConsentDeny:{trackerName}", {
    consentScopes: ["necessary"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackConsentExpired

To track the expiration of a user consent, you can use the `trackConsentExpired` method with the following attributes:

```js
window.snowplow("trackConsentExpired:{trackerName}", {
    consentScopes: ["necessary", "marketing", "personalization"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackConsentWithdrawn

To track the withdrawal of a user consent, you can use the `trackConsentWithdrawn` method with the following attributes:

```js
window.snowplow("trackConsentWithdrawn:{trackerName}", {
    consentScopes: ["necessary", "marketing", "personalization"],
    basisForProcessing: "consent",
    consentUrl: "https://www.example.com/",
    consentVersion: "1.0",
    domainsApplied: ["https://www.example.com/"],
    gdprApplies: true
});
```

### trackCmpVisible

Consent management platform banners are an important part of a website’s first impression and performance. Snowplow provides a way to track what we call `elapsedTime`, which is the timestamp of the consent management platform banner becoming visible on the user’s screen.

```js
window.snowplow("trackCmpVisible:{trackerName}", {
    /* Using the performance.now API to retrieve the elapsed time from the page navigation. */
    elapsedTime: performance.now(),
});
```

## Entities

Below is main entity used for tracking consent in the Snowplow Enhanced Consent implementation.

### Consent Entity

An consent entity can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| basisForProcessing | `string` | GDPR lawful basis for data collection & processing. | ✅ |
| consentUrl | `string` | URI of the privacy policy related document. | ✅ |
| consentVersion | `string` | Version of the privacy policy related document. | ✅ |
| consentScopes | `string[]` | The scopes allowed after the user finalized their selection of consent preferences. E.g ['analytics', 'functional', 'advertisement']. | ✅ |
| domainsApplied | `string[]` | The domains for which this consent allows these preferences to persist to. | ✅ |
| gdprApplies | `boolean` | Determine if GDPR applies based on the user's geo-location. | ✘ |


<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/consent_preferences/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>
