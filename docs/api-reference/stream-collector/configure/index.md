---
title: "Configure"
sidebar_position: 2
---

This is a complete list of the options that can be configured in the collector HOCON config file. The [example configs in github](https://github.com/snowplow/stream-collector/tree/master/examples) show how to prepare an input file. Some features are described in more detail at the bottom of this page.

### License

The collector is released under the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.1/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run the collector, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, you can configure the `collector.license.accept` option, like this:

```hcl
collector {
  license { accept = true }
}
```

### Common options

| parameter | description |
|-----------|-------------|
| `collector.interface` | Required. E.g. `0.0.0.0`. The collector listens for http requests on this interface. |
| `collector.port` | Required. E.g. `80`. The collector listens for http requests on this port. |
| `collector.ssl.enable` | Optional. Default: `false`. The collector will also listen for https requests on a different port. |
| `collector.ssl.port` | Optional. Default: `443`. The port on which to listen for https requests. |
| `collector.ssl.redirect` | Optional. Default: `false`. If enabled, the collector redirects http requests to the https endpoint using a `301` status code. |
| `collector.hsts.enable` _(since 3.1.0)_ | Default: `false`. Whether to send an [HSTS header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security). |
| `collector.hsts.maxAge` _(since 3.1.0)_ | Default: `365 days`. The maximum age for the HSTS header. |
| `collector.paths` | Optional. More details about this feature below. This is for customising the collector's endpoints. You can also map any valid (ie, two-segment) path to one of the three default paths. |
| `collector.p3p.policyRef` | Optional. Default: `/w3c/p3p.xml`. Configures the p3p http header. |
| `collector.p3p.CP` | Optional. Default: `NOI DSP COR NID PSA OUR IND COM NAV STA`. Configures the p3p http header. |
| `collector.crossDomain.enabled` | Optional. Default: `false`. If enabled, `/crossdomain.xml` endpoint returns a cross domain policy file. |
| `collector.crossDomain.domains` | Optional. Default: `[*]` meaning the cross domain policy file allows all domains. This can also be changed to a list of domains. |
| `collector.crossDomain.secure` | Optional. Default: `true`. Whether cross domain policy file grants access to just HTTPS or both HTTP and HTTPS sources |
| `collector.cookie.enabled` | Optional. Default: `true`. The collector sets a cookie to set the user's network user id. Changing this to `false` disables setting cookies. Regardless of this setting, if the collector receives a request with the custom `SP-Anonymous:*` header, no cookie will be set. You can control whether this header is set or not in your tracking implementation. |
| `collector.cookie.expiration` | Optional. Default: `365 days`. Expiry of the collector's cookie. |
| `collector.cookie.name` | Optional. Default: `sp`. Name of the collector's cookie. |
| `collector.cookie.domains` | Optional. Default: no domains. There is more details about this feature below. This is for fine control over the cookie's domain attribute. |
| `collector.cookie.fallbackDomain` | Optional. If set, the fallback domain will be used for the cookie if none of the `Origin` header hosts matches the list of cookie domains. |
| `collector.cookie.secure` | Optional. Default: `true`. Sets the `secure` property of the cookie. |
| `collector.cookie.httpOnly` | Optional. Default: `true`. Sets the `httpOnly` property of the cookie.  We recommend `true` because `httpOnly` cookies are allowed a longer expiry time by web browsers. |
| `collector.cookie.sameSite` | Optional. Default: `None`. Sets the `sameSite` property of the cookie. Possible values: `Strict`, `Lax`, `None`. |
| `collector.cookie.clientCookieName` (since 3.4.0) | Optional. Default: not set.  If a name is specified (e.g. `sp_client`), the collector sets an extra cookie with that name, `httpOnly=false` and the same value as the main cookie (network user id). This is useful if you need to access the network user id on the client side using JavaScript. |
| `collector.doNotTrackCookie.enabled` | Optional. Default: `false`. If enabled, the collector respects a "do not track" cookie. If the cookie is present, it returns a `200` status code but it does not log the request to the output queue. |
| `collector.doNotTrackCookie.name` | Required when `doNotTrackCookie` feature is enabled. Configures the name of the cookie in which to check if tracking is disabled. |
| `collector.doNotTrackCookie.value` | Required when `doNotTrackCookie` feature is enabled. Can be a regular expression. The value of the cookie must match this expression in order for the collector to respect the cookie. |
| `collector.cookieBounce.enabled` | Optional. Default: `false`. When enabled, when the cookie is missing, the collector performs a redirect to itself to check if third-party cookies are blocked using the specified name. If they are indeed blocked, `fallbackNetworkId` is used instead of generating a new random one. |
| `collector.cookieBounce.name` | Optional. Default: `n3pc`. Name of the request parameter which will be used on redirects checking that the third-party cookies work. |
| `collector.cookieBounce.fallbackNetworkUserId` | Optional. Default: `00000000-0000-4000-A000-000000000000`. Network user id to use when third-party cookies are blocked. |
| `collector.cookieBounce.forwardedProtocolHeader` | Optional. E.g. `X-Forwarded-Proto`. The header containing the originating protocol for use in the bounce redirect location. Use this if behind a load balancer that performs SSL termination. |
| `collector.enableDefaultRedirect` | Optional. Default: `false`. When enabled, the collector's `/r` endpoint returns a `302` status code with a redirect back to a url specified with the `?u=` query parameter. |
| `collector.redirectDomains` (since *2.5.0*) | Optional. Default: empty. Domains which are valid for collector redirects. If empty then redirects are allowed to any domain. Must be an exact match. |
| `collector.redirectMacro.enabled` | Optional. Default: `false`. When enabled, the redirect url passed via the `u` query parameter is scanned for a `placeholder` token. All occurrences of the placeholder are substituted with the cookie's network user id. |
| `collector.redirectMacro.placeholder` | Optional. Default: `${SP_NUID}`. |
| `collector.rootResponse.enabled` | Optional. Default: `false`. Enable custom response handling for the root `"/"` path. |
| `collector.rootResponse.statusCode` | Optional. Default: `302`. The http status code to use when root response is enabled. |
| `collector.rootResponse.headers` | Optional. A map of key value pairs to include in the root response headers. |
| `collector.rootResponse.body` | Optional. The http response body to use when root response is enabled. |
| `collector.cors.accessControlMaxAge` | Optional. Default: `60 minutes`. Configures how long a the results of a preflight request can be cached by the browser. `-1` seconds disables the cache. |
| `collector.preTerminationPeriod` (since *2.5.0*) | Optional. Default: `10 seconds`. Configures how long the collector should pause after receiving a sigterm before starting the graceful shutdown. During this period the collector continues to accept new connections and respond to requests. |
| `collector.preTerminationUnhealthy` (since *2.5.0*) | Optional. Default: `false`. During the `preTerminationPeriod`, the collector can be configured to return `503`s on the `/health` endpoint. Can be helpful for removing the collector from a load balancer's targets. |
| `collector.terminationDeadline` (since *2.5.0*) | Optional. Default: `10 seconds`. The server's deadline for closing connections during graceful shutdown. |
| `collector.prometheusMetrics.enabled` (deprecated since *2.6.0*) | Optional. Default: `false`. When enabled, all requests are logged as prometheus metrics and the `/metrics` endpoint returns the report about the metrics. |
| `collector.prometheusMetrics.durationBucketsInSeconds` (deprecated since *2.6.0*) | Optional. E.g. `[0.1, 3, 10]`. Custom buckets for the `http_request_duration_seconds_bucket` duration prometheus metric. |
| `collector.telemetry.disable` | Optional. Set to `true` to disable [telemetry](/docs/get-started/snowplow-community-edition/telemetry/index.md). |
| `collector.telemetry.userProvidedId` | Optional. See [here](/docs/get-started/snowplow-community-edition/telemetry/index.md#how-can-i-help) for more information. |

### Kinesis collector options

| parameter | description |
|-----------|-------------|
| `collector.streams.good` | Required. Name of the output kinesis stream for successfully collected events. |
| `collector.streams.bad` | Required. Name of the output kinesis stream for http requests which could not be written to the good stream. For example, if the event size exceeds the kinesis limit of 1MB. |
| `collector.streams.useIpAddressAsPartitionKey` (deprecated since *3.5.0*) | Optional. Default: `false`. Whether to use the user's IP address as the kinesis partition key. |
| `collector.streams.{good,bad}.region` | Optional. Default: `eu-central-1`. AWS region of the kinesis streams. |
| `collector.streams.{good,bad}.customEndpoint` | Optional. Override aws kinesis endpoint. Can be helpful when using localstack for testing. |
| `collector.streams.{good,bad}.threadPoolSize` | Optional. Default: `10`. Thread pool size used by the collector sink for asynchronous operations. |
| `collector.streams.{good,bad}.sqsMaxBytes` | Optional. Set to the name of a SQS topic to enable buffering of good output events. When messages cannot be sent to Kinesis, (e.g. because of exceeding api limits) then they get sent to SQS as a fallback. Helpful for smoothing over traffic spikes. |
| `collector.streams.good.sqsGoodBuffer` | Optional. Set to the name of a SQS topic to enable buffering of good output events. When messages cannot be sent to Kinesis, (e.g. because of exceeding api limits) then they get sent to SQS as a fallback. Helpful for smoothing over traffic spikes. |
| `collector.streams.bad.sqsBadBuffer` | Optional. Like the `sqsGoodBuffer` but for failed events. |
| `collector.streams.{good,bad}.aws.accessKey` | Required. Set to `default` to use the default provider chain; set to `iam` to use AWS IAM roles; or set to `env` to use `AWS_ACCESS_KEY_ID` environment variable. |
| `collector.streams.{good,bad}.aws.secretKey` | Required. Set to `default` to use the default provider chain; set to `iam` to use AWS IAM roles; or set to `env` to use `AWS_SECRET_ACCESS_KEY` environment variable. |
| `collector.streams.{good,bad}.maxBytes` (since *2.9.0*) | Optional. Default: `1000000` (1 MB). Maximum number of bytes that a single record can contain. If a record is bigger, a size violation failed event is emitted instead. If SQS buffer is activated, `sqsMaxBytes` is used instead. |
| `collector.streams.{good,bad}.sqsMaxBytes` | Optional. Default: `192000` (192 kb). Maximum number of bytes that a single record can contain. If a record is bigger, a size violation failed event is emitted instead. SQS has a record size limit of 256 kb, but records are encoded with Base64, which adds approximately 33% of the size, so we set the limit to `256 kb * 3/4`. |
| `collector.streams.{good,bad}.startupCheckInterval` (since *2.9.0*) | Optional. Default: `1 second`.  When collector starts, it checks if Kinesis streams exist with `describeStreamSummary` and if SQS buffers exist with `getQueueUrl` (if configured). This is the interval for the calls. `/sink-health` is made healthy as soon as requests are successful or records are successfully inserted. |
| `collector.streams.backoffPolicy.minBackoff` | Optional. Default: `3000`. Time (in milliseconds) for retrying sending to kinesis / SQS after failure. |
| `collector.streams.backoffPolicy.maxBackoff` | Optional. Default: `600000`. Time (in milliseconds) for retrying sending to kinesis / SQS after failure. |
| `collector.streams.buffer.byteLimit` | Optional. Default: `3145728`. Incoming events are stored in an internal buffer before being sent to Kinesis. This configures the maximum total size of pending events. |
| `collector.streams.buffer.recordLimit` | Optional. Default: `500`. Configures the maximum number of pending events before flushing to Kinesis. |
| `collector.streams.buffer.timeLimit`| Optional. Default: `5000`. Configures the maximum time in milliseconds before flushing pending buffered events to Kinesis. |

### SQS collector options

| parameter | description |
|-----------|-------------|
| `collector.streams.good` | Required. Name of the output SQS queue for successfully collected events. |
| `collector.streams.bad` | Required. Name of the output SQS queue for http requests which could not be written to the good stream. For example, if the event size exceeds the SQS limit of 256KB. |
| `collector.streams.useIpAddressAsPartitionKey` (deprecated since *3.5.0*) | Optional. Default: `false`. Whether to use the user's IP address as the Kinesis partition key. This is attached to the SQS message as an attribute, with the aim of using it if the events ultimately end up in Kinesis. |
| `collector.streams.{good,bad}.region` | Optional. Default: `eu-central-1`. AWS region of the SQS queues. |
| `collector.streams.{good,bad}.threadPoolSize` | Optional. Default: `10`. Thread pool size used by the collector sink for asynchronous operations. |
| `collector.streams.{good,bad}.aws.accessKey` | Required. Set to `default` to use the default provider chain; set to `iam` to use AWS IAM roles; or set to `env` to use `AWS_ACCESS_KEY_ID` environment variable. |
| `collector.streams.{good,bad}.aws.secretKey` | Required. Set to `default` to use the default provider chain; set to `iam` to use AWS IAM roles; or set to `env` to use `AWS_SECRET_ACCESS_KEY` environment variable. |
| `collector.streams.{good,bad}.maxBytes` (since *2.9.0*) | Optional. Default: `192000` (192 kb). Maximum number of bytes that a single record can contain. If a record is bigger, a size violation failed event is emitted instead. SQS has a record size limit of 256 kb, but records are encoded with Base64, which adds approximately 33% of the size, so we set the limit to `256 kb * 3/4`. |
| `collector.streams.{good,bad}.startupCheckInterval` (since *2.9.0*) | Optional. Default: `1 second`.  When collector starts, it checks if SQS buffers exist with `getQueueUrl`. This is the interval for the calls. `/sink-health` is made healthy as soon as requests are successful or records are successfully inserted. |
| `collector.streams.backoffPolicy.minBackoff` | Optional. Default: `3000`. Time (in milliseconds) for retrying sending to SQS after failure. |
| `collector.streams.backoffPolicy.maxBackoff` | Optional. Default: `600000`. Time (in milliseconds) for retrying sending to SQS after failure. |
| `collector.streams.buffer.byteLimit` | Optional. Default: `3145728`. Incoming events are stored in an internal buffer before being sent to SQS. This configures the maximum total size of pending events. |
| `collector.streams.buffer.recordLimit` | Optional. Default: `500`. Configures the maximum number of pending events before flushing to SQS. |
| `collector.streams.buffer.timeLimit` | Optional. Default: `5000`. Configures the maximum time in milliseconds before flushing pending buffered events to SQS. |

### Pubsub collector options

| parameter | description |
|-----------|-------------|
| `collector.streams.good` | Required. Name of the output Pubsub topic for successfully collected events. |
| `collector.streams.bad` | Required. Name of the output pubsub topic for http requests which could not be written to the good stream. For example, if the event size exceeds the Pubsub limit of 10MB. |
| `collector.streams.sink.{good,bad}.googleProjectId` | Required. GCP project name. |
| `collector.streams.sink.{good,bad}backoffPolicy.minBackoff` (deprecated since *3.5.0*) | Optional. Default: `1000`. Time (in milliseconds) for retrying sending to Pubsub after failure. |
| `collector.streams.sink.{good,bad}.backoffPolicy.maxBackoff` (deprecated since *3.5.0*) | Optional. Default: `1000`. Time (in milliseconds) for retrying sending to Pubsub after failure |
| `collector.streams.sink.{good,bad}.backoffPolicy.totalBackoff` (deprecated since *3.5.0*) | Optional. Default: `9223372036854`. We set this to the maximum value so that we never give up on trying to send a message to pubsub. |
| `collector.streams.sink.{good,bad}.backoffPolicy.multipler` (deprecated since *3.5.0*) | Optional. Default: `2`. Multiplier between two periods. |
| `collector.streams.sink.{good,bad}.backoffPolicy.initialRpcTimeout` (deprecated since *3.5.0*) | Optional. Default: `10000`. Time (in milliseconds) before a RPC call to Pubsub is aborted and retried. |
| `collector.streams.sink.{good,bad}.backoffPolicy.maxRpcTimeout` (deprecated since *3.5.0*) | Optional. Default: `10000`. Maximum time (in milliseconds) before RPC call to Pubsub is aborted and retried. |
| `collector.streams.sink.{good,bad}.backoffPolicy.rpcTimeoutMultipler` (deprecated since *3.5.0*) | Optional. Default: `2`. How RPC timeouts increase as they are retried. |
| `collector.streams.sink.{good,bad}..maxBytes` (since *2.9.0*) | Optional. Default: `10000000` (10 MB). Maximum number of bytes that a single record can contain. If a record is bigger, a size violation failed event is emitted instead. |
| `collector.streams.sink.{good,bad}.startupCheckInterval` (since *2.9.0*) | Optional. Default: `1 second`.  When collector starts, it checks if PubSub topics exist with `listTopics`. This is the interval for the calls. `/sink-health` is made healthy as soon as requests are successful or records are successfully inserted. |
| `collector.streams.sink.{good,bad}.retryInterval` (since *2.9.0*) | Optional. Default: `10 seconds`. Collector uses built-in retry mechanism of PubSub API. In case of failure of these retries, the events are added to a buffer and every `retryInterval` collector retries to send them. |
| `collector.streams.{good,bad}.buffer.byteLimit` | Optional. Default: `1000000`. Incoming events are stored in an internal buffer before being sent to Pubsub. This configures the maximum total size of pending events |
| `collector.streams.{good,bad}.buffer.recordLimit` | Optional. Default: `40`. Maximum number of pending events before flushing to Pubsub. |
| `collector.streams.{good,bad}.buffer.timeLimit` | Optional. Default: `1000`. Maximum time (in milliseconds) before flushing pending buffered events to Pubsub. |

### Kafka collector options

| parameter | description |
|-----------|-------------|
| `collector.streams.good` | Required. Name of the output Kafka topic for successfully collected events. |
| `collector.streams.bad` | Required. Name of the output Kafka topic for http requests which could not be written to the good stream. |
| `collector.streams.{good,bad}.brokers` | Required. A list of host:port pairs to use for establishing the initial connection to the Kafka cluster. |
| `collector.streams.{good,bad}.producerConf` | Optional. Kafka producer configuration. See [the docs](https://kafka.apache.org/documentation/#producerconfigs) for all properties. |
| `collector.streams.{good,bad}.maxBytes` | Optional. Default: `1000000` (1 MB). Maximum number of bytes that a single record can contain. If a record is bigger, a size violation failed event is emitted instead. |
| `collector.streams.{good,bad}.startupCheckInterval` | Optional. Default: `10 second`.  When collector starts, it checks if Kafka topics exist. This is the interval for the calls. `/sink-health` is made healthy as soon as requests are successful or records are successfully inserted. |
| `collector.streams.{good,bad}.buffer.byteLimit` | Optional. Default: `3145728`. Incoming events are stored in an internal buffer before being sent to Kafka. This configures the maximum total size of pending events. |
| `collector.streams.{good,bad}.buffer.recordLimit` | Optional. Default: `500`. Configures the maximum number of pending events before flushing to Kafka. |
| `collector.streams.{good,bad}.buffer.timeLimit` | Optional. Default: `5000`. Configures the maximum time in milliseconds before flushing pending buffered events to Kafka. |
| `collector.streams.{good,bad}.retryInterval` | Optional. Default: `10 seconds`. Collector uses built-in retry mechanism of Kafka API. In case of failure of these retries, the events are added to a buffer and every `retryInterval` collector retries to send them. |



### Setting the domain name

Set the cookie name using the `collector.cookie.name` setting. To maintain backward compatibility with earlier versions of the collector, use the string "sp" as the cookie name.

The collector responds to valid requests with a `Set-Cookie` header, which may or may not specify a `domain` for the cookie.

If no domain is specified, the cookie will be set against the full collector domain, for example `collector.snplow.com`. That will mean that applications running elsewhere on `*.snplow.com` won't be able to access it. If you don't need to grant access to the cookie from other applications on the domain, then you can ignore the `domains` and `fallbackDomain` settings.

In earlier versions, you could specify a `domain` to tie the cookie to. For example, if set to `.snplow.com`, the cookie would have been accessible to other applications running on `*.snplow.com`. To do the same in this version, use the `fallbackDomain` setting but **make sure** that you no longer include a leading dot:

```properties
fallbackDomain = "snplow.com"
```

The cookie set by the collector can be treated differently by browsers, depending on whether it's considered to be a first-party or a third-party cookie. In earlier versions (0.15.0 and earlier), if you had two collector endpoints, one on `collector.snplow.com` and one on `collector.snplow.net`, you could only specify one of those domains in the configuration. That meant that you were only able to set a first-party cookie server-side on either `.snplow.com` or `.snplow.net`, but not on both. From version 0.16.0, you can specify a list of domains to be used for the cookie (**note the lack of a leading dot**):

```properties
domains = [
  "snplow.com"
  "snplow.net"
]
```

Which domain to be used in the `Set-Cookie` header is determined by matching the domains from the `Origin` header of the request to the specified list. The first match is used. If no matches are found, the fallback domain will be used, if configured. If no `fallbackDomain` is configured, the cookie will be tied to the full collector domain.

If you specify a main domain in the list, all subdomains on it will be matched. If you specify a subdomain, only that subdomain will be matched.

Examples:

- `domain.com` will match `Origin` headers like `domain.com`, `www.domain.com` and `secure.client.domain.com`
- `client.domain.com` will match an `Origin` header like `secure.client.domain.com` but not `domain.com` or `www.domain.com`.

### Configuring custom paths

The collector responds with a cookie to requests with a path that matches the `vendor/version` protocol. The expected values are:

- `com.snowplowanalytics.snowplow/tp2` for Tracker Protocol 2
- `r/tp2` for redirects
- `com.snowplowanalytics.iglu/v1` for the Iglu Webhook.

You can also map any valid (ie, two-segment) path to one of the three defaults via the `collector.paths` section of the configuration file. Your custom path must be the key and the value must be one of the corresponding default paths. Both must be full valid paths starting with a leading slash:

```properties
paths {
  "/com.acme/track"    = "/com.snowplowanalytics.snowplow/tp2"
  "/com.acme/redirect" = "/r/tp2"
  "/com.acme/iglu"     = "/com.snowplowanalytics.iglu/v1"
}
```

### TLS port binding and certificate (2.4.0+)

Since 2.4.0 TLS certificates are configured using JVM system parameters. The "`Customizing JSSE`" section in [Java 11 JSSE reference documentation](https://docs.oracle.com/en/java/javase/11/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-A41282C3-19A3-400A-A40F-86F4DA22ABA9) explains all system properties in detail.

The following JVM properties are the ones to be used most of the time.

| System Property | Customized Item | Default | Notes |
| --- | --- | --- | --- |
| `javax.net.ssl.keyStore` | Default keystore; see [Customizing the Default Keystores and Truststores, Store Types, and Store Passwords](https://docs.oracle.com/en/java/javase/11/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-7D9F43B8-AABF-4C5B-93E6-3AFB18B66150) | None |   |
| `javax.net.ssl.keyStorePassword` | Default keystore password; see [Customizing the Default Keystores and Truststores, Store Types, and Store Passwords](https://docs.oracle.com/en/java/javase/11/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-7D9F43B8-AABF-4C5B-93E6-3AFB18B66150) | None | It is inadvisable to specify the password in a way that exposes it to discovery by other users. **Password can not be empty.** |
| `javax.net.ssl.keyStoreType` | Default keystore type; see [Customizing the Default Keystores and Truststores, Store Types, and Store Passwords](https://docs.oracle.com/en/java/javase/11/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-7D9F43B8-AABF-4C5B-93E6-3AFB18B66150) | `PKCS12` |    |
| `jdk.tls.server.cipherSuites` | Server-side default enabled cipher suites. See [Specifying Default Enabled Cipher Suites](https://docs.oracle.com/en/java/javase/11/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-D61663E8-2405-4B2D-A1F1-B8C7EA2688DB) | See [SunJSSE Cipher Suites](https://docs.oracle.com/en/java/javase/11/security/oracle-providers.html#GUID-7093246A-31A3-4304-AC5F-5FB6400405E2__SUNJSSE_CIPHER_SUITES) to determine which cipher suites are enabled by default | Caution: These system properties can be used to configure weak cipher suites, or the configured cipher suites may be weak in the future. It is not recommended that you use these system properties without understanding the risks. |
| `jdk.tls.server.protocols` | Default handshaking protocols for TLS/DTLS servers. See [The SunJSSE Provider](https://docs.oracle.com/en/java/javase/11/security/oracle-providers.html#GUID-7093246A-31A3-4304-AC5F-5FB6400405E2) | None | To configure the default enabled protocol suite in the server-side of a SunJSSE provider, specify the protocols in a comma-separated list within quotation marks. The protocols in this list are standard SSL protocol names as described in [Java Security Standard Algorithm Names](https://docs.oracle.com/en/java/javase/11/docs/specs/security/standard-names.html). Note that this System Property impacts only the default protocol suite (SSLContext of the algorithms SSL, TLS and DTLS). If an application uses a version-specific SSLContext (SSLv3, TLSv1, TLSv1.1, TLSv1.2, TLSv1.3, DTLSv1.0, or DTLSv1.2), or sets the enabled protocol version explicitly, this System Property has no impact. |

A deployment would need a TLS certificate, preferably issued by a trusted CA, however, for test purposes, a TLS cert could be generated as follows

```bash
ssl_dir=/opt/snowplow/ssl
mkdir -p ${ssl_dir}

sudo openssl req \
  -x509 \
  -newkey rsa:4096 \
  -keyout ${ssl_dir}/collector_key.pem \
  -out ${ssl_dir}/collector_cert.pem \
  -days 3650 \
  -nodes \
  -subj "/C=UK/O=Acme/OU=DevOps/CN=*.acme.com"

sudo openssl pkcs12 \
  -export \
  -out ${ssl_dir}/collector.p12 \
  -inkey ${ssl_dir}/collector_key.pem \
  -in ${ssl_dir}/collector_cert.pem \
  -passout pass:changeme

sudo chmod 644 ${ssl_dir}/collector.p12
```

and then the collector (kinesis as example) could be started as follows

```bash
config_dir=/opt/snowplow/config

docker run \
  -d \
  --name scala-stream-collector \
  --restart always \
  --network host \
  -v ${config_dir}:/snowplow/config \
  -v ${ssl_dir}:/snowplow/ssl \
  -p 8080:8080 \
  -p 8443:8443 \
  -e 'JAVA_OPTS=-Xms2g -Xmx2g -Djavax.net.ssl.keyStoreType=pkcs12 -Djavax.net.ssl.keyStorePassword=changeme -Djavax.net.ssl.keyStore=/snowplow/ssl/collector.p12 -Dorg.slf4j.simpleLogger.defaultLogLevel=warn -Dcom.amazonaws.sdk.disableCbor' \
  snowplow/scala-stream-collector-kinesis:2.5.0 \
  --config /snowplow/config/snowplow-stream-collector-kinesis-2.5.0.hocon
```

Note: If you don't have a verified certificate, you need to disable SSL verification on client side. e.g. `cURL`'s `-k, --insecure` flag disables it.

### Setting up an SQS buffer (2.0.0+)

On AWS, the lack of auto-scaling in Kinesis results in throttled streams in case of traffic spikes and the collector starts accumulating events to retry them later. If accumulation continues long enough, the collector will run out of memory. To prevent the possibility of a broken collector, we decided to make it possible to configure an SQS buffer which can provide additional assurance during extreme traffic spikes.

SQS is used to queue any message that the collector failed to send to Kinesis. The [Snowbridge application](/docs/api-reference/snowbridge/index.md) can then read the messages from SQS and write them to Kinesis once Kinesis is ready. In the event of any AWS API glitches, there is a retry mechanism which retries sending to the SQS queue 10 times.

The keys set up for the Kinesis stream are stored as SQS message attributes in order to preserve the information.

:::caution

The SQS messages cannot be as big as Kinesis messages. The limit is 256kB per message, but we send the messages as Base64 encoded, so the limit goes down to 192kB for the original message.

:::

#### Setting up the SQS queues

:::note

This section only applies to the case when SQS is used as a fallback sink when Kinesis is unavailable. If you are using SQS as the primary sink, then the settings below should be ignored and the `good` and `bad` streams should be configured as normal under `streams.good` and `streams.bad` respectively.

:::

To start using this feature, you will first need to set up the SQS queues. Two separate queues are required for good (raw) events and bad events. The Collector then needs to be informed about the queue names, and this can be done by adding these as entries to `config.hocon`:

```properties
sqsGoodBuffer = {good-sqs-queue-url}
sqsBadBuffer = {bad-sqs-queue-url}
```

### Networking

Since version 3.0.0 networking settings are configured in its own `collector.networking` section:

| parameter                                                    | description                                                                                                                                        |
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `collector.networking.maxConnections` (since *3.0.0*)        | Optional. Default: `1024`. Maximum number of concurrent active connection.                                                                         |
| `collector.networking.idleTimeout` (since *3.0.0*)           | Optional. Default: `610 seconds`. Maximum inactivity time for a network connection. If no data is sent within that time, the connection is closed. |
| `collector.networking.responseHeaderTimeout` (since *3.2.0*) | Optional. Default: `30 seconds`. Time from when the request is made until a response line is generated before a 503 response is returned.          |
| `collector.networking.maxRequestLineLength` (since *3.2.0*)  | Optional. Default: `20480`. Maximum request line to parse. If exceeded returns a 400 Bad Request.                                                  |
| `collector.networking.maxHeadersLength` (since *3.2.0*)      | Optional. Default: `40960`. Maximum data that composes the headers. If exceeded returns a 400 Bad Request.                                         |
| `collector.networking.maxPayloadSize` (since *3.3.0*)        | Optional. Default: `1048576` (1 MB). Maximum size of an event within payload allowed before emitting an Size Violation event. Returns 200 OK.      |
| `collector.networking.dropPayloadSize` (since *3.3.0*)       | Optional. Default: `2097152` (2 MB). Maximum body payload size allowed before rejecting the request. If exceeded returns a 413 Payload Too Large.  |
