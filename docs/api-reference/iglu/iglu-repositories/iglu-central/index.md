---
title: "Iglu Central public schema repository"
sidebar_label: "Iglu Central"
date: "2026-05-14"
sidebar_position: 1000
description: "Public machine-readable repository of Snowplow JSON schemas, with self-hosting support via igluctl."
keywords: ["iglu central", "public schema repository", "snowplow schemas"]
---

[Iglu Central](https://iglucentral.com/) is a public, machine-readable repository of JSON schemas hosted by Snowplow. Think of it as RubyGems or Maven Central, but for JSON schemas. It contains the schemas for Snowplow's out-of-the-box events and entities.

Under the hood, Iglu Central is a [static Iglu repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md) — a schema registry served as a static website over HTTP. The root index page at [iglucentral.com](https://iglucentral.com/) links to all the schemas it hosts.

## Mirror or self-host Iglu Central

You might want to create a public mirror or private clone of Iglu Central if:

- You need to access Iglu Central from a software system that cannot reach the open internet.
- You want a mirror with lower latency to your software system.

The schemas for Iglu Central are stored in GitHub, in [snowplow/iglu-central](https://github.com/snowplow/iglu-central). You can mirror Iglu Central to your own [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) using [`igluctl`](/docs/api-reference/iglu/igluctl/index.md):

```bash
git clone https://github.com/snowplow/iglu-central
cd iglu-central
igluctl static push --public schemas/ http://MY-IGLU-URL 00000000-0000-0000-0000-000000000000
```

Alternatively, you can host the schemas as a [static repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md).

Once your mirror is in place, update your [Iglu resolver configuration](/docs/api-reference/iglu/iglu-resolver/index.md) to point to it instead of `https://iglucentral.com`.
