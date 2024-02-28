```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The Snowflake Streaming Loader is published as a Docker image which you can run on any {props.cloud} VM. You do not need a Spark cluster to run this loader.</p>

<CodeBlock language="bash">{
`docker pull snowplow/snowflake-streaming-loader-${props.cloud.toLowerCase()}:${versions.snowflakeStreamingLoader}
`}</CodeBlock>

To run the loader, mount your config files into the docker image, and then provide the file paths on the command line:

<CodeBlock language="bash">{
`docker run \\
  --mount=type=bind,source=/path/to/myconfig,destination=/myconfig \\
  snowplow/snowflake-streaming-loader-${props.cloud.toLowerCase()}:${versions.snowflakeStreamingLoader} \\
  --config=/myconfig/loader.hocon \\
  --iglu-config=/myconfig/iglu.hocon
`}</CodeBlock>
