```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The BigQuery Loader is published as a Docker image which you can run on any {props.cloud} VM.</p>

<CodeBlock language="bash">{
`docker pull snowplow/bigquery-loader-${props.stream}:${versions.bqLoader}
`}</CodeBlock>

To run the loader, mount your config file into the docker image, and then provide the file path on the command line.

<CodeBlock language="bash">{
`docker run \\
  --mount=type=bind,source=/path/to/myconfig,destination=/myconfig \\
  snowplow/bigquery-loader-${props.stream}:${versions.bqLoader} \\
  --config=/myconfig/loader.hocon \\  
  --iglu-config /myconfig/iglu.hocon
`}</CodeBlock>

Where `loader.hocon` is loader's [configuration file](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/#configuring-the-loader) and `iglu.hocon` is [iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) configuration.
