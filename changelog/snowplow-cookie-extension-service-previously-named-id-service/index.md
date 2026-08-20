---
title: "Snowplow Cookie Extension Service, previously named ID Service"
description: "We have renamed the current 'ID Service' to the 'Cookie Extension Service'."
date: "2025-04-28"
update_type:
  - "Maintenance notification"
components:
  - "Trackers"
  - "Collector"
---
We have renamed the current 'ID Service' to the 'Cookie Extension Service'. You can find these amends across our website, [documentation](/docs/sources/web-trackers/cookies-and-local-storage/cookie-extension/), and the Javascript tracker. This is a component which extends the lifetime of server-set cookies beyond the usual 7-day limit to 400 days instead.

This forms part of the 4.6.0 release of the Javascript tracker and is a non-breaking change, so existing applications should continue to work.

We have made this change to more accurately reflect the value and functionality of this capability.
