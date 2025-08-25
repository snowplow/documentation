```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The Databricks Streaming Loader is published as a Docker image which you can run on any {props.cloud} VM.</p>

<CodeBlock language="bash">{
`docker pull snowplow/databricks-loader-${props.stream}:${versions.databricksStreamingLoader}
`}</CodeBlock>

To run the loader, mount your config file into the docker image, and then provide the file path on the command line. We recommend setting your Databricks credentials via environment variables, e.g. <code>DATABRICKS_CLIENT_SECRET</code>, so that you can refer to them in the config file.

<CodeBlock language="bash">{
`docker run \\
  --mount=type=bind,source=/path/to/myconfig,destination=/myconfig \\
  --env DATABRICKS_CLIENT_ID="$\{DATABRICKS_CLIENT_ID\}" \\
  --env DATABRICKS_CLIENT_SECRET="$\{DATABRICKS_CLIENT_SECRET\}" \\
  snowplow/databricks-loader-${props.stream}:${versions.databricksStreamingLoader} \\
  --config=/myconfig/loader.hocon
`}</CodeBlock>

Where `loader.hocon` is loader's [configuration file](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md#configuring-the-loader) and `iglu.hocon` is [iglu resolver](/docs/api-reference/iglu/iglu-resolver/index.md) configuration.
