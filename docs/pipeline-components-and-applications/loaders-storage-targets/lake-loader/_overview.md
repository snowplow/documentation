```mdx-code-block
import Mermaid from '@theme/Mermaid';
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The lake loader on {props.cloud} is a fully streaming application that continually pulls events from {props.stream} and writes to {props.bucket}.</p>

<Mermaid value={`
flowchart LR
  stream[["<b>Enriched Events</b>\n(${props.stream} stream)"]]
  loader{{"<b>Lake Loader</b>"}}
  subgraph bucket ["${props.bucket}"]
    table[("<b>Events table</b>")]
  end
  stream-->loader-->bucket
`}/>

<p>The lake loader is published as a Docker image which you can run on any {props.cloud} VM.  You do not need a Spark cluster to run this loader.</p>

<CodeBlock language="bash">{
`docker pull snowplow/lake-loader-${props.cloud.toLowerCase()}:${versions.lakeLoader}
`}</CodeBlock>

To run the loader, mount your config files into the docker image, and then provide the file paths on the command line:

<CodeBlock language="bash">{
`docker run \\
  -v/path/to/myconfig:/myconfig \\
  snowplow/lake-loader-${props.cloud.toLowerCase()}:${versions.lakeLoader} \\
  --config=/myconfig/loader.hocon \\
  --iglu-config=/myconfig/iglu.hocon
`}</CodeBlock>
