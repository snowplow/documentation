---
title: "Consent events and GDPR"
sidebar_label: "Consent and GDPR"
sidebar_position: 50
description: "Track GDPR consent preferences, CMP visibility, and marketing consent with enhanced consent events and legacy consent APIs."
keywords: ["consent tracking", "GDPR", "consent preferences", "CMP", "marketing consent"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Snowplow provides out-of-the-box [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md) to track user consent preferences and GDPR compliance. Use these to capture consent decisions, track changes to user preferences, and monitor Consent Management Platform (CMP) performance.

You can also configure your tracker not to track certain identifiers, depending on user consent, using [anonymous tracking](/docs/events/anonymous-tracking/index.md).

## Consent API versions

Snowplow provides two versions of consent tracking APIs:
* Enhanced consent APIs: available for web only using the [Enhanced Consent plugin](/docs/sources/web-trackers/tracking-events/consent-gdpr/index.md), these APIs track detailed consent preferences and CMP visibility events
* Basic consent APIs: available for mobile, these APIs track basic consent activity

To process raw events created by the Snowplow Enhanced Consent plugin, use the consent module in the [Snowplow Unified Digital dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/consent-module/index.md).

:::note Models support enhanced consent only
The Snowplow dbt packages don't support the basic consent events and entities. You can however build your own models based on the raw events.
:::

## Tracker support

This table shows the support for consent tracking across the main client-side Snowplow [tracker SDKs](/docs/sources/index.md).  The server-side trackers don't include consent tracking APIs.

Older versions of the web trackers provided the `browser-plugin-consent` plugin for basic consent tracking. It was deprecated in version 4 in favor of `browser-plugin-enhanced-consent`.

| Tracker                                                                                    | Supported | Since version                           | Auto-tracking | Notes                                                                               |
| ------------------------------------------------------------------------------------------ | --------- | --------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/consent-gdpr/index.md)                    | ✅         | 3.0.0 - 4.0.0 (basic), 3.8.0 (enhanced) | ✅/❌           | Track enhanced consent events manually; configure automatic addition of GDPR entity |
| [iOS](/docs/sources/mobile-trackers/tracking-events/index.md#creating-a-consent-event)     | ✅         | 1.0.0                                   | ✅/❌           | Track basic consent events manually; configure automatic addition of GDPR entity    |
| [Android](/docs/sources/mobile-trackers/tracking-events/index.md#creating-a-consent-event) | ✅         | 1.0.0                                   | ✅/❌           | Track basic consent events manually; configure automatic addition of GDPR entity    |
| [React Native](/docs/sources/react-native-tracker/tracking-events/index.md)                | ✅         | 1.0.0                                   | ❌             | Basic API*; no GDPR entity                                                          |
| [Flutter](/docs/sources/flutter-tracker/tracking-events/index.md)                          | ✅         | 0.1.0                                   | ❌             | Basic API                                                                           |
| Roku                                                                                       | ❌         |                                         |               | Track custom events using the enhanced schemas                                      |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md)          | ✅         | v3                                      | ❌             | Enhanced consent events                                                             |

*It's also possible to use the JavaScript Enhanced Consent plugin with the React Native tracker.

## Events and entities

This section describes the events and entities used in Snowplow consent tracking.

### Enhanced

The [Enhanced Consent plugin](/docs/sources/web-trackers/tracking-events/consent-gdpr/index.md) includes a number of tracking calls for different user consent actions:

| API                     | To track                                                |
| ----------------------- | ------------------------------------------------------- |
| `trackConsentAllow`     | Acceptance of user consent                              |
| `trackConsentSelected`  | A specific selection of consented scopes                |
| `trackConsentPending`   | The unconfirmed selection about user consent            |
| `trackConsentImplicit`  | The implicit consent on user consent preferences        |
| `trackConsentDeny`      | A denial of user consent                                |
| `trackConsentExpired`   | The expiration of a consent selection                   |
| `trackConsentWithdrawn` | The withdrawal of user consent                          |
| `trackCmpVisible`       | The render time of a consent management platform banner |

With the exception of the CMP visible event, these methods use the same `consent_preferences` event schema. The CMP visible event uses the `cmp_visible` schema.

<SchemaProperties
    overview={{event: true}}
    example={{
        basisForProcessing: 'consent',
        consentVersion: '1',
        consentScopes: ["necessary","preferences","statistics"],
        domainsApplied: ["https://www.example.com/"],
        consentUrl: 'https://www.example.com/',
        eventType: 'allow_selected',
        gdprApplies: false
    }}
    schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent preferences selection event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_preferences", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "eventType": { "enum": ["deny_all", "allow_all", "allow_selected", "pending", "implicit_consent", "withdrawn", "expired"], "description": "The action for the consent preferences of a user." }, "basisForProcessing": { "enum": ["consent", "contract", "legal_obligation", "vital_interests", "public_task", "legitimate_interests"], "description": "GDPR lawful basis for data collection & processing." }, "consentUrl": { "type": "string", "format": "uri", "description": "URI of the privacy policy related document." }, "consentVersion": { "type": "string", "maxLength": 16, "description": "Version of the privacy policy related document." }, "consentScopes": { "type": "array", "items": { "type": "string", "description": "Each consent scope which has been accepted.", "maxLength": 1024 }, "minItems": 1, "description": "The scopes allowed after the user finalized his selection of consent preferences. E.g ['analytics', 'functional', 'advertisement']." }, "domainsApplied": { "type": "array", "items": { "type": "string", "description": "Each domain for which consent action applies.", "maxLength": 1024 }, "minItems": 1, "description": "The domains for which this consent allows these preferences to persist to." }, "gdprApplies": { "type": ["boolean", "null"], "description": "Determine if GDPR applies based on the user's geo-location." } }, "required": [ "eventType", "consentVersion", "domainsApplied", "consentScopes", "consentUrl", "basisForProcessing" ], "additionalProperties": false }} />

<SchemaProperties
    overview={{event: true}}
    info='Tracks the load time of Consent Management Platform (CMP) banners.'
    example={{
        elapsedTime: 1.5
    }}
    schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent dialog shown event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "cmp_visible", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "elapsedTime": { "type": "number", "description": "The time taken for the consent popup to be shown to the screen.", "maximum" : 9223372036854775807, "minimum" : 0 } }, "required": ["elapsedTime"], "additionalProperties": false }} />

