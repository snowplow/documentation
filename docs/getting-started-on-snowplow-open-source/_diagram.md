```mdx-code-block
import Mermaid from '@theme/Mermaid';
```

#### The main components of the pipeline

<Mermaid value={`
flowchart LR
  collect{{"<b>Collector</b>\n<i>stream-collector app</i>\n(${props.compute})"}}
  enrich{{"<b>Enrich</b>\n<i>enrich-${props.stream.toLowerCase()} app</i>\n(${props.compute})"}}
  iglu{{"<b>Iglu Server</b>\n(${props.compute})"}}
  igludb[("<b>Iglu Database</b>\n(RDS)")]
  bad[["<b>Bad Stream</b>\n(${props.stream})"]]
  ${props.warehouse == 'Postgres' ?
    `loader{{"<b>Postgres Loader</b>\n(${props.compute})"}}` :
    `loader("<b>${props.warehouse} Loader</b>\n<i>(see below)</i>")`
  }
  atomic[("<b>Events</b>\n(${props.warehouse})")]
  collect---iglu %% invisible link for alignment
  enrich-.-oiglu<-.->igludb
  collect-->|"<b>Raw Stream</b><br/>(${props.stream})"| enrich
  enrich-->|"<b>Enriched Stream</b><br/>(${props.stream})"| loader-->atomic
  collect & enrich -.->|<i>events that<br/>fail validation</i>| bad
  loader -.->|<i>events that<br/>fail loading</i>| bad
  linkStyle 0 stroke:none,fill:none
`}/>

#### Archival and failed events

<div style={{width: '50%'}}>
<Mermaid value={`
flowchart LR
  ${props.bucket == 'S3' ?
    `raw[["<b>Raw Stream</b>\n(${props.stream})"]]
    blobloaderraw{{"<b>${props.bucket} Loader Raw</b>\n(${props.compute})"}}
    blobraw[("<b>Raw Events</b>\n(${props.bucket})")]
    good[["<b>Enriched Stream</b>\n(${props.stream})"]]
    blobloadergood{{"<b>${props.bucket} Loader Good</b>\n(${props.compute})"}}
    blobgood[("<b>Enriched Events</b>\n(${props.bucket})")]
    raw-->blobloaderraw-->blobraw
    good-->blobloadergood-->blobgood` : ''}
  bad[["<b>Bad Stream</b>\n(${props.stream})"]]
  blobloaderbad{{"<b>${props.bucket} Loader Bad</b>\n(${props.compute})"}}
  blobbad[("<b>Failed Events</b>\n(${props.bucket})")]
  bad-->blobloaderbad-->blobbad
  ${props.warehouse == 'Postgres' ?
    `psloaderbad{{"<b>Postgres Loader Bad</b>\n(${props.compute})"}}
    psbad[("<b>Failed events</b>\n(Postgres)")]
    bad-->psloaderbad-->psbad` : ''}
`}/>
</div>
