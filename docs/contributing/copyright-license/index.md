---
title: "Licensing overview"
sidebar_position: 10
hide_table_of_contents: true
---

```mdx-code-block
import Link from '@docusaurus/Link';
```

## Source-available components

:::tip Terminology

Since some of the below licenses are not approved by [OSI](https://opensource.org/licenses/), we do not refer to them as _Open Source_ licenses. However, the source code is still available.

:::

<table>
<thead>

<tr>
<th><Link to="http://www.apache.org/licenses/LICENSE-2.0">Apache 2.0</Link></th>
<th><Link to="/community-license-1.0/">Community License</Link></th>
<th><Link to="/limited-use-license-1.0/">Limited Use License</Link></th>
<th><Link to="/personal-and-academic-license-1.0/">Personal & Academic License</Link></th>
</tr>

</thead>
<tbody>

<tr style={{verticalAlign: "top"}}>
<td>

_Usage and distribution for any purpose_

</td>
<td>

_Usage in non-competing products, no distribution_ ([FAQ](/docs/contributing/community-license-faq/index.md))

</td>
<td>

_Usage in non-competing products, no high availability in production, no distribution_  ([FAQ](/docs/contributing/limited-use-license-faq/index.md))

</td>
<td>

_Usage for personal and academic purposes only_ ([FAQ](/docs/contributing/personal-and-academic-license-faq/index.md))

</td>
</tr>

<tr style={{verticalAlign: "top"}}>
<td>

* All tracker SDKs¹
* All Google Tag Manager templates
* Legacy data models (web, mobile)

</td>
<td>

* Core libraries (schema-ddl, common-streams, etc)
* Developer tools (Chrome Inspector, `igluctl`, etc)

</td>
<td>

All pipeline apps:
* [Collector](/docs/pipeline-components-and-applications/stream-collector/index.md) _(3.0.0+)_
* [Enrich](/docs/pipeline-components-and-applications/enrichment-components/index.md) _(4.0.0+)_
* [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) _(0.12.0+)_
* [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) _(6.0.0+)_
* [Snowflake Streaming Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/index.md)
* [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md) _(2.0.0+)_
* [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) _(0.2.0+)_
* Other loaders
* Community Edition terraform modules _(2024+)_

</td>
<td>

All data models (except web and mobile)

</td>
</tr>

</tbody>
</table>

¹As an exception, [Snowplow JavaScript Tracker](https://github.com/snowplow/snowplow-javascript-tracker) is distributed under [BSD 3 Clause](https://opensource.org/licenses/BSD-3-Clause). This tracker was originally based on Anthon Pang’s `piwik.js`, and has maintained the same license for distribution.

:::tip

When in doubt, consult each component’s GitHub repository for the LICENSE file.

:::

## Proprietary components

[Snowplow BDP](https://snowplow.io/snowplow-bdp/) is built upon the above components, but adds a vast set of proprietary, closed source ones (UI, API, highly available deployment logic, and so on). These are only available under a commercial license for Snowplow customers.
