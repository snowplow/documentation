---
title: "Custom event tracking"
date: "2022-08-30"
sidebar_position: 20
---

# Custom event tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Self-describing (self-referential) JSON schemas are at the core of Snowplow tracking. Read more about them [here](https://docs.snowplow.io/docs/understanding-tracking-design/understanding-schemas-and-validation/). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

In all our trackers, self-describing JSON are used in two places. One is in the `SelfDescribing` event type that wraps custom self-describing JSONs for sending. The second use is to attach entities to any tracked event.
The entities can describe the context in which the event happen or provide extra information to better describe the event.

<!-- [Here](TODO) are some more details on what events and entities are. -->

## Tracking a custom event (SelfDescribing)

You may wish to track events in your app which are not directly supported by Snowplow and which structured event tracking does not adequately capture. Your event may have more than the five fields offered by Structured events, or its fields may not fit into the category-action-label-property-value model. The solution is Snowplow’s self-describing events. Self-describing events are a [data structure based on JSON Schemas](https://docs.snowplow.io/docs/understanding-tracking-design/understanding-schemas-and-validation/) and can have arbitrarily many fields.

<!-- [Here](TODO) are some more details on how to create a custom entity. -->

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let data = ["targetUrl": "http://a-target-url.com" as NSObject];       
let event = SelfDescribing(schema: "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", payload: data)       

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val data = mapOf(
    "targetUrl" to "http://a-target-url.com"
)
val json = SelfDescribingJson(
    "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",
    data
)
val event = SelfDescribing(json)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Map<String, String> data = new HashMap<>();
data.put("targetUrl", "http://a-target-url.com");
SelfDescribingJson json = new SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", data);
SelfDescribing event = new SelfDescribing(json);

tracker.track(event);
```

  </TabItem>
</Tabs>

A Self Describing event is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/). It has two fields:

- A `data` field, containing the properties of the event
- A `schema` field, containing the location of the JSON schema against which the `data` field should be validated.

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_self_describing.html).

## Tracking a custom entity

Custom entities can be used to augment any standard Snowplow event type with additional data.
Each custom context is an array of self-describing JSON following the same pattern as a self describing event. As with self describing events, if you want to create your own custom entity, you must create a JSON schema.

<!-- [Here](TODO) some more details on how to create a custom entity. -->

Note: Even if only one custom entity is being attached to an event, it still needs to be wrapped in an array.

Here are two examples of schema for custom entities.
One describes a screen:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.example",
        "name": "screen",
        "format": "jsonschema",
        "version": "1-0-1"
    },
    "type": "object",
    "properties": {
        "screenType": {
            "type": "string"
        },
        "lastUpdated": {
            "type": "string"
        }
    }
    "required": ["screenType", "lastUpdated"],
    "additionalProperties": false
}
```

and the other describes a user on that screen:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.example",
        "name": "user",
        "format": "jsonschema",
        "version": "2-0-0"
    },
    "type": "object",
    "properties": {
        "user": {
            "type": "string"
        }
    }
    "required": ["user"],
    "additionalProperties": false
}
```

They can be used in the tracker to provide more context to specific events (e.g.: ScreenView event).

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ScreenView(name: "DemoScreenName")
event.entities.add(
    SelfDescribingJson(schema: "iglu:com.example/screen/jsonschema/1-0-1",
        andDictionary: [
             "screenType": "test",
             "lastUpdated": "2021-06-11"
        ])!)     
event.entities.add(
    SelfDescribingJson(schema: "iglu:com.example/user/jsonschema/2-0-0", 
        andDictionary: [
             "userType": "tester"
        ])!)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = ScreenView("screen")
event.entities.add(
    SelfDescribingJson(
        "iglu:com.example/screen/jsonschema/1-2-1",
        mapOf(
            "screenType" to "test",
            "lastUpdated" to "2021-06-11"
        )
    )
)
event.entities.add(
    SelfDescribingJson(
        "iglu:com.example/user/jsonschema/2-0-0",
        mapOf(
            "userType" to "tester"
        )
    )
)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ScreenView event = new ScreenView("screen");
event.getEntities().add(
    new SelfDescribingJson("iglu:com.example/screen/jsonschema/1-2-1",
        new HashMap<String, String>() {{
            put("screenType", "test");
            put("lastUpdated", "2021-06-11");
        }})
);
event.getEntities().add(
    new SelfDescribingJson("iglu:com.example/user/jsonschema/2-0-0",
        new HashMap<String, String>() {{
            put("userType", "tester");
        }})
);

tracker.track(event);
```

  </TabItem>
</Tabs>

### Adding custom entities to any event (Global Contexts)

It is also possible to add contexts in a declarative way (see GlobalContextsConfiguration [here](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/introduction/)), so that they are applied to all (or a subset of) events within an application.

This can be done at tracker setup declaring the contexts generator and the suitable subset of events.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let staticContext = SelfDescribingJson(schema: "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0", andData: ["key": "staticExample"] as NSMutableDictionary)

