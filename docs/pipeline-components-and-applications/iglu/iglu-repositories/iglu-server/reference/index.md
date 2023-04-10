---
title: "Iglu Server configuration reference"
date: "2021-08-03"
sidebar_position: 0
---

This is a complete list of the options that can be configured in the Iglu Server HOCON config file. The [example configs in github](https://github.com/snowplow-incubator/iglu-server/tree/master/config) show how to prepare an input file.

## Common options

| parameter | description |
|-|-|
| `repoServer.interface` | Optional. Default: `0.0.0.0`. Address on which the server listens to http connections. |
| `repoServer.port` | Optional. Default: `8080`. Port on which the server listens. |
| `repoServer.idleTimeout` | Default: `30 seconds`. TCP connections are dropped after this timeout expires. In case Iglu Server runs behind a load balancer, this should slightly exceed the load balancer's idle timeout. |
| `database.type` | Optional. Default: `postgres`. Can be changed to `dummy` during development for in-memory only storage. |
| `database.host` | Required. Host name for Postgres database. |
| `database.port` | Optional. Default: `5432`. Port for Postgres database. |
| `database.dbname` | Required. Name of Postgres database. |
| `database.username` | Required. Username for connecting to Postgres. |
| `database.password` | Required. Password for connecting to Postgres. |
| `swagger.baseUrl` | Optional. Example: `/custom/prefix`. Customise the api base url in Swagger. Helpful for when running iglu-server behind a proxy server. |
| `debug` | Optional. Default: `false`.  Enable additional debug api endpoint to respond with all internal state. |
| `patchesAllowed` | Optional. Default: `false`. If `true`, schemas sent to the `/api/schemas` endpoint will overwrite existing ones rather than be skipped if a schema with the same key already exists. Also, we have the superseding schemas feature that is an alternative to overwriting schemas. More information about the superseding schemas can be found [here](/docs/understanding-tracking-design/versioning-your-data-structures/superseding-schema/index.md). |
| `webhooks.schemaPublished` | Optional. Array with the list of webhooks that will be called when a schema is published or updated with a vendor that matches the specified prefixes. See the [examples in github](https://github.com/snowplow-incubator/iglu-server/blob/0.8.7/config/config.reference.hocon#L81-L99). |
| `webhooks.schemaPublished.uri` | Required. URI of the HTTP server that will receive the webhook event. |
| `webhooks.schemaPublished.vendorPrefixes` | Optional. Example: `["com", "org.acme", "org.snowplow"]`. List of schema prefixes (regexes) that should be sent via the webhook. |
| `webhooks.schemaPublished.usePost` (since *0.8.7*) | Optional. Default: `false`. Whether to use `POST` to send request via the webhook. |
| `superApiKey` | Optional. Set a super api key with permission to read/write any schema, and add other api keys. |

## Advanced options

We believe these advanced options are set to sensible defaults, and hopefully you won’t need to ever change them.

| parameter | description |
|-|-|
| `repoServer.threadPool.type` | Default: `fixed` for a fixed thread pool. Can be `cached` for a cached thread pool. Type of the thread pool used by the underlying BlazeServer for executing Futures. |
| `repoServer.threadPool.size` | Optional. Default: `4`. Size of the thread pool if the type is `fixed`. |
| `repoServer.maxConnections` | Optional. Default: `1024`. Maximum number of client connections that may be active at any time. |
| `database.pool.type` | Optional. Default: `hikari` (recommended for production). Can be changed to `nopool` to remove the upper bound on the number of connections. |
| `database.pool.maximumPoolSize` | Optional. Default: `5`. Maximum number of connections in the Hikari pool. |
| `database.pool.connectionTimeout` | Optional. Default: `30 seconds`. Timeout on the Hikari connection pool. |
| `database.pool.maxLifetime` | Optional. Default: `1800 seconds`. Maximum lifetime of a connection in the Hikari pool. |
| `database.pool.minimumIdle` | Optional. Default: `5`. Minimum number of idle connections in the Hikari pool. |
| `database.pool.connectionPool.type` | Optional. Default: `fixed` for a fixed thread pool (recommended in production). Type of the thread pool used for awaiting connection to the database. |
| `database.pool.connectionPool.size` | Optional. Default: `4`. Number of threads to use when the connection pool has type `fixed`. |
| `database.pool.transactionPool.type` | Optional. Default: `cached` (recommended for production). Type of the thread pool used for blocking JDBC operations. |
| `preTerminationPeriod` (since *0.8.0*) | Optional. Default: `1 second`. How long the server should pause after receiving a sigterm before starting the graceful shutdown. During this period the server continues to accept new connections and respond to requests. |
| `preTerminationUnhealthy` (since *0.8.0*) | Optional. Default: `false`. During the `preTerminationPeriod`, the server can be configured to return 503s on the `/health` endpoint. Can be helpful for removing the server from a load balancer’s targets. |
