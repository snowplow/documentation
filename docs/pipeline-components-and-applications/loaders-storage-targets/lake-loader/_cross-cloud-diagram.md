```mdx-code-block
import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LakeLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_diagram.md';
```

<>{props.warehouse == 'Databricks' && (
  <Admonition type="info">
    <p>The cloud selection below is for your <i>pipeline</i>. We don’t have restrictions on where {props.warehouse} itself is deployed.</p>
  </Admonition>
)}</>

<Tabs groupId="cloud" queryString lazy>
  {props.warehouse != 'Synapse Analytics' && (<TabItem value="gcp" label="GCP">
    <LakeLoaderDiagram {...props} stream="Pub/Sub" bucket="GCS" cloud="GCP"/>
  </TabItem>)}
  <TabItem value="azure" label="Azure">
    <LakeLoaderDiagram {...props} stream="Kafka" bucket="ADLS" cloud="Azure"/>
  </TabItem>
  <TabItem value="aws" label="AWS">
    <LakeLoaderDiagram {...props} stream="Kinesis" bucket="S3" cloud="AWS"/>
  </TabItem>
</Tabs>
