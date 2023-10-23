---
title: "Anonymisation"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

## Anonymous tracking


### How to track?

* Anonymous tracking on Web using the JavaScript tracker.
* Anonymous tracking in mobile apps using the iOS and Android trackers and [the React Native tracker](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/anonymous-tracking/index.md).

## PII pseudonymization using enrichment

PII (personally identifiable information) pseudonymization enrichment runs after all the other enrichments and pseudonymizes the fields that are configured as PIIs.

It enables the users of Snowplow to better protect the privacy rights of data subjects, therefore aiding in compliance for regulatory measures.

Full details of this enrichment are [available here](http://localhost:3000/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/).
