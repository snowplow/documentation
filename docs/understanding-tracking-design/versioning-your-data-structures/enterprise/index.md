---
title: "Versioning Data Structures in BDP Enterprise"
sidebar_label: "Using the UI"
sidebar_position: 10
sidebar_custom_props:
  offerings:
    - enterprise
---

## How do I version?

### Breaking and non-breaking changes

In Data Structures UI at the point of publishing a schema you'll be asked to select which version you'd like to create.

```mdx-code-block
import Breaking from "../_breaking.md"

<Breaking/>
```

### Overwriting schemas

Wherever possible we would advise always versioning the schema when making a change. However in cases where this isn't possible, Snowplow does allow you to overwrite a schema on your development environment, that is making a change and keeping the version the same.

Overwriting in your Production environment is forbidden due to the technology that auto-adjusts your tables, so when you promote an overwritten version to the Production environment you are required to increase the version as Breaking or Non-Breaking.

### Incrementing the middle digit

For particular workflows you may want to make use of the middle digital as part of your versioning strategy. For simplicity, the UI allows only breaking or non-breaking changes.

Should you wish to use the middle versioning digit this is possible [via the Data Structures API](/docs/understanding-tracking-design/managing-your-data-structures/api/index.md).
