```mdx-code-block
import Mermaid from '@theme/Mermaid';
import Link from '@docusaurus/Link';
```

The Databricks Streaming Loader on {props.cloud} is an application that integrates with a Databricks [Lakeflow Declarative Pipeline](https://docs.databricks.com/aws/en/dlt/) to load Snowplow events into Databricks with low latency.

There are two parts to this integration.  In the first part, you use Snowplow's Databricks Streaming Loader to push staging files into a [Unity Catalog volume](https://docs.databricks.com/aws/en/volumes/).

<Mermaid value={`
flowchart LR
  stream[["<b>Enriched Events</b>\n(${props.stream} stream)"]]
  loader{{"<b>Databricks Streaming Loader</b>"}}
  subgraph databricks [Databricks]
    volume[("<b>Volume</b>")]
  end
  stream-->loader-->|REST API|databricks
`}/>

In the second part, you use a Databricks Lakeflow Declarative Pipeline to load the staging files into a Streaming Live Table

<Mermaid value={`
flowchart LR
  subgraph databricks [Databricks]
      direction LR
      volume[("<b>Volume</b>")]
      pipeline{{"<b>Lakeflow Declarative Pipeline</b>"}}
      table[("<b>Delta Table</b>")]
      volume-->pipeline-->table
  end
`}/>
