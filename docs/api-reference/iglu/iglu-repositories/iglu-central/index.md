---
title: "Iglu Central public schema repository"
sidebar_label: "Iglu Central"
date: "2021-03-26"
sidebar_position: 1000
description: "Public machine-readable repository of Snowplow JSON schemas hosted on Amazon S3 with self-hosting support via igluctl."
keywords: ["iglu central", "public schema repository", "snowplow schemas"]
---

[Iglu Central](http://iglucentral.com/) is a public repository of JSON Schemas hosted by Snowplow Analytics.

As far as we know, Iglu Central is the first public **machine-readable** schema repository - all prior efforts we have seen are human-browsable directories of articles about schemas (e.g. [schema.org](http://schema.org/)).

Think of Iglu Central as like [RubyGems.org](http://rubygems.org/) or [Maven Central](http://central.maven.org/) but for storing publically-available JSON Schemas.

## Technical architecture

Under the hood, Iglu Central is built and run as a static Iglu repository, which is simply an Iglu repository server structured as a static website serving its whole content over http, and is hosted on Amazon S3.

![iglu-central-img](images/iglu-central.png)

The [deployment process](/docs/api-reference/iglu/iglu-central-setup/index.md) for Iglu Central is documented on this wiki in case a user wants to setup a public mirror or private instance of Iglu Central.

Iglu Central is available for view at [http://iglucentral.com](http://iglucentral.com/). Although Iglu Central is primarily designed to be consumed by [Iglu clients](/docs/api-reference/iglu/iglu-clients/index.md), the root index page for Iglu Central links to all schemas currently hosted on Iglu Central.

## Self Hosting Iglu Central schemas

The schemas for Iglu Central are stored in GitHub, in [snowplow/iglu-central](https://github.com/snowplow/iglu-central). You can mirror Iglu Central using `[igluctl](/docs/api-reference/iglu/igluctl-2/index.md)`:

```bash
git clone https://github.com/snowplow/iglu-central
cd iglu-central
igluctl static push --public schemas/ http://CHANGE-TO-MY-IGLU-URL.elb.amazonaws.com 00000000-0000-0000-0000-000000000000
```

For further information on Iglu Central, consult the [Iglu Central setup guide](/docs/api-reference/iglu/iglu-central-setup/index.md).
