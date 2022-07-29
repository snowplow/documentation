---
title: "Setup EmrEtlRunner (pre-R35)"
date: "2020-02-26"
sidebar_position: 20
---

Data is loaded from S3 -> Redshift by two applications:

1. RDB Shredder: this takes the enriched data in S3 and transforms it into a format suitable for loading into Redshift (called the shredded format), which is also stored in S3
2. RDB Loader: which takes the shredded data from S3, and loads it into Redshift.

Both applications are EMR jobs. They are orchestrated using EmrEtlRunner. In this setup guide we'll walk you through how to setup EmrEtlRunner correctly, so that the shredding and loading process are successfully run. This comes down to passing EmrEtlRunner a correct configuration file.
