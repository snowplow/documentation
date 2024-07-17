---
title: "Consent events (Enhanced Consent)"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

Enhanced consent is the recommended way to track marketing consent events on your website.

<TOCInline toc={toc} maxHeadingLevel={2} />

## Events

<SchemaProperties
    overview={{event: true, web: true, mobile: false, automatic: false}}
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
    overview={{event: true, web: true, mobile: false, automatic: false}}
    info='Tracks the load time of Consent Management Platform (CMP) banners.'
    example={{
        elapsedTime: 1.5
    }}
    schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent dialog shown event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "cmp_visible", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "elapsedTime": { "type": "number", "description": "The time taken for the consent popup to be shown to the screen.", "maximum" : 9223372036854775807, "minimum" : 0 } }, "required": ["elapsedTime"], "additionalProperties": false }} />

## How to track?

To track enhanced consent events using the JavaScript tracker on Web, you can make use of [the Enhanced Consent plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/consent-gdpr/index.md).

## Modeled data using the snowplow-web dbt package

To process raw events created by the Snowplow Enhanced Consent plugin we have included an optional module to model consent events in the [snowplow-web dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/consent-module/index.md).

This custom module consists of a series of dbt models which produce the following aggregated models from the raw consent tracking events:

Derived table | Table description | dbt
---|---|---
`snowplow_web_consent_log` | Snowplow incremental table showing the audit trail of consent and Consent Management Platform (cmp) events | [Docs](https://snowplow.github.io/dbt-snowplow-web/#!/model/model.snowplow_web.snowplow_web_consent_log)
`snowplow_web_consent_users` | Incremental table of user consent tracking stats | [Docs](https://snowplow.github.io/dbt-snowplow-web/#!/model/model.snowplow_web.snowplow_web_consent_users)
`snowplow_web_consent_totals` | Summary of the latest consent status, per consent version | [Docs](https://snowplow.github.io/dbt-snowplow-web/#!/model/model.snowplow_web.snowplow_web_consent_totals)
`snowplow_web_consent_scope_status` | Aggregate of current number of users consented to each consent scope | [Docs](https://snowplow.github.io/dbt-snowplow-web/#!/model/model.snowplow_web.snowplow_web_consent_scope_status)
`snowplow_web_cmp_stats` | Used for modeling cmp_visible events and related metrics | [Docs](https://snowplow.github.io/dbt-snowplow-web/#!/model/model.snowplow_web.snowplow_web_consent_cmp_stats)
`snowplow_web_consent_versions` | Incremental table used to keep track of each consent version and its validity | [Docs](https://snowplow.github.io/dbt-snowplow-web/#!/model/model.snowplow_web.snowplow_web_consent_versions)

## Consent Tracking for Marketing accelerator

Visit the [Consent Tracking for Marketing accelerator](https://docs.snowplow.io/accelerators/consent/) for an end-to-end tutorial on how to track and model consent data using Snowplow.

<details>
  <summary>Older consent APIs and events</summary>
  <div>

There is an option to track older consent granted and consent withdrawn events in our trackers.
However, we recommend using the Enhanced Consent events as they are more up-to-date.

To learn how to track consent granted and withdrawn events, see:

* On Web, make use of the [Consent plugin on the JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/consent-gdpr/original/index.md).
* On mobile, see the [consent tracking APIs here](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/index.md#creating-a-consent-event).

The tracking consists of two events (`consent_granted` and `consent_withdrawn`) and two context entities (`consent_document` and `gdpr`).

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent granted", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_granted", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "expiry": { "type": "string", "format": "date-time" } }, "additionalProperties": false }} />

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent withdrawn", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_withdrawn", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "all": { "type": "boolean" } }, "required": ["all"], "additionalProperties": false }} />

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for consent document context", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "consent_document", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "type": "string", "maxLength": 36 }, "version": { "type": "string", "maxLength": 36 }, "name": { "type": "string", "maxLength": 60 }, "description": { "type": "string", "maxLength": 10000 } }, "required": ["id", "version"], "additionalProperties": false }} />

<SchemaProperties schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a web page context", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "gdpr", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "basisForProcessing": { "type": "string", "enum": ["consent", "contract", "legal_obligation", "vital_interests", "public_task", "legitimate_interests"], "description": "GDPR basis for data collection & processing" }, "documentId": { "type": ["string", "null"], "maxLength": 255, "description": "ID for document detailing basis for processing" }, "documentVersion": { "type": ["string", "null"], "maxLength": 16, "description": "Version of document detailing basis for processing" }, "documentDescription": { "type": ["string", "null"], "maxLength": 4096, "description": "Description of document detailing basis for processing" } }, "required": ["basisForProcessing"], "additionalProperties": false }} />

  </div>
</details>
