---
title: "Versioning Data Structures with the JSON Editor"
sidebar_label: "Using the JSON Editor"
sidebar_position: 10
sidebar_custom_props:
  offerings:
    - cdi
---

## How do I version?

### Breaking and non-breaking changes

In Data Structures UI at the point of publishing a [schema](/docs/fundamentals/schemas/index.md) you'll be asked to select which version you'd like to create.

```mdx-code-block
import Breaking from "../_breaking.md"

<Breaking/>
```

### Incrementing the middle digit

For particular workflows you may want to make use of the middle digital as part of your versioning strategy. For simplicity, the UI allows only breaking or non-breaking changes.

Should you wish to use the middle versioning digit this is possible [via the Data Structures API](/docs/data-product-studio/data-structures/manage/api/index.md).
