```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import RDBLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/_diagram.md';
```

:::note

<p>The cloud selection below is for your <i>pipeline</i>. We don’t have restrictions on where {props.warehouse} is deployed.</p>

:::

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS (Batching, recommended)" default>
    <RDBLoaderDiagram {...props} batch="true" stream="Kinesis" bucket="S3" queue="SQS"/>
  </TabItem>
  <TabItem value="aws-streaming" label="AWS (Streaming)">
    <RDBLoaderDiagram {...props} stream="Kinesis" bucket="S3" queue="SQS"/>
  </TabItem>
  <TabItem value="gcp" label="GCP">
    <RDBLoaderDiagram {...props} stream="Pub/Sub" bucket="GCS" queue="Pub/Sub"/>
  </TabItem>
</Tabs>
