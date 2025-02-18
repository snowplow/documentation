```mdx-code-block
import Mermaid from '@theme/Mermaid';
import Link from '@docusaurus/Link';
```
<p>The BigQuery Streaming Loader on {props.cloud} is a fully streaming application that continually pulls events from {props.stream} and writes to BigQuery using the <Link to="https://cloud.google.com/bigquery/docs/write-api">BigQuery Storage API</Link>.</p>

<Mermaid value={`
flowchart LR
  stream[["<b>Enriched Events</b>\n(${props.stream} stream)"]]
  loader{{"<b>BigQuery Loader</b>"}}
  subgraph bigquery [BigQuery]
    table[("<b>Events table</b>")]
  end
  stream-->loader-->|BigQuery Storage API|bigquery
`}/>
