---
title: "Recovering failed events"
description: "Recover and fix failed behavioral events to maintain data quality and completeness in your analytics pipeline."
schema: "TechArticle"
keywords: ["Event Recovery", "Failed Events", "Data Recovery", "Event Repair", "Quality Recovery", "Data Restoration"]
sidebar_position: 4
sidebar_label: "Recover"
---

Event recovery allows you to fix [failed events](/docs/fundamentals/failed-events/index.md) in some scenarios, so that you can ensure your data is complete and accurate.

A typical recovery process runs a script over a set of failed events to solve the issues (e.g. misspelled attribute name), and then attempts to re-process these events if necessary.

```mdx-code-block
import DocCardList from '@theme/DocCardList';
```

<DocCardList/>
