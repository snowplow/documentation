---
title: "Declarative entities with global context for mobile trackers"
sidebar_label: "Declarative entities with Global Context"
date: "2022-08-30"
sidebar_position: 20
---

# Declarative entities with Global Context

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

As well as [adding context entities](/docs/sources/trackers/mobile-trackers/custom-tracking-using-schemas/index.md) to each individual event, it is possible to add context entities in a declarative way, so that they are applied to all (or a subset of) events within an application.

This can be done at tracker setup by providing a `GlobalContextConfiguration`. The logic for each global context entity is held within a `GlobalContext` generator. Multiple `GlobalContext` can be provided to the `GlobalContextConfiguration`, along with an identifying name or tag.

This example code shows the simplest kind of `GlobalContext` configuration: the same (static) self-describing JSON entity will be attached to every event tracked.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
// context entity to add to all events
let staticContext = SelfDescribingJson(schema: "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0", andData: ["key": "staticExample"])

// create a GlobalContext instance with the entity as a static context
let staticGlobalContext = GlobalContext(staticContexts: [staticContext])

// create a GlobalContextsConfiguration and assign the GlobalContext with a unique tag identifier
let globalContextsConfig = GlobalContextsConfiguration()
    .contextGenerators(["staticExampleTag": staticGlobalContext])

// pass the configuration when creating a new tracker
let tracker = Snowplow.createTracker(namespace: ..., network: ..., configurations: [..., globalContextsConfig])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// context entity to add to all events
val staticContext = SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    mapOf(
        "key" to "staticExample"
    )
)
// create a GlobalContext instance with the entity as a static context
val staticGlobalContext = GlobalContext(listOf(staticContext))

// create a GlobalContextsConfiguration and assign the GlobalContext with a unique tag identifier
val globalContextsConfig = GlobalContextsConfiguration(
    mutableMapOf(
        "staticExampleTag" to staticGlobalContext
    )
)

// pass the configuration when creating a new tracker
Snowplow.createTracker(applicationContext, "namespace", networkConfiguration, globalContextsConfig)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
// context entity to add to all events
SelfDescribingJson staticContext = new SelfDescribingJson(
    "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0",
    new HashMap<String, String>() {{ put("key", "staticExample"); }}
);
// create a GlobalContext instance with the entity as a static context
GlobalContext staticGlobalContext = new GlobalContext(Arrays.asList(staticContext));

// create a GlobalContextsConfiguration and assign the GlobalContext with a unique tag identifier
GlobalContextsConfiguration globalContextsConfig = new GlobalContextsConfiguration(
    new HashMap<String, GlobalContext>() {{ put("staticExampleTag", staticGlobalContext); }}
);

// pass the configuration when creating a new tracker
Snowplow.createTracker(getApplicationContext(), "namespace", networkConfiguration, globalContextsConfig);
```

  </TabItem>
</Tabs>

A generator can also be added at run-time using the method `add` like in the following example. This is possible even if no `GlobalContextConfiguration` was originally provided when the tracker was created.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
tracker.globalContexts?.add(tag: "staticExampleTag", contextGenerator: staticGlobalContext)
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

Each context generator is associated with a tag string. The tag can be used to remove a generator at runtime using the method `remove` like in the following example.

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

It returns `nil`/`null` in case there aren’t generators registered with the specified tag, otherwise it returns the removed `GlobalContext` instance.

## Configuring the Global Context logic

An entity can be an immutable static entity, or a dynamic entity based off the event received. Also, the entity can be added either to all events, or conditionally to a subset of events by type or schema. The specific objects passed to the `GlobalContext` generator set how the global context entity will be applied, as described in the table below:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

|             | All events                 | By event type                                | By event schema                           |
|-------------|----------------------------|----------------------------------------------|-------------------------------------------|
| **Static**  | `[SelfDescribingJson]` | `[SelfDescribingJson], FilterBlock` | `[SelfDescribingJson], SchemaRuleSet` |
| **Dynamic** | `GeneratorBlock`      | `GeneratorBlock, FilterBlock`      | `GeneratorBlock, SchemaRuleSet`      |

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

|             | All events                 | By event type                                | By event schema                           |
|-------------|----------------------------|----------------------------------------------|-------------------------------------------|
| **Static**  | `List<SelfDescribingJson>` | `List<SelfDescribingJson>, FunctionalFilter` | `List<SelfDescribingJson>, SchemaRuleSet` |
| **Dynamic** | `FunctionalGenerator`      | `FunctionalGenerator, FunctionalFilter`      | `FunctionalGenerator, SchemaRuleSet`      |

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

|             | All events                 | By event type                                | By event schema                           |
|-------------|----------------------------|----------------------------------------------|-------------------------------------------|
| **Static**  | `List<SelfDescribingJson>` | `List<SelfDescribingJson>, FunctionalFilter` | `List<SelfDescribingJson>, SchemaRuleSet` |
| **Dynamic** | `FunctionalGenerator`      | `FunctionalGenerator, FunctionalFilter`      | `FunctionalGenerator, SchemaRuleSet`      |

  </TabItem>
</Tabs>

If the Global Context logic becomes too complex, consider using the `ContextGenerator` interface/protocol instead.

### Static entities

This is useful in cases where the entity is static and it's always the same. A classic case is a contextual information like a user identifier that doesn't change during the tracking.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let staticContext = SelfDescribingJson(schema: "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0", andData: ["key": "staticExample"])
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

### Dynamic entities

A context generator callback (`FunctionalGenerator` on Android) returns an array of self describing JSONs, representing entities.
They are evaluated each time an event is sent, and so can be used to send an entity based off event information.
The `InspectableEvent` is an interface that exposes internal data of the processed event: name, schema and payload.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let contextGenerator = GlobalContext(generator: {  event in
    return [
        SelfDescribingJson(schema: "iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0", andData: ["eventName": event.schema!])
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

### Conditional entities

The previous examples described the generation of entities that are associated with every event.
However, there are cases where the contexts should only be applied to certain events.

#### Filter Callback

A filter callback is used to discriminate between events so we can attach global contexts only to certain events.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let filteredGC = GlobalContext(
    staticContexts: [
        SelfDescribingJson(schema: "iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1", andData: [
            "key": "value"
        ])
    ],
    filter: { event in
        // this will add the entity to all Structured events
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
            // this will add the entity to all Structured events
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
        // this will add the entity to all Structured events
        return event.getName() == "se";
    }
});
```

  </TabItem>
