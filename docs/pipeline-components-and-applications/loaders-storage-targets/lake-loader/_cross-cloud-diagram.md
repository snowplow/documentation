```mdx-code-block
import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LakeLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_diagram.md';
import AzureExperimental from "@site/docs/reusable/azure-experimental/_index.md"
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
    <AzureExperimental/>
    <LakeLoaderDiagram {...props} stream="Kafka" bucket="ADLS" queue="Azure"/>
  </TabItem>
</Tabs>
