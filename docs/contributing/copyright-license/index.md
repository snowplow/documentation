---
title: "Copyright & License"
date: "2020-11-24"
sidebar_position: 10
---

## Copyright

<p>Snowplow is copyright 2012–{new Date().getFullYear()} Snowplow Analytics Ltd.</p>

## License

In general, Snowplow components are licensed under one of the following 3 licenses:

* [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0) for trackers and various SDKs.
* [Snowplow Community License](/community-license-1.0/) for core pipeline components, e.g. [RDB Loader](https://github.com/snowplow/snowplow-rdb-loader) or [Snowbridge](https://github.com/snowplow/snowbridge), as well as Terraform modules to run them. ([FAQ](/docs/contributing/community-license-faq/index.md))
* [Snowplow Personal & Academic License](/personal-and-academic-license-1.0/) for selected data models and other commercial components. ([FAQ](/docs/contributing/personal-and-academic-license-faq/index.md))

:::note

Some components might not yet match the above approach, but are set to be updated in their next major or minor version.

:::

When in doubt, consult the each component’s GitHub repository for the LICENSE file.

### Snowplow JavaScript Tracker

[Snowplow JavaScript Tracker](https://github.com/snowplow/snowplow-javascript-tracker) is distributed under [BSD 3 Clause](https://opensource.org/licenses/BSD-3-Clause). This tracker was originally based on Anthon Pang's `piwik.js`, and has maintained the same license for distribution.

## Third-party, git-submoduled contributions

The loosely-coupled architecture of Snowplow makes it easy to swap out individual sub-system implementations for first- or third-party alternatives.

The Snowplow Analytics team curate some third-party sub-system implementations by git-submoduling those GitHub repositories into the Snowplow repositories.

Please note that third-party, git-submoduled contributions to Snowplow remain the copyright of their respective authors.

Third-party, git-submoduled contributions may be released under a different license to [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0); please consult the licensing information in their original GitHub repositories for confirmation.
