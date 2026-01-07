---
title: "Remote Configuration"
date: "2021-11-23"
sidebar_position: 50
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS Tracker" default>

Remote Configuration is a feature of the mobile native trackers that allows for the configuration of the tracker without distributing an app update.

The tracker can be configured traditionally, passing the configuration as explained in the "Instrumentation" section.  
Unfortunately, every time the developer wants to update the tracker configuration, they are forced to update the code and redistribute the app.

With remote configuration the developer just indicates to the tracker how to download the configuration file and the tracker will automatically reconfigure itself based on the downloaded file.

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker for the remote configuration:

1. In your application delegate `AppDelegate.swift` add `import SnowplowTracker`.
2. In the `application(_:didFinishLaunchingWithOptions:)` method, set up the SDK as follows:

```swift
  // Indicate the URL where to download the config file
  let remoteConfig = RemoteConfiguration(endpoint: REMOTE_CONFIG_URL, method: .get)

  // Default configuration used in case the remote config is not accessible
  let defaultNetworkConfig = NetworkConfiguration(endpoint: DEFAULT_COLLECTOR_URL, method: .post);
  let defaultConfig = [ConfigurationBundle(namespace: "defaultNamespace", networkConfiguration: networkConfig)]

  // Callback for when the tracker reconfigures itself passing a list of active namespaces
  let successCallback: ([String]?) -> Void = { namespaces in
      // This callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
  }

  // Setup tracker with remote configuration
  Snowplow.setup(remoteConfiguration: remoteConfig, defaultConfiguration: defaultConfig, onSuccess: successCallback)
```

Once the app starts the Snowplow tracker initializer will attempt to download the remote configuration file. Meanwhile, it will initialize the tracker instance (or multiple tracker instances) based on the last cached configuration. The cached configuration is the last configuration downloaded remotely. If it's not available, the tracker initializer will spin up the default configuration passed as a parameter. Every time the initializer successfully initializes the tracker instances it calls a callback passing the list of activated namespaces. The callback can be used for last minute settings at runtime once the tracker has been instanced.

The `defaultConfiguration` parameter takes a list of `ConfigurationBundle` objects. Each one represents a tracker instance and it's own configuration. Each tracker instance is identified by a `namespace` which is a parameter required in each `ConfigurationBundle`. All the other properties are just the various configurations described in the "Introduction" section.

The `onSuccess` callback is called for each successful configuration. For example, if the tracker has a cached configuration and it's downloading a new configuration, first the `onSuccess` callback will be called for the cached configuration and then it will be called when the downloaded configuration is applied. When it happens the cached configuration is substituted with the downloaded one.

### The remote configuration file

In the `RemoteConfiguration` object passed to the `setup` method is specified the REMOTE_CONFIG_URL, which is the url where the developer hosts the configuration file.  
There aren't restrictions about where to host the file but possible solutions may be S3 with Cloudfront or a Google Cloud Storage bucket.

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
- `configurationVersion`: It's an incremental version number that identifies the current configuration. **It MUST be increased on each update.** The tracker compares this value with the configurationVersion of the cached configuration to decide whether to update or not the tracker configuration.
- `configurationBundle`: This is a list of configurations for the various tracker instances the developer wants to activate in the app. Usually there is a unique tracker instance for the app so the configurationBundle will likely be an array of a single object like in the example above.

The elements of the `configurationBundle` list are just a subset of the common configuration settings described in the "Introduction" section.  
At the moment the configuration objects configurable remotely are:

- `networkConfiguration`
- `trackerConfiguration`
- `subjectConfiguration`
- `sessionConfiguration`

Note: The `networkConfiguration` is fundamental in order to set the collector endpoint, the URL where the tracked events will be sent. If the ConfigurationBundle has a `namespace` but not the `networkConfiguration`, the tracker initializer will remove the tracker instance with the corresponding namespace.

### Refresh the configuration

As shown above the developer can enforce the download of the configuration file at the start up of the app.  
If the developer wants to check for configuration updates more often, for example at runtime or when the app comes back from background state, it's possible to use the `refresh` method, placing it where the developer wants to perform the download and the configuration check.

```swift
let successCallback: ([String]?) -> Void = { namespaces in
    // This callback can be used for last minute, post-configuration,
    // updates once the tracker instance is enabled and configured.
}

Snowplow.refresh(onSuccess: successCallback)
```

The method needs only the callback parameter, without any remote configuration url or default configuration, because this is intended just for the configuration updates, not for the initial setup.  
The tracker will be configured only if a new configuration (with a higher `configurationVersion` value) is available at the url indicated in the `RemoteConfiguration` passed earlier at start up of the app in the `setup` method call.

### Policy for runtime settings and remote configuration updates

When the tracker initializer updates the tracker configuration it would reset all the previous configuration with the new settings. Obviously, this can cause issues in case some runtime configuration has been applied meanwhile. To avoid this the tracker keeps track of runtime changes in the configuration settings and when a new remote configuration is downloaded and applied it doesn't override the settings already changed at runtime.

A clear example is a runtime change on `userId` on `SubjectController`:

```swift
// Load configuration with userId = nil
Snowplow.setup(remoteConfiguration: remoteConfig, defaultConfiguration: defaultConfig, onSuccess: successCallback)

/* userId is set to nil */

...later...

tracker.subject.userId = "my-runtime-updated-userId"

/* userId is is set to "my-runtime-updated-userId" */

...later...

// Later refreshing the configuration with userId = nil
Snowplow.refresh(onSuccess: successCallback)

/* userId is still set to "my-runtime-updated-userId" because it was set at runtime */
```

  </TabItem>
  <TabItem value="android" label="Android Tracker">

