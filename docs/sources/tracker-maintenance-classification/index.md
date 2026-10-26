---
title: "Tracker maintenance classification"
sidebar_label: "Tracker maintenance classification"
date: "2020-07-08"
sidebar_position: 999
description: "Understand the maintenance groups for Snowplow trackers, dbt packages, and Signals SDKs, including production readiness and update schedules."
keywords: ["tracker maintenance", "support status", "production readiness", "Signals SDK", "dbt packages"]
---

Snowplow trackers, dbt packages, and Signals SDKs are categorized into four maintenance groups. These groups set expectations for how Snowplow maintains each project. Each GitHub repository contains a "Snowplow" badge that shows its maintenance group and links back to this page.

* * *

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Unsupported"></Badges>
```

Not production-ready, not actively maintained.
Deprecated.

* * *

```mdx-code-block
<Badges badgeType="Early Release"></Badges>
```

Pre-Version 1.0.0, may be missing core features.
Accepting community contributions.
Snowplow Team will test and release contributions.
Snowplow Team will update to fix critical or high severity vulnerabilities.
Will be released less frequently.

* * *

```mdx-code-block
<Badges badgeType="Maintained"></Badges>
```

Currently production ready.
Maintained by the Snowplow team but released less frequently.
Accepting community contributions.
May not have up to date dependencies or support for latest versions of language or framework.
Scanned daily for vulnerabilities, Snowplow Team will fix critical or high severity vulnerabilities promptly.

* * *

```mdx-code-block
<Badges badgeType="Actively Maintained"></Badges>
```

Currently production ready.
Actively maintained by the Snowplow team, with a frequent release schedule.
Accepting community contributions.
Dependencies are actively updated and will support the latest versions of language or framework.
Scanned daily for vulnerabilities, Snowplow Team will fix all vulnerabilities promptly.

* * *

| Status                                            | Production Ready | Release Frequency               | Accepting Contributions | Dependency and Vulnerability Updates                                                                                          |
| ------------------------------------------------- | :--------------: | ------------------------------- | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------- |
| <Badges badgeType="Unsupported"></Badges>         |        ❌         | Never                           |            ❌            | None                                                                                                                          |
| <Badges badgeType="Early Release"></Badges>       |      Varies      | As required                     |            ✔️            | \- Updates for critical and high severity vulnerabilities                                                                     |
| <Badges badgeType="Maintained"></Badges>          |        ✔️         | As required  <br/>Low frequency |            ✔️            | \- Daily scans <br/>\- Passive updates to dependencies  <br/>\- Active updates for critical and high severity vulnerabilities |
| <Badges badgeType="Actively Maintained"></Badges> |        ✔️         | Frequent release schedule       |            ✔️            | \- Daily scans <br/>\- Active updates to dependencies and all levels of vulnerabilities                                       |