### Basic

When you track a `consent_granted` or `consent_withdrawn` event, the tracker will automatically create and attach a `consent_document` entity.

The [native mobile](/docs/sources/mobile-trackers/tracking-events/gdpr-tracking/index.md) and [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md) trackers also support automatic addition of the `gdpr` entity to all tracked events. To configure this, provide a `GdprConfiguration` object when setting up a new tracker.

The React Native tracker did include GDPR entity configuration in earlier versions. We [deprecated it in version 4](/docs/sources/react-native-tracker/migration-guides/migrating-from-v2-x-to-v4/index.md).

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent granted", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_granted", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "expiry": { "type": "string", "format": "date-time" } }, "additionalProperties": false }} />

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent withdrawn", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_withdrawn", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "all": { "type": "boolean" } }, "required": ["all"], "additionalProperties": false }} />

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent document context", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_document", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "type": "string", "maxLength": 36 }, "version": { "type": "string", "maxLength": 36 }, "name": { "type": "string", "maxLength": 60 }, "description": { "type": "string", "maxLength": 10000 } }, "required": ["id", "version"], "additionalProperties": false }} />

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a web page context", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "gdpr", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "basisForProcessing": { "type": "string", "enum": ["consent", "contract", "legal_obligation", "vital_interests", "public_task", "legitimate_interests"], "description": "GDPR basis for data collection & processing" }, "documentId": { "type": ["string", "null"], "maxLength": 255, "description": "ID for document detailing basis for processing" }, "documentVersion": { "type": ["string", "null"], "maxLength": 16, "description": "Version of document detailing basis for processing" }, "documentDescription": { "type": ["string", "null"], "maxLength": 4096, "description": "Description of document detailing basis for processing" } }, "required": ["basisForProcessing"], "additionalProperties": false }} />
