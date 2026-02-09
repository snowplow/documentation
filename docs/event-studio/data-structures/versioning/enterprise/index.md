---
title: "Version data structures with JSON Editor"
sidebar_label: "Using the JSON Editor"
sidebar_position: 10
description: "Choose schema version increments when publishing data structures using the JSON Editor in the Data Structures UI."
keywords: ["JSON Editor versioning", "schema versions", "version selection", "publish schemas"]
---

In Data Structures UI at the point of publishing a [schema](/docs/fundamentals/schemas/index.md) you'll be asked to select which version you'd like to create.

```mdx-code-block
import Breaking from "../_breaking.md"

<Breaking/>
```

## Incrementing the middle digit

For particular workflows you may want to make use of the middle digital as part of your versioning strategy. For simplicity, the UI allows only breaking or non-breaking changes.

Should you wish to use the middle versioning digit this is possible [via the Data Structures API](/docs/event-studio/programmatic-management/data-structures-api/index.md).