</Tabs>

#### Ruleset Provider

A ruleset provider is used when you want to attach a global context entity to certain events based on the schema URI.

A ruleset provider has a ruleset which has a list of allowed schemas and a list of denied schemas. Both lists contain Iglu URIs which can be modified based on some syntactic rules.

In this example, the ruleset provider will attach the generated entities (as described in the previous section) to events with the schema `iglu:com.acme.*/*/jsonschema/*-*-*`, but not to `iglu:com.acme.marketing/*/jsonschema/*-*-*`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let allowed = "iglu:com.snowplowanalytics.*/*/jsonschema/*-*-*"
let denied = "iglu:com.snowplowanalytics.mobile/*/jsonschema/*-*-*"

let ruleset = SchemaRuleset(allowedList: [allowed], andDeniedList: [denied])
let rulesetGC = GlobalContext(staticContexts:[
  SelfDescribingJson(schema:"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1", andData:["key": "value"])
], ruleset:ruleset)

tracker.globalContexts?.add(tag: "tag1", contextGenerator: rulesetGC)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```java
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

##### Ruleset Format

Ruleset rules are the strings used to match against certain schemas, such as `iglu:com.acme/*/jsonschema/*-*-*`.

They follow the same five-part format as an Iglu URI `protocol:vendor/event_name/format/version` with the exception that a wildcard can be used to refer to all cases.

The parts of a rule are wildcarded with certain guidelines:

- asterisks cannot be used for the protocol (i.e. schemas always start with `iglu:`);
- version matching must be specified like so: `*–*–*`, where any part of the versioning can be defined, e.g. `1-*–*`, but only sequential parts can be wildcarded, e.g. `1-*-1` is invalid but `1-1–*` is valid;
- at least two parts: `com.acme.*` is valid, while `com.*` is not;
- vendors cannot be defined with non-wildcarded parts between wildcarded parts: `com.acme.*.marketing.*` is invalid, while `com.acme.*.*` is valid.

### ContextGenerator for custom logic

In case the logic for filter and generator callbacks are too complex, it’s possible to specify them in a class that implements the `ContextGenerator` interface/protocol.

In this case the logic for filtering and generation is encapsulated behind a context generator class.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
class GlobalContextGenerator : ContextGenerator {

    func filter(from event: InspectableEvent) -> Bool {
        return true
    }

    func generator(from event: InspectableEvent) -> [SelfDescribingJson]? {
        return [
            SelfDescribingJson(schema:"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1", andData:["key": "value"]),
        ]
    }
}
```

It can be passed to the tracker as usual:

```swift
let contextGeneratorGC = GlobalContext(contextGenerator: GlobalContextGenerator())
tracker.globalContexts?.add(tag: "tag1", contextGenerator: contextGeneratorGC)
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
