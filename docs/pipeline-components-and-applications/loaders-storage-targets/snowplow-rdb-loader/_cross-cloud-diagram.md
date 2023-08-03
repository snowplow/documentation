```mdx-code-block
import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import RDBLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/_diagram.md';
import AzureExperimental from "@site/docs/reusable/azure-experimental/_index.md"
```

<>{props.warehouse != 'Redshift' && (
  <Admonition type="info">
    <p>The cloud selection below is for your <i>pipeline</i>. We don’t have restrictions on where {props.warehouse} itself is deployed.</p>
  </Admonition>
)}</>

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS (Batching, recommended)" default>
    <RDBLoaderDiagram {...props} batch="true" stream="Kinesis" bucket="S3" queue="SQS"/>
  </TabItem>
  <TabItem value="aws-micro-batching" label="AWS (Micro-batching)">
    <RDBLoaderDiagram {...props} stream="Kinesis" bucket="S3" queue="SQS"/>
  </TabItem>
  {props.warehouse != 'Redshift' && (<TabItem value="gcp" label="GCP">
    <RDBLoaderDiagram {...props} stream="Pub/Sub" bucket="GCS" queue="Pub/Sub"/>
  </TabItem>)}
  {props.warehouse == 'Snowflake' && (<TabItem value="azure" label="Azure">
    <AzureExperimental/>
    <RDBLoaderDiagram {...props} stream="Kafka" bucket="Azure Blob Storage" queue="Kafka"/>
  </TabItem>)}
</Tabs>
