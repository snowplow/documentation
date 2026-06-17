```mdx-code-block
import Mermaid from '@theme/Mermaid';
```

<p>On {props.cloud} the Lake Loader continually pulls events from {props.stream} and writes to {props.bucket}.</p>

<Mermaid value={`
flowchart LR
  stream[["<b>Enriched Events</b>\n(${props.stream} stream)"]]
  loader{{"<b>Lake Loader</b>"}}
  subgraph bucket ["${props.bucket}"]
    table[("<b>Events table</b>")]
  end
  stream-->loader-->bucket
  ${props.warehouse ? `
    subgraph warehouse ["${props.warehouse}"]
      external[("<b>External table<br/>or data source<b>")]
    end
    bucket-.->warehouse
  ` : ''}
`}/>

