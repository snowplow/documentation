---
title: "Configure HTTP Request Tag for GTM Server Side"
sidebar_label: "Configuration"
date: "2022-01-06"
sidebar_position: 100
description: "Configure JSON request body construction, entity mapping, custom headers, and post-processing for the HTTP Request Tag in GTM Server Side."
keywords: ["HTTP Request Tag configuration", "JSON body", "entity mapping", "custom endpoints"]
---

In the following short video a complete example configuration of the Snowplow GTM SS HTTP Request Tag is presented.

```mdx-code-block
import TrackedReactFilePlayer from '@site/src/components/TrackedReactFilePlayer'
import videoUrl from './images/http_request_tag_example_configuration.mp4'

<TrackedReactFilePlayer label="HTTP Request Tag Example Configuration" controls url={videoUrl} width='100%' height='100%'/>
<br/>
```

Scenario: The example assumes that we want to send a POST HTTP Request to an example custom destination endpoint, where we would like the body of the request to have the following structure:

```json
{
  "api-key": "myApiKey",
  "user_identifier": ...
  "event_data": {
    ...
  },
  "user_data": {
    ...
  }
}
```

where, for this example:

- Our endpoint expects the `api-key` inside the request body.
- As our `user_identifier` we want to map the value of the `client_id` from the client event.
- Inside `event_data` we want to include:
    - the common event data
    - the Self-Describing event data
    - the performance timing data from the Snowplow [Performance Timing Context](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceTiming/jsonschema/1-0-0)), with `performance_timing` as the property name
    - the page view id from the Snowplow [web_page context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0), with `page_view_id` as the property name.
- Under `user_data` we want to map the `user_data` from the client event.

You can read on below for more details on each configuration option.

## Configuration options

### Destination URL (required)

Set this to the URL of your custom HTTP endpoint.

### Wrap the request body inside an array

By default, the JSON body is an object. For example:

```json
{ "myProperty": "myValue" }
```

This option allows you to wrap the resulting object of the request body inside an array:

```json
[{ "myProperty": "myValue" }]
```

### Include all event data in the request body

This option allows you to relay the full client event into the body of the request. Enabling this option, consequently disables both the Snowplow and the Additional Event Mapping Options, which allow to cherry-pick event properties and customize the request body.

### Use alternative separator to dot notation

Enable this option to use an alternative separator to dot notation when specifying possibly nested object paths. This setting **applies everywhere dot notation can be used** and it is useful when you want to allow dots or special characters in key names. Enabling this option reveals the text-box where you can specify the character you wish to use to denote nested paths.

#### Example

Let's imagine this property name: `user_data.address.city`

This is by default being interpreted as a nested path, where the dot character denotes a change in nesting level:

```json
  "user_data": {
      "address": {
          "city": "Foobar City"
      }
  }
```

If you wish it to denote a different nesting path where a key name may include a dot, for example:

```json
  "user_data.address": {
      "city": "Foobar City"
  }
```

then you can use this setting to set a different separator for nesting. As an example, if you set:

![first alternative separator example](images/first_alt_separator_example.png)

then the tilde character (`~`) denotes nesting everywhere "dot notation" can be used. You can now denote the example path above as `user_data.address~city`.

It is also possible to use more than one character as alternative separator, for example:

![second alternative separator example](images/second_alt_separator_example.png)

Now, you can denote nesting by using 2 dots, and the example path above can be denoted as `user_data.address..city`.


## Snowplow Event Mapping Options

This section includes the mapping rules that concern a Snowplow event as claimed by the [Snowplow Client](/docs/destinations/forwarding-events/google-tag-manager-server-side/snowplow-client-for-gtm-ss/index.md):

### Snowplow Atomic Properties Rules

This option indicates if all Snowplow [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) properties of the event should be included in the JSON body. By default this option is disabled.

If enabled, an additional text field optionally allows you to specify a key under which those atomic properties will be nested. Leaving it blank adds those properties in the request body without nesting. Dot notation can also be used here.

As an example, this section configured as:

![snowplow atomic properties rules](images/snowplow_atomic_nest.png)

will result in the following JSON structure:

```json
{
    ...,
    "snowplow_atomic": {
        "app_id": "fooBar",
        "platform": "mobile",
        ...
    },
    ...
}
```