let staticGlobalContext = GlobalContext(staticContexts: [staticContext])

let globalContextsConfig = GlobalContextsConfiguration()
    .contextGenerators(["staticExampleTag": staticGlobalContext] as NSMutableDictionary)

let tracker = Snowplow.createTracker(namespace: ..., network: ..., configurations: [..., globalContextsConfig])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val staticContext = SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    mapOf(
        "key" to "staticExample"
    )
)
val staticGlobalContext = GlobalContext(listOf(staticContext))

val globalContextsConfig = GlobalContextsConfiguration(
    mutableMapOf(
        "staticExampleTag" to staticGlobalContext
    )
)

Snowplow.createTracker(applicationContext, namespace, networkConfiguration, globalContextsConfig)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SelfDescribingJson staticContext = new SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    new HashMap<String, String>() {{ put("key", "staticExample"); }}
);
GlobalContext staticGlobalContext = new GlobalContext(Arrays.asList(staticContext));

GlobalContextsConfiguration globalContextsConfig = new GlobalContextsConfiguration(
    new HashMap<String, GlobalContext>() {{ put("staticExampleTag", staticGlobalContext); }}
);

Snowplow.createTracker(getApplicationContext(), namespace, networkConfiguration, globalContextsConfig);
```

  </TabItem>
</Tabs>

The `GlobalContextsConfiguration` can be used to set up the generators which are able to generate the entities to add in the context of the events. Each context generator is associated to a tag string. The tag string can be used to remove a generator at runtime using the method `remove` like in the following example.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
tracker.globalContexts.remove(tag: "staticExampleTag")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
tracker.globalContexts.remove("staticExampleTag")
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
tracker.getGlobalContexts().remove("staticExampleTag");
```

  </TabItem>
</Tabs>

It returns `nil` in case there aren’t generators registered with the specified tag, otherwise it returns the removed `GlobalContext` instance.

A generator can be added at run-time using the method `add` like in the following example.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
tracker.globalContexts.add(tag: "staticExampleTag", contextGenerator: staticGlobalContext)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
tracker.globalContexts.add("staticExampleTag", staticGlobalContext);
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
tracker.getGlobalContexts().add("staticExampleTag", staticGlobalContext);
```

  </TabItem>
</Tabs>

An entity can be an immutable static entity (self-describing JSON) or a dynamic entity based on the event received.

#### Self-describing JSON

This is useful in cases where the entity is static and it's always the same. A classic case is a contextual information like a user identifier that doesn't change during the tracking.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let staticContext = SelfDescribingJson(schema: "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0", andData: ["key": "staticExample"] as NSMutableDictionary)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val staticContext = SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    mapOf(
        "key" to "staticExample"
    )
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SelfDescribingJson staticContext = new SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    new HashMap<String, String>() {{ put("key", "staticExample"); }}
);
```

  </TabItem>
</Tabs>

#### Context generator callback

A context generator callback returns an array of self describing JSONs, representing entities.
They are evaluated each time an event is sent, hence they meet the case where we would like to send an entity based on event information.
The `InspectableEvent` is an interface that exposes internal data of the processed event: name, schema and payload.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let contextGenerator = GlobalContext(generator: {  event in
            return [
                SelfDescribingJson(schema: "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0", andData: ["eventName": event.schema!] as NSMutableDictionary)
            ]
        })
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val contextGenerator = GlobalContext(object : FunctionalGenerator() {
    override fun apply(event: InspectableEvent): List<SelfDescribingJson> {
        return listOf(SelfDescribingJson(
            "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
            mapOf(
                    "eventName" to event.schema
            )
        ))
    }
})
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
GlobalContext contextGenerator = new GlobalContext(new FunctionalGenerator() {
    @Nullable
    @Override
    public List<SelfDescribingJson> apply(@NonNull InspectableEvent event) {
        return Arrays.asList(new SelfDescribingJson(
                "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
                new HashMap<String, String>() {{ put("eventName", event.getSchema()); }}
        ));
    }
});
```

  </TabItem>
</Tabs>

#### Conditional Context Providers

The previous examples described the generation of entities that are associated to every event.
However, there are cases where the contexts should only be applied to certain events.

##### Filter Callback

A filter callback is used to discriminate between events so we can attach global contexts only to certain events.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let filteredGC = SPGlobalContext(
    staticContexts: [
        SPSelfDescribingJson(schema: "iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1", andData: [
            "key": "value"
        ])
    ],
    filter: { event in
        return "se" == event?.name
    })
tracker.add(filteredGC, tag: "tag1")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val staticContext = SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    mapOf(
        "key" to "staticExample"
    )
)
val staticGlobalContext =
    GlobalContext(listOf(staticContext), object : FunctionalFilter() {
        override fun apply(event: InspectableEvent): Boolean {
            return event.name === "se"
        }
    })
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SelfDescribingJson staticContext = new SelfDescribingJson(
        "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
        new HashMap<String, String>() {{ put("key", "staticExample"); }}
);
GlobalContext staticGlobalContext = new GlobalContext(Arrays.asList(staticContext), new FunctionalFilter() {
    @Override
    public boolean apply(@NonNull InspectableEvent event) {
        return event.getName() == "se";
    }
});
```

  </TabItem>
