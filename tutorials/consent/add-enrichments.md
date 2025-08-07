---
title: Add enrichments
position: 6
---

Snowplow offers a large number of enrichments that can be used to enhance your event data. An enrichment either updates or populates fields of the atomic event or adds a self-describing context to derived_contexts.

For this project, we'll enable the PII Pseudonymization enrichment.

## PII pseudonymization

PII (personally identifiable information) pseudonymization enrichment runs after all the other enrichments and pseudonymizes the fields that are configured as PIIs.

It enables the users of Snowplow to better protect the privacy rights of data subjects, therefore aiding in compliance for regulatory measures.

Full details of this enrichment are available in the [Snowplow Documentation](https://docs.snowplow.io/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/).
