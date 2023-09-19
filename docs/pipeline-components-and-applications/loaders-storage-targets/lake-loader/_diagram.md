```mdx-code-block
import Mermaid from '@theme/Mermaid';
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

