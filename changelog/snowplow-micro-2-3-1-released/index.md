---
title: "Snowplow Micro 2.3.1 released"
description: "Snowplow Micro is a testing and debugging utility."
date: "2025-09-15"
update_type:
  - "Release notes"
components:
  - "Snowplow Micro"
---
[Snowplow Micro](/docs/testing/snowplow-micro/) is a testing and debugging utility. It’s useful for validating tracking code, developing custom enrichments, and automated testing.

Normally, we recommend to run Snowplow Micro via Docker. It’s not, however, available on all systems, especially in the case of some continuous integration flows.

**This release adds the ability to run Snowplow Micro as a Java application** (which was present in some early versions). You can find the instructions [in the documentation](/docs/testing/snowplow-micro/local/).
