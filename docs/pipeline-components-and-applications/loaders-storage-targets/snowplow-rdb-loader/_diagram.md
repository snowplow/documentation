```mdx-code-block
import Mermaid from '@theme/Mermaid';
```

<p>At the high level, RDB Loader reads batches of enriched Snowplow events, converts them to the format supported by {props.warehouse}, stores them in an {props.bucket} bucket and instructs {props.warehouse} to load them.</p>

<Mermaid value={`
flowchart LR
  stream[["<b>Enriched events</b>\n(${props.stream} stream)"]]
  ${props.batch ? `
    s3loader{{"<b>S3 Loader</b>"}}
    prebucket[("<b>Enriched events</b>\n(S3 bucket)")]
  ` : ''}
  loader{{"<b>RDB Loader</b>\n(Transformer and Loader apps)"}}
  bucket[("<b>Transformed Events</b>\n(${props.bucket} bucket)")]
  subgraph "${props.warehouse}"
    table[("<b>Events table</b>")]
    ${props.shredding ? 'tables[("<b>Extra event/entity tables</b>")]' : ''}
  end
  stream-->${props.batch ? 's3loader-->prebucket-->' : ''}loader-->bucket--->${props.warehouse}
`}/>

<p>RDB loader consists of two applications: Transformer and Loader. The following diagram illustrates the interaction between them and {props.warehouse}.</p>

<Mermaid value={`
sequenceDiagram
  loop
    Note over Transformer: Read a batch of events
    Note over Transformer: Transform events to ${props.format}
    ${props.shredding ? 'Note over Transformer: Split out self-describing events and entities' : ''}
    Note over Transformer: Write data to the ${props.bucket} bucket
    Transformer->>Loader: Notify the loader (via ${props.queue})
    Loader->>${props.warehouse}: Send SQL commands for loading
    Note over ${props.warehouse}: Load the data from the ${props.bucket} bucket using “COPY FROM”
  end
`}/>
