---
title: "Update the native mobile trackers configuration remotely"
sidebar_label: "Update tracker configuration remotely"
date: "2022-08-30"
sidebar_position: 50
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Remote configuration allows for the configuration of the tracker without distributing an app update. When remote configuration is not used, changing the tracking configuration can require the resubmission of the whole app bundle.

With remote configuration, the tracker can download a configuration file and automatically reconfigure itself based on the downloaded file.

A tracker that will be remotely configured is created slightly differently from a locally-configured tracker, which is created using `Snowplow.createTracker()`. Instead, `Snowplow.setup()` is used. This example code will create a tracker with namespace "defaultNamespace" that can be configured remotely. Access the tracker using `Snowplow.defaultTracker` or `Snowplow.getTracker("defaultNamespace")`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

1. In your application delegate `AppDelegate.swift` add `import SnowplowTracker`.

2. In the `application(_:didFinishLaunchingWithOptions:)` method, set up the SDK as follows:

```swift
// Indicate the URL where to download the config file
let remoteConfig = RemoteConfiguration(
  endpoint: "https://remote-config.com",
  method: .get
)

// Default configuration used when the remote config is not accessible
// Network, tracker, subject and sessionConfigurations can be provided
let defaultNetworkConfig = NetworkConfiguration(endpoint: "https://snowplow-collector-url.com", method: .post)
let bundle = ConfigurationBundle(namespace: "defaultNamespace", networkConfiguration: defaultNetworkConfig)
bundle.trackerConfiguration = TrackerConfiguration(appId: "app-id")
  .screenViewAutotracking(true)
let defaultConfig = [bundle]

// Optional callback for when the tracker reconfigures itself passing a list of active namespaces and the state of the configuration describing where it was fetched from
let successCallback: ([String]?) -> Void = { namespaces, state in
  // This callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
}

// Set up tracker with remote configuration
Snowplow.setup(
  remoteConfiguration: remoteConfig,
  defaultConfiguration: defaultConfig,
  defaultConfigurationVersion: 1,
  onSuccess: successCallback
)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// Indicate the URL where to download the config file
val remoteConfig = RemoteConfiguration("https://remote-config.com", HttpMethod.GET)

// Default configuration used in case the remote config is not accessible
// Network, tracker, subject and sessionConfigurations can be provided
val defaultNetworkConfig = NetworkConfiguration("https://snowplow-collector-url.com", HttpMethod.POST)
val defaultConfig: List<ConfigurationBundle> =
    listOf(ConfigurationBundle("defaultNamespace", defaultNetworkConfig))

// Set up tracker with remote configuration
Snowplow.setup(
  context = applicationContext,
  remoteConfiguration = remoteConfig,
  defaultBundles = defaultConfig,
  defaultBundleVersion = 1
) {
  // This optional callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
  configurationPair: Pair<List<String>, ConfigurationState?>? ->
    val namespaces = configurationPair?.first
    val configurationState =
        configurationPair?.second // either cached, default or fetched from the remote endpoint
}
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
// Indicate the URL where to download the config file
RemoteConfiguration remoteConfig = new RemoteConfiguration("https://remote-config.com", HttpMethod.get);

// Default configuration used in case the remote config is not accessible
// Network, tracker, subject and sessionConfigurations can be provided
NetworkConfiguration defaultNetworkConfig = new NetworkConfiguration("https://snowplow-collector-url.com", HttpMethod.post);
List<ConfigurationBundle> defaultConfig = Lists.listOf(new ConfigurationBundle("defaultNamespace", defaultNetworkConfig));

// Set up tracker with remote configuration
Snowplow.setup(getApplicationContext(),
  remoteConfig,
  defaultConfig,
  1, // version of the default configuration
  configurationPair -> {
  // This optional callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
  List<String> namespaces = configurationPair.first;
  ConfigurationState configurationState = configurationPair.second; // either cached, default or fetched from the remote endpoint
});
```

  </TabItem>
</Tabs>

On app startup, the Snowplow tracker initializer will attempt to download the remote configuration file.
Meanwhile, it will initialize the tracker instance (or multiple tracker instances) based on the last cached configuration.
The cached configuration is the last configuration downloaded remotely.
If it's not available, the tracker initializer will spin up the default configuration passed as a parameter.

Every time the initializer successfully initializes the tracker instances it calls a callback passing the list of activated namespaces and the state of the configuration which represents the source where the configuration was retrieved from (using default values, cache, or fetched from the remote endpoint).
The callback can be used for last minute settings at runtime once the tracker has been instanced.

## Default configuration

The default configuration will be used right after calling the `setup()` method in case there is no cached configuration (one that was fetched from the remote endpoint and stored in a cache file).

The `defaultConfiguration` parameter takes a list of `ConfigurationBundle` objects.
Each one represents a tracker instance and it's own configuration.
Each tracker instance is identified by a `namespace` which is a parameter required in each `ConfigurationBundle`.

The optional `defaultConfigurationVersion` parameter specifies the version of the default configuration.
If the fetched remote configuration has version lower or equal to the default configuration, it will not be used.

## On success callback

The optional `onSuccess` callback is called for each successful configuration.

For example, if the tracker has a cached configuration and it's downloading a new configuration, first the `onSuccess` callback will be called for the cached configuration and then it will be called when the downloaded configuration is applied.
When it happens the cached configuration is substituted with the downloaded one.

## The remote configuration file

The URL where the configuration file is hosted must be provided in the `RemoteConfiguration` object passed to the `setup()` method. There aren't restrictions about where to host the file but possible solutions may be S3 with Cloudfront or a Google Cloud Storage bucket.

