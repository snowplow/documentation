## Overview

The HTTP Header enrichment is designed to take fields from an HTTP request header. When a user browses to your site, their browser (client) makes an HTTP request to your web server. Within this request are name & value pairs which include particular details such as the type, capabilities and version of the browser that is generating the request, the operating system used by the client, the page that was requested, the various types of outputs accepted by the browser, and so on.

## Output

This enrichment will create new columns in your data wharehouse for the particular parameters you specify in the configuration file for the enrichment.

For example, if you specify to collect all parameters in an HTTP Header, the enrichment will create new columns for every parameter and fill the rows with the values for those parameters for every event.

You specify which parameters to collect by using a Regular Expression in the “headersPattern” field of the configuration file.

The parameters come through via the _contexts\_org\_ietf\_http\_header\_1_ context and so the table/columns will be labeled as such in your data wharehouse.

This enrichment is processed first in the enrichment process.

## Example

The example configuration below extracts only the “Hosts” field in an HTTP request.

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/http_header_extractor_config/jsonschema/1-0-0",
  "data": {
    "name": "http_header_extractor_config",
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "enabled": true,
    "parameters": {
      "headersPattern": [
        "Host|Origin"
      ]
    }
  }
}
```

The example above would take only the name and value pair for “Hosts” and add the field as an individual column in a derived table that might look like such:

| HOSTS |
| --- |
| localhost:8080 |
| acme.com |
