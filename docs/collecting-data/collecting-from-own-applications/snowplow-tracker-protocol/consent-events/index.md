---
title: "Consent events"
---

| consent - cmp visible [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/cmp_visible/jsonschema)| ✅ | ❌ | ? | ? | com_snowplowanalytics_snowplow_cmp_visible_1 |
| consent preferences [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/consent_preferences/jsonschema) | ✅ | ❌ | ? | ? | com_snowplowanalytics_snowplow_consent_preferences_1 |
| consent (other) | ❌ | ✅ | ? | ? | 

#### consent - cmp visible

| schema_name       | elapsed_time | 
|-------------------|-----|
| cmp_visible | 1.5  | 

#### consent preferences

| schema_name         | basis_for_processing | consent_version | consent_scopes                           | domains_applied              | consent_url              | event_type     | gdpr_applies  |
|---------------------|----------------------|-----------------|------------------------------------------|------------------------------|--------------------------|----------------|---------------|
| consent_preferences | consent              | 1               | ["necessary","preferences","statistics"] | ["https://www.example.com/"] | https://www.example.com/ | allow_selected | FALSE         |


#### consent (other)