The configuration file is simply a JSON file compliant with the [Remote Config JSONSchema](https://iglucentral.com/schemas/com.snowplowanalytics.mobile/remote_config/jsonschema/1-0-0).

An example of remote config specification:

```json
{
  "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.mobile/remote_config/jsonschema/1-0-0",
  "configurationVersion": 1,
  "configurationBundle": [
    {
      "namespace": "testTracker1",
      "networkConfiguration": {
        "endpoint": "http://<collector.url>",
        "method": "get"
      },
      "trackerConfiguration": {
        "appId": "app-identifier",
        "devicePlatform": "mob",
        "logLevel": "off",
        "sessionContext": false,
        "applicationContext": false,
        "platformContext": false,
        "geoLocationContext": false,
        "screenContext": false,
        "screenViewAutotracking": false,
        "lifecycleAutotracking": false,
        "installAutotracking": false,
        "exceptionAutotracking": false,
        "diagnosticAutotracking": false
      },
      "subjectConfiguration": {
        "userId": "example",
        "networkUserId": "example",
        "domainUserId": "example",
        "useragent": "example",
        "ipAddress": "example",
        "timezone": "example",
        "language": "example"
      },
      "sessionConfiguration": {
        "backgroundTimeout": 1800,
        "foregroundTimeout": 1800
      }
    }
  ]
}
```

The required fields are:

- `$schema`: It specifies the format of the configuration file and it's used by the tracker to check if the format is compatible with that version of the tracker.
- `configurationVersion`: It's an incremental version number that identifies the current configuration. The tracker compares this value with the configurationVersion of the cached configuration to decide whether to update or not the tracker configuration.
  :::warning
  The version MUST be increased on each update.
  :::
- `configurationBundle`: This is a list of configurations for the various tracker instances the developer wants to activate in the app. Usually there is a unique tracker instance for the app so the configurationBundle will likely be an array of a single object like in the example above.

The elements of the `configurationBundle` list are just a subset of the common configuration settings described in the "Introduction" section.
At the moment the configuration objects configurable remotely are:

- `networkConfiguration`
- `trackerConfiguration`
- `subjectConfiguration`
- `sessionConfiguration`

Note: The `networkConfiguration` is fundamental in order to set the collector endpoint, the URL where the tracked events will be sent. If the ConfigurationBundle has a `namespace` but not the `networkConfiguration`, the tracker initializer will remove the tracker instance with the corresponding namespace.

## Refresh the configuration

By default the tracker will attempt to download the configuration file at the start up of the app.
To check for configuration updates more often, for example at runtime or when the app comes back from background state, it's possible to use the `refresh()` method.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let successCallback: ([String]?) -> Void = { namespaces, state in
    // This callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
}

Snowplow.refresh(onSuccess: successCallback)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
Snowplow.refresh(
    applicationContext
) { configurationPair: Pair<List<String>, ConfigurationState>? ->
    val namespaces = configurationPair?.first
    val configurationState = configurationPair?.second
}
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Snowplow.refresh(getApplicationContext(), configurationPair -> {
  List<String> namespaces = configurationPair.first;
  ConfigurationState configurationState = configurationPair.second;

  // This callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
});
```

  </TabItem>
</Tabs>

The method needs only the callback parameter, without any remote configuration url or default configuration, because this is intended just for the configuration updates, not for the initial setup.
The tracker will be configured only if a new configuration (with a higher `configurationVersion` value) is available at the url indicated in the `RemoteConfiguration` passed earlier at start up of the app in the `setup` method call.

## Policy for runtime settings and remote configuration updates

When the tracker initializer updates the tracker configuration, it would reset all the previous configuration with the new settings. Obviously, this can cause issues in case some runtime configuration has been applied meanwhile. To avoid this the tracker keeps track of runtime changes in the configuration settings and when a new remote configuration is downloaded and applied, it doesn't override the settings already changed at runtime.

A clear example is a runtime change on `userId` on `SubjectController`:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
// Load configuration with userId = nil
Snowplow.setup(remoteConfiguration: remoteConfig, defaultConfiguration: defaultConfig, onSuccess: successCallback)

// userId is set to nil

// ...later...

tracker.subject.userId = "my-runtime-updated-userId"

// userId is is set to "my-runtime-updated-userId"

// ...later...

// Later refreshing the configuration with userId = nil
Snowplow.refresh(onSuccess: successCallback)

// userId is still set to "my-runtime-updated-userId" because it was set at runtime
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// Load configuration with userId = nil
Snowplow.setup(applicationContext, remoteConfig, defaultConfig, successCallback)

// userId is set to nil

// ...later...

tracker.subject.userId = "my-runtime-updated-userId"

// userId is is set to "my-runtime-updated-userId"

// ...later...

// Later refreshing the configuration with userId = nil
Snowplow.refresh(applicationContext, successCallback)

// userId is still set to "my-runtime-updated-userId" because it was set at runtime
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
// Load configuration with userId = nil
Snowplow.setup(getApplicationContext(), remoteConfig, defaultConfig, successCallback);

// userId is set to nil

// ...later...

tracker.getSubject().userId = "my-runtime-updated-userId"

// userId is is set to "my-runtime-updated-userId"

// ...later...

// Later refreshing the configuration with userId = nil
Snowplow.refresh(getApplicationContext(), successCallback);

// userId is still set to "my-runtime-updated-userId" because it was set at runtime
```

  </TabItem>
</Tabs>
