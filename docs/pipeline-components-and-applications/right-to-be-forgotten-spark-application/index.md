---
title: "Right to be Forgotten Spark Application"
date: "2021-03-26"
sidebar_position: 1010
---

R2F is a stand-alone spark job that removes rows from the enriched events which contain specific PII identifiers. It is intended to enable Snowplow users to easily remove data about a specific user, when the data subject has requested it under the "right to be forgotten" rights in GDPR.

From the point of view of a user deploying snowplow, this job falls under the new category of "housekeeping" jobs, which are background tasks, meant to optimise or, in this case, clean up data.

In terms of data protection this implements the right of data subjects to request erasure of their data, as it is specified under Article 17 of the [GDPR](https://www.eugdpr.org/).

## Setup Guide

See [the setup guide](/docs/pipeline-components-and-applications/right-to-be-forgotten-spark-application/right-to-be-forgotten-spark-application-setup-guide/index.md) for running and configuring the app.

## Assumptions

### [](https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/wiki/Technical-documentation#data-loss)Data Loss

There is an argument called `maximum-matching-proportion` which is a safeguard for the case that you have chosen a value as removal criterion that corresponds to many rows.

This is a very coarse filter that will only catch the worst cases where that happens. So far we haven't identified a generic enough solution to catch for sure all cases where the user has made a mistake like that but there are some ideas about other safeguards (and of course new ideas are welcome, so please submit a [new issue on github](https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/issues) if you have one). Until other measures are implemented in R2F it is sensible to have some other measures in place to catch that issue downstream (for instance a weekly or monthly sanity check in the target database).

Of course in order to recover from such an issue you need to have a backup of the data which is hard to do while also meeting the requirement to erase all data for a certain client. One solution is to keep the old archive in another bucket or prefix (in the case of S3) which will automatically expire through some sort of object life cycle policy and/or versioning. Whichever solution to this problem you choose, we would like to hear about your experience on [discourse](https://discourse.snowplow.io/).

### [](https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/wiki/Technical-documentation#size-of-removal-criteria-file)Size of removal criteria file

It is assumed that the file is small enough to fit in memory in each executor. Back of the envelope calculations show that this is a reasonable assumption. If that is not the case for you please submit a [new issue on github](https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/issues) or even better a PR. This assumption simplifies the code but also should make execution very fast.
