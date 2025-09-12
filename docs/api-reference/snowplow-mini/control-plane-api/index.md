---
title: "Control Plane API"
description: "Control plane API reference for managing Snowplow Mini behavioral data pipeline configurations."
schema: "TechArticle"
keywords: ["Mini API", "Control Plane", "Mini Management", "API Interface", "Mini Control", "Management API"]
date: "2021-05-11"
sidebar_position: 4
---

Snowplow Mini Control Plane API is created for controlling and configuring the Snowplow Mini instance without ssh to it.

You can use control plane from Snowplow Mini dashboard or you can send a request to a specific endpoint of the API with any HTTP client e.g. cURL

### Authentication

The Control Plane uses [HTTP basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).

This means that you need to add "-u username:password" to all `curl` commands, where `username` and `password` are as you specified in the Snowplow Mini setup.

### Current Methods

#### Service restart

```bash
/control-plane/restart-services﻿
```

Example using `curl`:

```bash
$ curl -XPUT http://${snowplow_mini_ip}/control-plane/restart-services \       -u username:password﻿
```

Restarts all the services running on the Snowplow Mini, including Stream Collector, Stream Enrich, Elasticsearch Loader.

This API call blocks until all the services have been restarted.

Return status 200 means that services have been successfully restarted.

#### Resetting Opensearch indices

As of 0.13.0, it is possible to reset Opensearch (or previously Elasticsearch) indices, along with the corresponding index patterns in Opensearch Dashboards, through Control Plane API.

```bash
curl -L \
-X POST '<mini-address>/control-plane/reset-service' \
-u '<username>:<password>' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'service_name=elasticsearch'
```

Note that resetting deletes not only indices and patterns but also all events stored so far.

#### Restart services individually

As of 0.13.0, it is possible to restart services one by one.

```bash
curl -L \
-X PUT '<mini-address>/control-plane/restart-service' \
-u '<username>:<password>' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'service_name=<service_name>'
```

where `service_name` can be one of the following: `collector`, `enrich`, `esLoaderGood`, `esLoaderBad`, `iglu`, `kibana`, `elasticsearch`.

#### Configuring telemetry

See our [telemetry principles](/docs/get-started/snowplow-community-edition/telemetry/index.md) for more information on telemetry.

HTTP GET to get current configuration

```bash
curl -L -X GET '<mini-address>/control-plane/telemetry' -u '<username>:<password>'
```

HTTP PUT to set it (use true or false as value of key `disable` to turn it on or off)

```bash
curl -L -X PUT '<mini-address>/control-plane/telemetry' -u '<username>:<password>' -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'disable=false'
```

#### Adding external Iglu Server

```bash
/control-plane/external-iglu﻿
```

Example using `curl`:

```bash
curl -XPOST http://${snowplow_mini_ip}/control-plane/external-iglu \
  -d "uri=${external_iglu_uri}&apikey=${external_iglu_server_apikey}&vendor_prefix=${vendor_prefix}&name=${iglu_server_name}&priority=${priority}" \
  -u username:password
```

Adds given pieces of information of the external Iglu Server to iglu resolver json file to use it with Stream Enrich.

Note that a lower priority number means that the repo is ranked higher in terms of priority.

Return status 200 means that pieces of information are added to iglu resolver json file and Stream Enrich is restarted successfully.

**Note**: Apikey must follow the UUID format.

#### Uploading custom enrichments

```bash
/control-plane/enrichments﻿
```

Example using `curl`:

```bash
curl http://${snowplow_mini_ip}/control-plane/enrichments \
  -F "enrichmentjson=@${path_of_the_custom_enrichment_dir}" \
  -u username:password
```

Upload custom enrichment json file to enrichments directory and restarts the Stream Enrich to activate uploaded custom enrichment.

Return status 200 means that custom enrichment json file is placed in the enrichments directory and Stream Enrich is restarted successfully.

#### Adding apikey for local Iglu Server

```bash
/control-plane/local-iglu-apikey﻿
```

Example using `curl`:

```bash
curl -XPOST http://${snowplow_mini_ip}/control-plane/local-iglu-apikey \
  -d "local_iglu_apikey=${new_local_iglu_apikey}" \
  -u username:password
```

Adds provided apikey to the section of local Iglu Server in the iglu resolver json config. Restarts to Stream Enrich to activate the changes.

Return status 200 means that apikey is added and Stream Enrich is restarted successfully.

**Note**: Apikey must follow the UUID format.

#### Changing credentials for basic HTTP authentication

As of version 0.13.0, this endpoint doesn't accept new passwords shorter than 8 chars and with a score lower than 4 according to [zxcvbn](https://pkg.go.dev/github.com/trustelem/zxcvbn)

```bash
/control-plane/credentials
```

Example using `curl`:

```bash
curl -XPOST http://${snowplow_mini_ip}/control-plane/credentials \
  -d "new_username=${new_username}&new_password=${new_password}" \
  -u username:password
```

Changes the credentials for basic HTTP authentication.

You will get always empty reply from the server because caddy server will be restarted after credentials are submitted and the connection will be lost until caddy server is up and running.

#### Add domain name

```bash
/control-plane/domain-name﻿
```

Example using `curl`:

```bash
curl -XPOST http://${snowplow_mini_ip}/control-plane/domain-name \
  -d "domain_name=${registered_domain_name}" \
  -u username:password
```

Adds domain name for Snowplow Mini instance. After adding the domain name, your connection will be secured with TLS automatically. Make sure that given domain name is resolving to Snowplow Mini instance IP address.

You will get always empty reply from the server because caddy server will be restarted after the domain name is submitted and the connection will be lost until caddy server is up and running.

#### Get Snowplow Mini version

```bash
/control-plane/version﻿
```

Example using `curl`:

```bash
curl -XGET http://${snowplow_mini_ip}/control-plane/version \
  -u username:password
```

Returns version of the running Snowplow Mini instance.

#### Uploading Iglu Server configuration

```bash
/control-plane/iglu-config﻿
```

Example using `curl`:

```bash
curl http://${snowplow_mini_ip}/control-plane/iglu-config \
  -F "igluserverhocon=@${path_of_the_iglu_server_config}" \
  -u username:password
```

Uploads Iglu Server configuration file and restarts the Iglu Server to activate uploaded configuration.

Return status 200 means that configuration is uploaded and Iglu Server is restarted successfully.
