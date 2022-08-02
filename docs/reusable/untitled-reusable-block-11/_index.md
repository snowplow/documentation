**Warning: The JavaScript Enrichment is a powerful tool and should be used with care. Do not allow untrusted third parties to edit your script.**

### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow/javascript\_script\_config/jsonschema/1-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-0) Compatibility r66+ Data provider None

### Overview

This enrichment lets you write a JavaScript function which is executed in the Enrichment process for each enriched event, and returns one or more _derived contexts_ which are attached to the final enriched event. Use this enrichment to apply your own business logic to your enriched events at the row-level; JavaScript functions across multiple rows are not supported. Because your JavaScript function can throw exceptions which are gracefully handled by the calling Enrichment process, you can also use this enrichment to provide simple filtering of events. This is the field which this enrichment will augment:

- derived\_contexts

### Example

#### JavaScript function

Your JavaScript must include a function, `process(event)`, which:

- Takes a [Snowplow enriched event POJO](https://github.com/snowplow/snowplow/blob/master/3-enrich/scala-common-enrich/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/outputs/EnrichedEvent.scala)(Plain Old Java Object) as its sole argument
- Returns a JavaScript array of valid self-describing JSONs, which will be added to the `derived_contexts` field in the enriched event
- Returns `[]` or `null` if there are no contexts to add to this event
- Can `throw` exceptions but note that throwing an exception will cause the entire enriched event to end up in the Bad Bucket or Bad Stream

Note that you can also include other top-level functions and variables in your JavaScript script – but you must include a `process(event)` function somewhere in your script. Here is an example:

SECRET\_APP\_ID = 'Joshua';

/\*\*
 \* Performs two roles:
 \* 1. If this is a server-side event, we
 \*    validate that the app\_id is our
 \*    valid secret. Prevents spoofing of
 \*    our server-side events
 \* 2. If app\_id is not null, return a new
 \*    Acme context, derived\_app\_id, which
 \*    contains the upper-cased app\_id
 \*/
function process(event) {
    var appId = event.getApp\_id();
    var platform = event.getPlatform();

    if (platform == 'server' && appId != SECRET\_APP\_ID) {
        throw "Server-side event has invalid app\_id: " + appId;
    }

    if (appId == null) {
        return \[\];
    }

    var appIdUpper = new String(appId.toUpperCase());
    return \[ { schema: "iglu:com.acme/derived\_app\_id/jsonschema/1-0-0",
               data:  { appIdUpper: appIdUpper } } \];
}

Please note:

- You must use a Java-style getter to retrieve the `app_id` from the event ([more information](https://snowplowanalytics.com/blog/2013/10/21/scripting-hadoop-part-1-adventures-with-scala-rhino-and-javascript/))
- The Java-style getters will return JavaScript String Objects, so beware of type and value checking them against string primitives with `===`. e.g. `event.getApp_id() != 'Joshua'` will be true but `event.getApp_id() !== 'Joshua'` will be false.
- We have to convert the uppercased `appId` back to a JavaScript String Object before we return it ([more information](http://nelsonwells.net/2012/02/json-stringify-with-mapped-variables/))

#### JSON configuration file

The self-describing JSON to configure this enrichment with the above JavaScript script is as follows:

{
    "schema": "iglu:com.snowplowanalytics.snowplow/javascript\_script\_config/jsonschema/1-0-0",
    "data": {
        "vendor": "com.snowplowanalytics.snowplow",
        "name": "javascript\_script\_config",
        "enabled": true,
        "parameters": {
            "script": "Y29uc3QgU0VDUkVUX0FQUF9JRCA9ICJKb3NodWEiOw0KDQovKioNCiAqIFBlcmZvcm1zIHR3byByb2xlczoNCiAqIDEuIElmIHRoaXMgaXMgYSBzZXJ2ZXItc2lkZSBldmVudCwgd2UNCiAqICAgIHZhbGlkYXRlIHRoYXQgdGhlIGFwcF9pZCBpcyBvdXINCiAqICAgIHZhbGlkIHNlY3JldC4gUHJldmVudHMgc3Bvb2Zpbmcgb2YNCiAqICAgIG91ciBzZXJ2ZXItc2lkZSBldmVudHMNCiAqIDIuIElmIGFwcF9pZCBpcyBub3QgbnVsbCwgcmV0dXJuIGEgbmV3DQogKiAgICBBY21lIGNvbnRleHQsIGRlcml2ZWRfYXBwX2lkLCB3aGljaA0KICogICAgY29udGFpbnMgdGhlIHVwcGVyLWNhc2VkIGFwcF9pZA0KICovDQpmdW5jdGlvbiBwcm9jZXNzKGV2ZW50KSB7DQogICAgdmFyIGFwcElkID0gZXZlbnQuZ2V0QXBwX2lkKCk7DQoNCiAgICBpZiAocGxhdGZvcm0gPT0gInNlcnZlciIgJiYgYXBwSWQgIT0gU0VDUkVUX0FQUF9JRCkgew0KICAgICAgICB0aHJvdyAiU2VydmVyLXNpZGUgZXZlbnQgaGFzIGludmFsaWQgYXBwX2lkOiAiICsgYXBwSWQ7DQogICAgfQ0KDQogICAgaWYgKGFwcElkID09IG51bGwpIHsNCiAgICAgICAgcmV0dXJuIFtdOw0KICAgIH0NCg0KICAgIHZhciBhcHBJZFVwcGVyID0gbmV3IFN0cmluZyhhcHBJZC50b1VwcGVyQ2FzZSgpKTsNCiAgICByZXR1cm4gWyB7IHNjaGVtYTogImlnbHU6Y29tLmFjbWUvZGVyaXZlZF9hcHBfaWQvanNvbnNjaGVtYS8xLTAtMCIsDQogICAgICAgICAgICAgICBkYXRhOiAgeyBhcHBJZFVwcGVyOiBhcHBJZFVwcGVyIH0gfSBdOw0KfQ=="
        }
    }
}

The “parameters” fields are as follows:

- “script”: Your JavaScript function, Base64 encoded. You can use either URL-safe or regular Base64 encoding

### Data sources

The data source for this enrichment is the entire `enriched/good` event in the form of [Snowplow Plain Old Java Object](https://github.com/snowplow/snowplow/blob/master/3-enrich/scala-common-enrich/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/outputs/EnrichedEvent.scala) produced during common enrichment process.

### Algorithm

This enrichment uses the [Nashorn Javascript engine](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino) to execute your JavaScript. Your JavaScript is pre-compiled so that your code should approach native Java speeds. The `process` function is passed the exact [Snowplow enriched event POJO](https://github.com/snowplow/snowplow/blob/master/3-enrich/scala-common-enrich/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/outputs/EnrichedEvent.scala). The return value from the `process` function is converted into a JSON string (using `JSON.stringify`) in JavaScript before being retrieved in our Scala code. Our Scala code confirms that the return value is either null or an empty or non-empty array of Objects. No validation of the self-describing JSONs is performed. You can review the exact Scala code which executes your JavaScript script in the [JavascriptScriptEnrichment.scala](https://github.com/snowplow/snowplow/blob/master/3-enrich/scala-common-enrich/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/enrichments/registry/JavascriptScriptEnrichment.scala) file.

#### Do’s and Don’ts

This is our most powerful enrichment yet – here are some do’s and don’ts to avoid potential footguns. Do:

- use [Snowplow version tags](https://github.com/snowplow/snowplow/tags) to confirm the fields available in your Snowplow version’s enriched event POJO
- return as many contexts as you want
- throw an exception if you want this enriched event to end up in the Bad Bucket or Bad Stream
- include minified, self-contained JavaScript libraries that your `process(event)` function needs
- test this enrichment on sample sets of events before putting it into production
- ensure your new contexts are defined in Iglu, Redshift, JSON Paths etc

Don’t:

- mutate existing fields in the supplied enriched event – return a new context instead
- try to share state across multiple enriched events – write your own Scalding or Spark job instead
- include CPU-intensive tasks without being aware of the impact on your event processing time
- allow untrusted parties to write your script – the script has access to the Java standard library and therefore to your filesystem.

### Data generated

As during the JavaScript enrichment process the new context is added to `derived_contexts` of the `enriched/good` event, the data generated will end up in its own table determined by the custom self-describing JSON provided by the user with `process(event)` function encoded in [`javascript_script_config`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-0) file.
