At the high level, BigQuery loader reads enriched Snowplow events in real time and loads them in BigQuery using the [legacy streaming API](https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery). 

```mermaid
flowchart LR
  stream[["<b>Enriched events</b>\n(Pub/Sub stream)"]]
  loader{{"<b>BigQuery Loader</b>\n(Loader, Mutator and Repeater apps)"}}
  subgraph BigQuery
    table[("<b>Events table</b>")]
  end
  stream-->loader-->BigQuery
```

BigQuery loader consists of three applications: Loader, Mutator and Repeater. The following diagram illustrates the interaction between them and BigQuery:

```mermaid
sequenceDiagram
  loop
    Note over Loader: Read a small batch of events
    Loader-->>+Mutator: Communicate event types (via Pub/Sub)
    Loader->>BigQuery: Send events using the Storage Write API
    Mutator-->>-BigQuery: Adjust column types if necessary
    Repeater->>BigQuery: Resend events that failed<br/>because columns were not up to date
  end
```
