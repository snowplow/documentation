---
title: "[Security] Disabling legacy TLS protocols"
description: "To make our pipelines more secure, we are going to disable deprecated versions of TLS (1.0 and 1.1) for all Snowplow endpoints (Collector, Iglu Server, etc) starting April 17, 2025."
date: "2025-03-17"
update_type:
  - "Maintenance notification"
components:
  - "Security"
---
To make our pipelines more secure, **we are going to disable deprecated versions of TLS** (1.0 and 1.1) for all Snowplow endpoints (Collector, Iglu Server, etc) **starting April 17, 2025**.

TLS is a protocol used for secure communication over HTTP. The current versions are 1.3 (2018) and 1.2 (2008). Versions 1.0 (1999) and 1.1 (2006) have been deprecated since 2021 and are deemed unsafe.

The Collector endpoint in particular is relevant, because your users’ devices communicate with it. All modern devices, however, support the current versions of TLS (1.3 and 1.2), so **there should not be any impact to the data you track**.

If you have a specific reason to keep a deprecated protocol enabled, please contact us to discuss the exception.
