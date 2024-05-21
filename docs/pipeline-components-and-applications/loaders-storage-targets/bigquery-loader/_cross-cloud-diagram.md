```mdx-code-block
import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/_diagram.md';
```

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS">
    <LoaderDiagram {...props} stream="Kinesis" cloud="AWS"/>
  </TabItem>
  <TabItem value="gcp" label="GCP">
    <LoaderDiagram {...props} stream="Pub/Sub" cloud="GCP"/>
  </TabItem>
  <TabItem value="azure" label="Azure">
    <LoaderDiagram {...props} stream="Kafka" cloud="Azure"/>
  </TabItem>
</Tabs>
