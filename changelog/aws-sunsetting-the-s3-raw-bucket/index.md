---
title: "[AWS] Sunsetting the S3 “raw” bucket"
description: "We are sunsetting the storage of events received by the Collector in an intermediate S3 bucket called raw."
date: "2025-07-28"
update_type:
  - "Maintenance notification"
components:
  - "AWS"
---
> **This note only applies to AWS customers on Private Managed Cloud**

We are sunsetting the storage of events received by the Collector in an intermediate S3 bucket called `raw`. This internal feature is no longer used by the product, and **we will be turning it off on September 1, 2025.**

There are several reasons for the removal:

* Slightly lower infrastructure costs (not storing redundant data).
* In H2 2025, we will be introducing other cost-cutting and latency-reducing features that are not compatible with this storage.

The S3 `raw` bucket is an internal implementation detail and we are not aware of any customers accessing this data directly. **In the unlikely event that you rely on this data, please let us know as soon as possible.**

---

Note that we will not remove the `raw` bucket itself. We will stop the flow of new data to it and disassociate the bucket from our managed infrastructure. Once that is done, you can delete the bucket entirely to realize further cost savings.

The `enriched` bucket and its associated data flows will remain in place (if configured).
