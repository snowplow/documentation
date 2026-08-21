---
title: "Retiring legacy images of Snowplow Mini"
description: "This knowledge base article has been deprecated as of 2026, but may still be used for research for legacy component assistance."
date: "2025-02-06"
category:
  - "Release notes"
components:
  - "Testing"
---
Deprecated

This knowledge base article has been deprecated as of 2026, but may still be used for research for legacy component assistance.

[Snowplow Mini](/docs/api-reference/snowplow-mini/) is a single-instance version of Snowplow for testing. _(For quick testing and debugging, as well as automated tests, we recommend_ [_Snowplow Micro_](/docs/testing/snowplow-micro/) _instead. It’s much easier to work with.)_

We provide Snowplow Mini images for running it on AWS and GCP, and quite a few versions have been released over the years. Historically, we’ve hosted all these images forever, but that’s not practical and can make the newest images a bit harder to find.

To resolve this, **we are going to adopt a policy of only hosting the images for the latest versions**. Specifically, we will keep the versions released in the last 6 months (on a rolling basis), supplementing with older releases if necessary such that there are always at least 3 available. This means each image is still kept for at least 6 months, allowing you to upgrade in time.

This policy will take effect in 1 month, on March 6, 2025, and we will be deleting the images for all versions below 0.21.0.

What does this mean for you in practice?

* If you are running Snowplow Mini as part of Snowplow CDI, then this does not affect you, as we automatically upgrade it when newer versions become available.
* If you are running version 0.21.0 or above, then this does not affect you _right now_. However, you might want to upgrade to the newer 0.22.0 release eventually.
* If you are running any version below 0.21.0, your Mini instance will not be directly affected. But relaunching the instance as is — manually or automatically (e.g. through an auto-scaling group) — will not be possible. You will need to first adjust your configuration to use one of the newer versions.
