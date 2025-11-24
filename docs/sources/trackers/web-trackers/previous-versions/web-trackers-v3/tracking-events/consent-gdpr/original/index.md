---
title: "Consent and GDPR tracking (original)"
sidebar_label: "Original"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin has been partially superseded by the [Enhanced Consent](../index.md) plugin. This older plugin has only two `trackX` methods, but it does allow the addition of GDPR context entities to every event.

This plugin is the recommended way to track marketing consent events on your website. Functions, usage and a complete setup journey is showcased on the [Consent Tracking for Marketing accelerator](https://docs.snowplow.io/accelerators/consent/).


Original consent events must be **manually tracked**. The GDPR context entity will be **automatically tracked** with all events if configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-consent@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-consent@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-consent@3/dist/index.umd.min.js",
  ["snowplowConsent", "ConsentPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-consent@3`
- `yarn add @snowplow/browser-plugin-consent@3`
- `pnpm add @snowplow/browser-plugin-consent@3`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ ConsentPlugin() ],
});
```

  </TabItem>
</Tabs>

## Events

### Consent granted

Use the `trackConsentGranted` method to track a user opting into data collection. A consent document context will be attached to the event if at least the `id` and `version` arguments are supplied. The method arguments are:

| **Name**      | **Description**                                           | **Required?** | **Type**         |
| ------------- | --------------------------------------------------------- | ------------- | ---------------- |
| `id`          | Identifier for the document granting consent              | Yes           | String           |
| `version`     | Version of the document granting consent                  | Yes           | String           |
| `name`        | Name of the document granting consent                     | No            | String           |
| `description` | Description of the document granting consent              | No            | String           |
| `expiry`      | Date-time string specifying when consent document expires | No            | String           |
| `context`     | Custom context for the event                              | No            | Array            |
| `tstamp`      | When the event occurred                                   | No            | Positive integer |

The `expiry` field specifies that the user consents to the attached documents until the date-time provided, after which the consent is no longer valid.

Tracking a consent granted event:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackConsentGranted', {
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document granting consent',
  expiry: '2020-11-21T08:00:00.000Z'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackConsentGranted({
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document granting consent',
  expiry: '2020-11-21T08:00:00.000Z'
});
```

  </TabItem>
</Tabs>

### Consent withdrawn

Use the `trackConsentWithdrawn` method to track a user withdrawing consent for data collection. A consent document context will be attached to the event if at least the `id` and `version` arguments are supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

The method arguments are:

| **Name**      | **Description**                                   | **Required?** | **Type**         |
| ------------- | ------------------------------------------------- | ------------- | ---------------- |
| `all`         | Specifies whether all consent should be withdrawn | No            | Boolean          |
| `id`          | Identifier for the document withdrawing consent   | No            | String           |
| `version`     | Version of the document withdrawing consent       | No            | string           |
| `name`        | Name of the document withdrawing consent          | No            | String           |
| `description` | Description of the document withdrawing consent   | No            | String           |
| `context`     | Custom context for the event                      | No            | Array            |
| `tstamp`      | When the event occurred                           | No            | Positive integer |

Tracking a consent withdrawn event:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackConsentWithdrawn', {
  all: false,
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document withdrawing consent'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackConsentWithdrawn({
  all: false,
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document withdrawing consent'
});
```

  </TabItem>
</Tabs>


## Consent documents

Consent documents are stored in the context of a consent event. Each consent method adds a consent document entity to the event. The consent document is a custom context entity storing the arguments supplied to the method (in both granted and withdrawn events, this will be: id, version, name, and description). In either consent method, additional documents can be appended to the event by passing an array of consent document self-describing JSONs in the context argument.

The JSON schema for a consent document can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0).

The fields of a consent document are:

| **Name**      | **Description**             | **Required?** | **Type** |
| ------------- | --------------------------- | ------------- | -------- |
| `id`          | Identifier for the document | Yes           | String   |
| `version`     | Version of the document     | Yes           | String   |
| `name`        | Name of the document        | No            | String   |
| `description` | Description of the document | No            | String   |

A consent document self-describing JSON looks like this:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0",
  "data": {
    "id": "1234",
    "version": "5",
    "name": "consent_document_name",
    "description": "here is a description"
  }
}
```

As an example, `trackConsentGranted` will store one consent document as a custom context:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackConsentGranted',
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document granting consent',
  expiry: '2020-11-21T08:00:00.000Z'
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackConsentGranted({
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document granting consent',
  expiry: '2020-11-21T08:00:00.000Z'
});
```

  </TabItem>
</Tabs>

The method call will generate this event:

```json
{
  "e": "ue",
  "ue_pr": {
    "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
    "data": {
      "schema": "iglu:com.snowplowanalytics.snowplow/consent_granted/jsonschema/1-0-0",
      "data": {
        "expiry": "2020-11-21T08:00:00.000Z"
      }
    }
  },
  "co": {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": {
      "schema": "iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0",
      "data": {
        "id": "1234",
        "version": "5",
        "name": "consent_document",
        "description": "a document granting consent"
      }
    }
  }
}
```

## GDPR context entity

Attach a context entity with the GDPR basis for processing and the details of a related document (e.g. a consent document) to all events which are fired after it is set.

It takes the following arguments:

| **Name**              | **Description**             | **Required?** | **Type**    |
| --------------------- | --------------------------- | ------------- | ----------- |
| `basisForProcessing`  | GDPR Basis for processing   | Yes           | Enum String |
| `documentId`          | ID of a GDPR basis document | No            | String      |
| `documentVersion`     | Version of the document     | No            | String      |
| `documentDescription` | Description of the document | No            | String      |

```json
{
  "e": "ue",
  "ue_pr": {
    "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
    "data": {
      "schema": "iglu:com.snowplowanalytics.snowplow/consent_granted/jsonschema/1-0-0",
      "data": {
        "expiry": "2020-11-21T08:00:00.000Z"
      }
    }
  },
  "co": {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": {
      "schema": "iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0",
      "data": {
        "id": "1234",
        "version": "5",
        "name": "consent_document",
        "description": "a document granting consent"
      }
    }
  }
}
```

The required `basisForProcessing` accepts only the following literals: `consent`, `contract`, `legalObligation`, `vitalInterests`, `publicTask`, `legitimateInterests` - in accordance with the [five legal bases for processing](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/).

The GDPR context is enabled by calling the `enableGdprContext` method once the tracker has been initialized, for example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableGdprContext', {
  basisForProcessing: 'consent',
  documentId: 'consentDoc-abc123',
  documentVersion: '0.1.0',
  documentDescription: 'this document describes consent basis for processing'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableGdprContext({
  basisForProcessing: 'consent',
  documentId: 'consentDoc-abc123',
  documentVersion: '0.1.0',
  documentDescription: 'this document describes consent basis for processing'
});
```

  </TabItem>
</Tabs>

The schema is [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/gdpr/jsonschema/1-0-0).