Please, note that some of the Snowplow atomic properties are already mapped to [common event properties](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) by the [Snowplow Client](/docs/destinations/forwarding-events/google-tag-manager-server-side/snowplow-client-for-gtm-ss/index.md).

### Snowplow Self-Describing Event Rules

This option indicates if the Snowplow Self-Describing data will be included in the request body and it is enabled by default.

Similarly to the above section, you can also specify a key under which the self-describing data will be nested. Leaving it blank adds those properties in the request body without nesting. Dot notation can also be used here.

As an example, this section configured as:

![snowplow self-describing event rules](images/snowplow_self_desc_no_nest.png)

will result in the following JSON structure:

```json
{
    ...,
    "self_describing_event_com_acme_test_foo_1": {
        "mySelfDescProp": "exampleValue",
        ...
    },
    ...
}
```

### Snowplow Event Context Rules

This section describes how the HTTP Request tag will use the context Entities attached to a Snowplow Event.

![snowplow event context rules](images/context_rules.png)

#### Extract entity from Array if single element

Snowplow Entities are always in Arrays, as multiple of the same entity can be attached to an event. This option will pick the single element from the array if the array only contains a single element.

#### Include Snowplow Entities in request body

Using this drop-down menu you can specify whether you want to Include `All` (default) or `None` of the Snowplow context entities in HTTP Request's body.

#### Nest all unmapped Entities under key

