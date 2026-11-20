---
title: "Versioning schemas"
sidebar_label: "Versioning"
sidebar_position: 40
description: "How schema versions work, when a change is breaking or non-breaking, and the risks of changing a schema without incrementing its version."
keywords: ["schema versioning", "breaking changes", "non-breaking changes", "schema versions"]
content_type: concept
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

Every schema has a version, starting from `1-0-0`. As your schema evolves, you will need to create new versions of it. All previous versions of a schema remain available to ensure backwards-compatibility.

Versioning has an important role in telling Snowplow Loaders how to handle the changes when loading into your data warehouse. For example, there may be a need to create new columns, update columns, or even create new tables.

It's important to understand when your change is breaking, and [version correctly](/docs/event-studio/data-structures/versioning/index.md).

import Breaking from "/docs/reusable/schema-version-breaking-change/_breaking.md"

<Breaking/>

Changing a schema without incrementing the version has several risks:
* Events that were previously valid could become invalid against the new changes
* Your warehouse Loader, which updates the table [according to the schema](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md#versioning), could get stuck if it’s not possible to cast the data in the existing table column to the new definition (e.g. if you change a field type from a string to a number)
* Similarly, data models or other applications consuming the data downstream might not be able to deal with the changes

Aim to treat each schema version as immutable. However, if you can't avoid making changes to an existing schema version, you have two options: [marking it as superseded, or patching the schema](/docs/fundamentals/schemas/superseding-and-patching/index.md).
