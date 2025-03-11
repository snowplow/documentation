---
title: "Lake maintenance"
sidebar_label: "Maintenance"
sidebar_position: 3
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
