```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The Lake Loader is published as a Docker image which you can run on any {props.cloud} VM.  You do not need a Spark cluster to run this loader.</p>

<CodeBlock language="bash">{
`docker pull snowplow/lake-loader-${props.cloud.toLowerCase()}:${versions.lakeLoader}
`}</CodeBlock>

To run the loader, mount your config files into the docker image, and then provide the file paths on the command line:

<CodeBlock language="bash">{
`docker run \\
  --mount=type=bind,source=/path/to/myconfig,destination=/myconfig \\
  snowplow/lake-loader-${props.cloud.toLowerCase()}:${versions.lakeLoader} \\
  --config=/myconfig/loader.hocon \\
  --iglu-config=/myconfig/iglu.hocon
`}</CodeBlock>

