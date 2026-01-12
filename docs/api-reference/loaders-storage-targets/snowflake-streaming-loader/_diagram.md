```mdx-code-block
import Mermaid from '@theme/Mermaid';
import Link from '@docusaurus/Link';
```

<p>On {props.cloud}, the Snowflake Streaming Loader continually pulls events from {props.stream} and writes to Snowflake using the <Link to="https://docs.snowflake.com/en/user-guide/data-load-snowpipe-streaming-overview">Snowpipe Streaming API</Link>.</p>

<Mermaid value={`
flowchart LR
  stream[["<b>Enriched Events</b>\n(${props.stream} stream)"]]
  loader{{"<b>Snowflake Streaming Loader</b>"}}
  subgraph snowflake [Snowflake]
    table[("<b>Events table</b>")]
  end
  stream-->loader-->|Snowpipe Streaming API|snowflake
`}/>
