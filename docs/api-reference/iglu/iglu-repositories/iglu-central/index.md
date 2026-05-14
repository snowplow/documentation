---
title: "Iglu Central public schema repository"
sidebar_label: "Iglu Central"
date: "2021-03-26"
sidebar_position: 1000
description: "Public machine-readable repository of Snowplow JSON schemas hosted on Amazon S3 with self-hosting support via igluctl."
keywords: ["iglu central", "public schema repository", "snowplow schemas"]
---

[Iglu Central](https://iglucentral.com/) is a public repository of JSON Schemas hosted by Snowplow Analytics.

As far as we know, Iglu Central is the first public **machine-readable** schema repository - all prior efforts we have seen are human-browsable directories of articles about schemas (e.g. [schema.org](http://schema.org/)).

Think of Iglu Central as like [RubyGems.org](http://rubygems.org/) or [Maven Central](http://central.maven.org/) but for storing publically-available JSON Schemas.

## Technical architecture

Under the hood, Iglu Central is built and run as a static Iglu repository, which is simply an Iglu repository server structured as a static website serving its whole content over http, and is hosted on Amazon S3.



Iglu Central is available for view at [https://iglucentral.com](https://iglucentral.com/). The root index page links to all schemas currently hosted on Iglu Central.

## Mirror or self-host Iglu Central

You might want to create a public mirror or private clone of Iglu Central if:

- You need to access Iglu Central from a software system that cannot reach the open internet.
- You want a mirror with lower latency to your software system.

The schemas for Iglu Central are stored in GitHub, in [snowplow/iglu-central](https://github.com/snowplow/iglu-central). You can mirror Iglu Central to your own [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) using [`igluctl`](/docs/api-reference/iglu/igluctl-2/index.md):

```bash
git clone https://github.com/snowplow/iglu-central
cd iglu-central
igluctl static push --public schemas/ http://MY-IGLU-URL 00000000-0000-0000-0000-000000000000
```

Alternatively, you can host the schemas as a [static repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md).

Once your mirror is in place, update your [Iglu resolver configuration](/docs/api-reference/iglu/iglu-resolver/index.md) to point to it instead of `https://iglucentral.com`.