</Tabs>

##### Ruleset Provider

A ruleset provider is used when you want to attach a global context to certain events based on the schema URI.

A ruleset provider has a ruleset which has a list of allowed schemas and a list of denied schemas. Both lists contain Iglu URIs which can be modified based on some syntactic rules.

In this example, the ruleset provider will attach the generated entities (as described in the previous section) to events with the schema `iglu:com.acme.*/*/jsonschema/*-*-*`, but not to `iglu:com.acme.marketing/*/jsonschema/*-*-*`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let allowed:String! = "iglu:com.snowplowanalytics.*/*/jsonschema/*-*-*"
let denied:String! = "iglu:com.snowplowanalytics.mobile/*/jsonschema/*-*-*"

let ruleset:SPSchemaRuleset! = SPSchemaRuleset.rulesetWithAllowedList([allowed], andDeniedList:[denied])
let rulesetGC:SPGlobalContext! = SPGlobalContext(staticContexts:[
    SPSelfDescribingJson(schema:"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1", andData:["key": "value"])
    ], ruleset:ruleset)

tracker.add(rulesetGC tag: "tag1")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val allowed = "iglu:com.snowplowanalytics.*/*/jsonschema/*-*-*"
val denied = "iglu:com.snowplowanalytics.mobile/*/jsonschema/*-*-*"

val staticContext = SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    mapOf(
        "key" to "staticExample"
    )
)
val staticGlobalContext = GlobalContext(
    listOf(staticContext),
    buildRuleSet(listOf(allowed), listOf(denied))
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
String allowed = "iglu:com.snowplowanalytics.*/*/jsonschema/*-*-*";
String denied = "iglu:com.snowplowanalytics.mobile/*/jsonschema/*-*-*";

SelfDescribingJson staticContext = new SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    new HashMap<String, String>() {{ put("key", "staticExample"); }}
);
GlobalContext staticGlobalContext = new GlobalContext(
    Arrays.asList(staticContext),
    SchemaRuleSet.buildRuleSet(Arrays.asList(allowed), Arrays.asList(denied))
);
```

  </TabItem>
</Tabs>

###### Ruleset Format

Ruleset rules are the strings used to match against certain schemas, such as `iglu:com.acme/*/jsonschema/*-*-*`.

They follow the same five-part format as an Iglu URI `protocol:vendor/event_name/format/version` with the exception that a wildcard can be used to refer to all cases.

The parts of a rule are wildcarded with certain guidelines:

- asterisks cannot be used for the protocol (i.e. schemas always start with `iglu:`);
- version matching must be specified like so: *–*–*, where any part of the versioning can be defined, e.g. 1-*–*, but only sequential parts can be wildcarded, e.g. 1-*-1 is invalid but 1-1–* is valid;
- at least two parts: `com.acme.*` is valid, while `com.*` is not;
- vendors cannot be defined with non-wildcarded parts between wildcarded parts: `com.acme.*.marketing.*` is invalid, while `com.acme.*.*` is valid.

##### Context Generator

In case the logic for filter and generator callbacks are too complex, it’s possible to specify them in a class that implements the [`ContextGenerator` protocol](https://docs.snowplow.io/snowplow-android-tracker/interfacecom_1_1snowplowanalytics_1_1snowplow_1_1globalcontexts_1_1_context_generator.html).

In this case the logic for filtering and generation is encapsulated behind a context generator class.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
class GlobalContextGenerator : SPContextGenerator {

    func filter(event:SPInspectableEvent!) -> Bool {
        return true
    }

    func generator(event:SPInspectableEvent!) -> [Any]! {
        return [
            SPSelfDescribingJson(schema:"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1", andData:["key": "value"]),
        ]
    }
}
```

It can be passed to the tracker as usual:

```swift
let contextGeneratorGC:SPGlobalContext! = SPGlobalContext(contextGenerator: GlobalContextGenerator())
tracker.add(contextGeneratorGC, tag: "tag1")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val staticGlobalContext = GlobalContext(object : ContextGenerator {
    override fun generateContexts(event: InspectableEvent): List<SelfDescribingJson> {
        return listOf(SelfDescribingJson(
            "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
            mapOf(
                    "eventName" to event.schema
            )
        ))
    }

    override fun filterEvent(event: InspectableEvent): Boolean {
        return true
    }
})
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
GlobalContext staticGlobalContext = new GlobalContext(new ContextGenerator() {
    @NonNull
    @Override
    public List<SelfDescribingJson> generateContexts(@NonNull InspectableEvent event) {
        return Arrays.asList(new SelfDescribingJson(
                "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
                new HashMap<String, String>() {{ put("eventName", event.getSchema()); }}
        ));
    }

    @Override
    public boolean filterEvent(@NonNull InspectableEvent event) {
        return true;
    }
});
```

  </TabItem>
</Tabs>
