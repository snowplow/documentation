---
title: "Snowbridge 4.1.0"
description: "This release improves configurable retries and introduces a breaking change to its configuration."
date: "2025-01-21"
update_type:
  - "Release notes"
components:
  - "Snowbridge"
---
This release improves configurable retries and introduces a breaking change to its configuration. To learn more about how to mitigate the breaking change, see the [Snowbridge upgrade guide](/docs/api-reference/snowbridge/upgrade-guides/).

### Key Features

**Response rules:**

* Snowbridge can now be configured to send data to the invalid target after max retries are exhausted for a given error type. Previously, exhausting max retries would result in Snowbridge entering a reboot loop.
* HTTP response rules are now evaluated in the order provided in the configuration.
* A separate "throttle" category of response rule and retry logic is introduced.
* For more information, see the [Snowbridge retry documentation.](/docs/api-reference/snowbridge/configuration/retries/)

**Observability:**

* Removed average latency statistics, and fixed bugs in the reporting of latency for targets.
* Previously, the metadata feature didn't provide any information from the response body, due to PII concerns. This behavior can now be toggled via a 'safe mode' option, for more informative metadata where API responses don't contain user data.

**Other:**

* Dependencies updated
* Various repo and code maintenance tweaks
