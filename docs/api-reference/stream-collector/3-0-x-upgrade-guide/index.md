---
title: "3.0.x upgrade guide"
sidebar_position: 0
---

## Breaking changes

### New license

Since version 3.0.0, the collector has been migrated to use the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.0/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

### New HTTP stack

Version 3.0.0 replaces the Akka HTTP stack with http4s. The same stack is already used in all other Snowplow microservices, so this makes the codebase more uniform and enables us to share more code between applications.

Also, newer versions of Akka HTTP would have required a [commercial license from Lightbend](https://www.lightbend.com/blog/why-we-are-changing-the-license-for-akka) for many of Snowplow’s users.

### Single endpoint port

Previously, the collector was able to expose both http and https ports. We’ve found it impractical and therefore the new version is exposing a single port — either http or https. To enable http→https upgrades, use a load-balancer/proxy.

## Upgrading

In order to ease the migration for existing installations, we’ve tried to keep the configurations mostly backwards-compatible.

However, due to changes above, some amendments are required. We’ve also introduced a few tweaks that should simplify configurations between pipeline services. Full configuration examples are available in [snowplow/stream-collector](https://github.com/snowplow/stream-collector/tree/master/examples) repository along with extended commentary.

If you’ve previously used both HTTP and HTTPS ports in the collector, this feature is no longer available. Since version 3.0.0 you can either:
- enable TLS termination in the collector (use HTTPS between load balancer and collector) and enable HTTP upgrade in load balancer running in front of the collector
- disable TLS termination in the collector (use HTTP between load balancer and collector), use TLS termination and HTTP upgrade in the load balancer

### License acceptance

You have to explicitly accept the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.0/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)). To do so, either set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable, or update the following section in the configuration:

```hcl
collector {
  license {
    accept = true
  }
  ...
}
```

### Akka section removal

The top-level `akka` section will no longer be used. Keeping the section in your configuration will *not* cause collector failures but should be removed for clarity.

### Split sinks

Sink configurations can now be defined similarly as with our other services. Each sink is configured separately to allow for individual config specifics. This change is especially useful for our Kafka collector running on Azure, where EventHubs needs separate `producerConf` sections to account for different EH settings.

Example:

```hcl
collector {
  ...
  streams {
    good {
      name = "good"
      brokers = "localhost:9092,another.host:9092"
      producerConf {
        acks = all
        "key.serializer"     = "org.apache.kafka.common.serialization.StringSerializer"
        "value.serializer"   = "org.apache.kafka.common.serialization.StringSerializer"
      }
      buffer {
        byteLimit = 3145728
        recordLimit = 500
        timeLimit = 5000
      }
    }

    bad {
      name = "bad"
      brokers = "localhost:9092,another.host:9092
      producerConf {
        acks = all
        "key.serializer"     = "org.apache.kafka.common.serialization.StringSerializer"
        "value.serializer"   = "org.apache.kafka.common.serialization.StringSerializer"
      }
      maxBytes = 1000000
      buffer {
        byteLimit = 3145728
        recordLimit = 500
        timeLimit = 5000
      }
    }
  }
  ...
}
```

### Networking

Optional networking settings were previously a part of Akka HTTP configuration section. With the removal of the framework, the relevant settings have been moved into a dedicated `collector.networking` section:
- `collector.networking.maxConnections` - maximum number of concurrent active connection.
- `collector.networking.idleTimeout` - maximum inactivity time for a network connection. If no data is sent within that time, the connection is closed.

Example:

```hcl
collector {
  ...
  networking {
    maxConnections = 1024
    idleTimeout = 610 seconds
  }
  ...
}
```
