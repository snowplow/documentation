```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The Snowflake Streaming Loader is published as a Docker image which you can run on any {props.cloud} VM. You do not need a Spark cluster to run this loader.</p>

<CodeBlock language="bash">{
`docker pull snowplow/snowflake-loader-${props.stream}:${versions.snowflakeStreamingLoader}
`}</CodeBlock>

To run the loader, mount your config file into the docker image, and then provide the file path on the command line.  We recommend setting the <code>SNOWFLAKE_PRIVATE_KEY</code> environment variable so that you can refer to it in the config file.

<CodeBlock language="bash">{
`docker run \\
  --mount=type=bind,source=/path/to/myconfig,destination=/myconfig \\
  --env SNOWFLAKE_PRVIATE_KEY="$\{SNOWFLAKE_PRIVATE_KEY\}" \\
  snowplow/snowflake-loader-${props.stream}:${versions.snowflakeStreamingLoader} \\
  --config=/myconfig/loader.hocon
`}</CodeBlock>
