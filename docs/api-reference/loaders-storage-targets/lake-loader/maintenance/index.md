---
title: "Lake maintenance jobs"
sidebar_label: "Maintenance"
sidebar_position: 3
description: "Maintain Delta Lake and Iceberg tables with OPTIMIZE operations and snapshot expiration to manage file size and storage costs."
keywords: ["lake maintenance", "delta optimize", "iceberg snapshots", "table maintenance", "file compaction"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DeltaMaintenance from '@site/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/_delta.md';
import IcebergMaintenance from '@site/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/_iceberg.md';
```

<Tabs groupId="lake-format" queryString>
  <TabItem value="delta" label="Delta Lake" default>
      <DeltaMaintenance/>
  </TabItem>
  <TabItem value="iceberg" label="Iceberg">
      <IcebergMaintenance/>
  </TabItem>
</Tabs>
