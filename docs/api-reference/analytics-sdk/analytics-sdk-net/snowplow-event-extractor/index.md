---
title: "Snowplow event extractor"
date: "2021-03-26"
sidebar_position: 1040
---

[Azure Data Lake](https://azure.microsoft.com/en-in/solutions/data-lake/) is a secure and scalable data storage and analytics service. [Azure Data Lake Analytics](https://azure.microsoft.com/en-in/services/data-lake-analytics/) includes [U-SQL](https://blogs.msdn.microsoft.com/visualstudio/2015/09/28/introducing-u-sql-a-language-that-makes-big-data-processing-easy/), a big-data query language for writing queries that analyze data.

## Event Extractor

Snowplow Event Extractor is an ADLA custom extractor that allows you to parse **[Snowplow enriched events](/docs/fundamentals/canonical-event/index.md)**. Snowplow’s enrichment process outputs enriched events in a TSV format consisting of 131 fields.

EventExtractor implements IExtractor interface:

```csharp
[SqlUserDefinedExtractor]
public class EventExtractor : IExtractor
{
    private static readonly string ROW_DELIMITER = '\t';

    public override IEnumerable<IRow> Extract(IUnstructuredReader input, IUpdatableRow output)
    {
       //split the input based on ROW_DELIMITER
       //set the output data on the output object
       //EventExtractor only outputs columns and values that are defined with the output.
    }
}
```

## Usage

Following is base U-SQL script that uses a Event Extractor:

```sql
DECLARE @input_file string = @"\snowplow\event.tsv";

@rs0 =
    EXTRACT
        app_id string,
        platform string
    FROM @input_file
    USING new Snowplow.EventExtractor();
```

The most complex piece of processing is the handling of the self-describing JSONs found in the enriched event's unstruct_event, contexts and derived_contexts fields.
Consider contexts found in the tsv:

```json
{
    'schema': 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0',
    'data': [{
        'schema': 'iglu:org.schema/WebPage/jsonschema/1-0-0',
        'data': {
            'genre': 'blog',
            'inLanguage': 'en-US',
            'datePublished': '2014-11-06T00:00:00Z',
            'author': 'Devesh Shetty',
            'breadcrumb': ['blog', 'releases']
        }
    }, {
        'schema': 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0',
        'data': {
            'navigationStart': 1415358089861,
            'unloadEventStart': 1415358090270,
            'unloadEventEnd': 1415358090287,
            'redirectStart': 0,
            'redirectEnd': 0
        }
    }]
}
```

One of the ways to fetch data from context would be to use user-defined function(UDF):

```sql
DECLARE @input_file string = @"\snowplow\event.tsv";

//extract context from tsv
@rs0 =
    EXTRACT
        context string
    FROM @input_file
    USING new Snowplow.EventExtractor();

/*
context has nested data array
*/
@parseData =
    SELECT Microsoft.Analytics.Samples.Formats.Json.JsonFunctions.JsonTuple(context, "data[*]").Values AS data_arr,
    FROM @rs0;

/*
The nested data array inside context consists of an array from which we parse the inner data field
*/
@parseGenre =
    SELECT Microsoft.Analytics.Samples.Formats.Json.JsonFunctions.JsonTuple(data_arr, "$.data.genre").Values AS genre,
    FROM @parseData;
```

The above process can get quite complex.
So to abstract away the complexity, Snowplow Event Extractor follows a simple mapping:

```sql
DECLARE @input_file string = @"\snowplow\event.tsv";

//extract genre from context directly
@rsGenre =
    EXTRACT
        context.data.genre
    FROM @input_file
    USING new Snowplow.EventExtractor();
```