Remote Configuration is a feature of the mobile native trackers that allows for the configuration of the tracker without distributing an app update.

The tracker can be configured traditionally, passing the configuration as explained in the "Instrumentation" section.  
Unfortunately, every time the developer wants to update the tracker configuration, they are forced to update the code and redistribute the app.

With remote configuration the developer just indicates to the tracker how to download the configuration file and the tracker will automatically reconfigure itself based on the downloaded file.

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker for the remote configuration:

In your `Application` subclass, set up the SDK as follows:

```java
  // Indicate the URL where to download the config file
  RemoteConfiguration remoteConfig = new RemoteConfiguration(REMOTE_CONFIG_URL, HttpMethod.get);

  // Default configuration used in case the remote config is not accessible
  NetworkConfiguration defaultNetworkConfig = new NetworkConfiguration(DEFAULT_COLLECTOR_URL, HttpMethod.post);
  List<ConfigurationBundle> defaultConfig = Arrays.asList(new ConfigurationBundle("defaultNamespace", networkConfig));

  // Setup tracker with remote configuration
  Snowplow.setup(context, remoteConfig, defaultConfig, namespaces -> {
    // This callback can be used for last minute, post-configuration, updates once the tracker instance is enabled and configured.
  });
```

Once the app starts the Snowplow tracker initializer will attempt to download the remote configuration file. Meanwhile, it will initialize the tracker instance (or multiple tracker instances) based on the last cached configuration. The cached configuration is the last configuration downloaded remotely. If it's not available, the tracker initializer will spin up the default configuration passed as a parameter. Every time the initializer successfully initializes the tracker instances it calls a callback passing the list of activated namespaces. The callback can be used for last minute settings at runtime once the tracker has been instanced.

The `defaultConfiguration` parameter takes a list of `ConfigurationBundle` objects. Each one represents a tracker instance and it's own configuration. Each tracker instance is identified by a `namespace` which is a parameter required in each `ConfigurationBundle`. All the other properties are just the various configurations described in the "Introduction" section.

The `onSuccess` callback is called for each successful configuration. For example, if the tracker has a cached configuration and it's downloading a new configuration, first the `onSuccess` callback will be called for the cached configuration and then it will be called when the downloaded configuration is applied. When it happens the cached configuration is substituted with the downloaded one.

### The remote configuration file

In the `RemoteConfiguration` object passed to the `setup` method is specified the REMOTE_CONFIG_URL, which is the url where the developer hosts the configuration file.  
There aren't restrictions about where to host the file but possible solutions may be S3 with Cloudfront or a Google Cloud Storage bucket.

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
- `configurationVersion`: It's an incremental version number that identifies the current configuration. **It MUST be increased on each update.** The tracker compares this value with the configurationVersion of the cached configuration to decide whether to update or not the tracker configuration.
- `configurationBundle`: This is a list of configurations for the various tracker instances the developer wants to activate in the app. Usually there is a unique tracker instance for the app so the configurationBundle will likely be an array of a single object like in the example above.

The elements of the `configurationBundle` list are just a subset of the common configuration settings described in the "Introduction" section.  
At the moment the configuration objects configurable remotely are:

- `networkConfiguration`
- `trackerConfiguration`
- `subjectConfiguration`
- `sessionConfiguration`

Note: The `networkConfiguration` is fundamental in order to set the collector endpoint, the URL where the tracked events will be sent. If the ConfigurationBundle has a `namespace` but not the `networkConfiguration`, the tracker initializer will remove the tracker instance with the corresponding namespace.

### Refresh the configuration

As shown above the developer can enforce the download of the configuration file at the start up of the app.  
If the developer wants to check for configuration updates more often, for example at runtime or when the app comes back from background state, it's possible to use the `refresh` method, placing it where the developer wants to perform the download and the configuration check.

```java
Snowplow.refresh(context, namespaces -> {
  // This callback can be used for last minute, post-configuration, 
  // updates once the tracker instance is enabled and configured.
});
```

The method needs only the callback parameter, without any remote configuration url or default configuration, because this is intended just for the configuration updates, not for the initial setup.  
The tracker will be configured only if a new configuration (with a higher `configurationVersion` value) is available at the url indicated in the `RemoteConfiguration` passed earlier at start up of the app in the `setup` method call.

### Policy for runtime settings and remote configuration updates

When the tracker initializer updates the tracker configuration it would reset all the previous configuration with the new settings. Obviously, this can cause issues in case some runtime configuration has been applied meanwhile. To avoid this the tracker keeps track of runtime changes in the configuration settings and when a new remote configuration is downloaded and applied it doesn't override the settings already changed at runtime.

A clear example is a runtime change on `userId` on `SubjectController`:

```java
// Load configuration with userId = nil
Snowplow.setup(context, remoteConfig, defaultConfig, successCallback);
/* userId is set to nil */

...later...

tracker.getSubject().userId = "my-runtime-updated-userId"

/* userId is is set to "my-runtime-updated-userId" */

...later...

// Later refreshing the configuration with userId = nil
Snowplow.refresh(context, successCallback)

/* userId is still set to "my-runtime-updated-userId" because it was set at runtime */
```

  </TabItem>
</Tabs>