This option is available only if the previous option ([Include Snowplow Entities in request body](#include-snowplow-entities-in-request-body)) is set to `All`.

It applies **only** to unmapped entities, i.e. all included entities whose mapping is not edited in the following ([Snowplow Entities to Add/Edit mapping](#snowplow-entities-to-addedit-mapping)) table.

With this setting you can specify a key under which the Snowplow event's unmapped entities will be nested. Alternatively, leaving it blank adds the unmapped entities in the request body without nesting. You can also use dot notation in this value.

#### Snowplow Entities to Add/Edit mapping

Using this table you can specify in each row a specific mapping for a particular context entity. In the columns provided you can specify:

- **Entity Name**: The Entity name to add/edit-mapping (required).¹
- **Destination Mapped Name**: The key you could like to map it to in the request body (optional: leaving the mapped key blank keeps the same name). You can use dot notation here as well to signify further nesting. This value is independent of the [nesting of unmapped entities](#nest-all-unmapped-entities-under-key) setting above.
- **Apply to all versions**: Whether you wish the mapping to apply to all versions of the entity (default value is `False`).¹

#### Snowplow Entities to Exclude

Using this table (which is only available if [Include Snowplow Entities in request body](#include-snowplow-entities-in-request-body) is set to `All`), you can specify the context entities you want to exclude from the HTTP Request body. In its columns you can specify:

- **Entity Name**: The Entity name (required).¹
- **Apply to all versions**: Whether the exclusion applies to all versions of the entity (default value is `False`).¹

:::note

¹ How to specify the **Entity Name** and its relation to **Apply to all versions** option:

Entity Names can be specified in 3 ways:

1. By their Iglu Schema tracking URI (e.g. `iglu:com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2`)

2. By their enriched name (e.g. `contexts_com_snowplowanalytics_snowplow_client_session_1`)

3. By their key in the client event object, which is the GTM SS Snowplow prefix (`x-sp-`) followed by the enriched entity name (e.g. `x-sp-contexts_com_snowplowanalytics_snowplow_client_session_1`)

Depending on the value set for the **Apply to all versions** column, the major version number from the 2nd and 3rd naming option above may be excluded. More specifically, this is only permitted if **Apply to all versions** is set to `True`.

:::

<details>

<summary><i>pre-v0.2.0</i></summary>

#### Snowplow Event Context Rules

This section describes how the HTTP Request tag will use the context Entities attached to a Snowplow Event.

##### Extract entity from Array if single element

Snowplow Entities are always in Arrays, as multiple of the same entity can be attached to an event. This option will pick the single element from the array if the array only contains a single element.

##### Include all Entities in request body

Leaving this option enabled (default) ensures that all Entities on an event will be included within the request data.

Optionally, you can also specify a key under which the Snowplow event's contexts will be nested. Alternatively, leaving it blank adds all entities in the request body without nesting.

Disabling this option, reveals the options so that individual entities can be selected for inclusion. Using the "Snowplow Entity Mapping" table, these entities can also be remapped to have different names in the JSON body of the request. The entity can be specified in two different formats:

- Major version match: `x-sp-contexts_com_snowplowanalytics_snowplow_web_page_1` where `com_snowplowanalytics_snowplow` is the event vendor, `web_page` is the schema name and `1` is the Major version number. `x-sp-` can also be omitted from this if desired
- Full schema match: `iglu:com.snowplowanalytics.snowplow/webPage/jsonschema/1-0-0`

##### Include unmapped entities in request body

This option enables you to ensure that all unmapped entities (i.e. any entites not found in the "Snowplow Entity Mapping" rules above) will be included in the request body.

Again, optionally, you can also specify a key under which the Snowplow event's unmapped entities will be nested. Alternatively, leaving it blank adds the unmapped entities in the request body without nesting.

</details>

## Additional Event Mapping Options

If you wish to pick other properties from the Client event and map them into the request body, this can be specified in this section.

### Event Property Rules

#### Include common event properties

Enabled by default, this option sets whether to include the event properties from the [Common Event definition](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) in the request body. Inclusion of the `user_data` property is not affected by this setting (see next option).

Also, you can optionally specify a key under which the Common Event properties will be nested. Alternatively, leaving it blank adds the the common event properties in the request body without nesting.

#### Include common user properties

Disabled by default, this option sets whether to include the `user_data` properties from the common event definition in the request body.

Again, you can optionally specify a key under which the `user_data` properties from the common event will be nested. Alternatively, leaving it blank adds the `user_data` in the request body without nesting.

#### Additional Event Property Mapping Rules

Using this table, you can additionally specify the Property Key from the Client Event, and then the key you could like to map it to (or leave the mapped key blank to keep the same name). You can use Key Path notation here (e.g. `x-sp-tp2.p` for a Snowplow events platform or `x-sp-contexts_com_snowplowanalytics_snowplow_web_page_1.0.id` for a Snowplow events page view id (note the array index 0) or pick non-Snowplow properties if using an alternative Client.

## Additional Request Data

This section allows you to add custom properties in the request body that are "external" to the event, in other words it provides the ability to add custom constant or variable request data.

## Post-processing

![post processing](images/post_processing.png)

This section provides a way to easily configure some basic post-processing of values in the constructed HTTP request payload. The order of the subsections denotes the post-processing order. For more advanced use cases you can still use the **Additional Request Data** section above and provide values through GTM server-side variables.

### JSON Stringify

In this table you can specify the property names or paths of the HTTP request payload whose values you want to transform into JSON strings. Dot notation can also be used to denote nested paths.

### Encode base64url

In this table you can specify the property names or paths of the HTTP request payload whose values you want to encode to base64url. Encoding is only applied to string values. Dot notation can also be used to denote nested paths.

## Request Headers

Similarly to the above, this section allows you to add custom headers to the HTTP request towards your custom endpoint.

## Additional Options

Finally, this section offers two additional configuration options:

- Changing the HTTP request method from POST (default) to PUT.
- Changing the default request timeout (5000 seconds)

## Logs Settings

Through the Logs Settings you can control the logging behavior of the HTTP Request Tag. The available options are:

- `Do not log`: This option allows you to completely disable logging. No logs will be generated by the Tag.
- `Log to console during debug and preview`: This option enables logging only in debug and preview containers. This is the **default** option.
- `Always`: This option enables logging regardless of container mode.

:::note

Please take into consideration that the logs generated may contain event data.

:::

The logs generated by the HTTP Request GTM SS Tag are standardized JSON strings.
The standard log properties are:

```json
{
    "Name": "HTTP Request", // the name of the tag
    "Type": "Message",      // the type of log (one of "Message", "Request", "Response")
    "TraceId": "xxx",       // the "trace-id" header if exists
    "EventName": "xxx"      // the name of the event the tag fired at
}
```

Depending on the type of log, additional properties are logged:

| Type of log | Additional information                                         |
| ----------- | -------------------------------------------------------------- |
| Message     | “Message”                                                      |
| Request     | “RequestMethod”, “RequestUrl”, “RequestHeaders”, “RequestBody” |
| Response    | “ResponseStatusCode”, “ResponseHeaders”, “ResponseBody”        |
