---
title: "Control Plane API"
date: "2021-03-31"
sidebar_position: -10
---

Snowplow Mini Control Plane API is created for controlling and configuring the Snowplow Mini instance without ssh to it.

You can use control plane from Snowplow Mini dashboard or you can send a request to a specific endpoint of the API with any HTTP client e.g. cURL

### Authentication

The Control Plane uses [HTTP basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).

This means that you need to add "-u username:password" to all `curl` commands, where `username` and `password` are as you specified in the Snowplow Mini setup.

### Current Methods

#### Service restart

```
/control-plane/restart-services﻿
```

Example using `curl`:

```
$ curl -XPUT http://${snowplow_mini_ip}/control-plane/restart-services \       -u username:password﻿
```

Restarts all the services running on the Snowplow Mini, including Stream Collector, Stream Enrich, Elasticsearch Loader.

This API call blocks until all the services have been restarted.

Return status 200 means that services have been successfully restarted.

#### Adding external Iglu Server

```
/control-plane/external-iglu﻿
```

Example using `curl`:

```
curl -XPOST http://${snowplow_mini_ip}/control-plane/external-iglu \    -d "uri=${external_iglu_uri}&apikey=${external_iglu_server_apikey}&vendor_prefix=${vendor_prefix}&name=${iglu_server_name}&priority=${priority}" \    -u username:password﻿
```

Adds given pieces of information of the external Iglu Server to iglu resolver json file to use it with Stream Enrich.

Note that a lower priority number means that the repo is ranked higher in terms of priority.

Return status 200 means that pieces of information are added to iglu resolver json file and Stream Enrich is restarted successfully.

**Note**: Apikey must follow the UUID format.

#### Uploading custom enrichments

```
/control-plane/enrichments﻿
```

Example using `curl`:

```
curl http://${snowplow_mini_ip}/control-plane/enrichments \    -F "enrichmentjson=@${path_of_the_custom_enrichment_dir}" \    -u username:password﻿
```

Upload custom enrichment json file to enrichments directory and restarts the Stream Enrich to activate uploaded custom enrichment.

Return status 200 means that custom enrichment json file is placed in the enrichments directory and Stream Enrich is restarted successfully.

#### Adding apikey for local Iglu Server

```
/control-plane/local-iglu-apikey﻿
```

Example using `curl`:

```
curl -XPOST http://${snowplow_mini_ip}/control-plane/local-iglu-apikey \    -d "local_iglu_apikey=${new_local_iglu_apikey}" \    -u username:password﻿
```

Adds provided apikey to the section of local Iglu Server in the iglu resolver json config. Restarts to Stream Enrich to activate the changes.

Return status 200 means that apikey is added and Stream Enrich is restarted successfully.

**Note**: Apikey must follow the UUID format.

#### Changing credentials for basic HTTP authentication

```
/control-plane/credentials﻿
```

Example using `curl`:

```
curl -XPOST http://${snowplow_mini_ip}/control-plane/credentials \    -d "new_username=${new_username}&new_password=${new_password}" \    -u username:password﻿
```

Changes the credentials for basic HTTP authentication.

You will get always empty reply from the server because caddy server will be restarted after credentials are submitted and the connection will be lost until caddy server is up and running.

#### Add domain name

```
/control-plane/domain-name﻿
```

Example using `curl`:

```
curl -XPOST http://${snowplow_mini_ip}/control-plane/domain-name \    -d "domain_name=${registered_domain_name}" \    -u username:password﻿
```

Adds domain name for Snowplow Mini instance. After adding the domain name, your connection will be secured with TLS automatically. Make sure that given domain name is resolving to Snowplow Mini instance IP address.

You will get always empty reply from the server because caddy server will be restarted after the domain name is submitted and the connection will be lost until caddy server is up and running.

#### Get Snowplow Mini version

```
/control-plane/version﻿
```

Example using `curl`:

```
curl -XGET http://${snowplow_mini_ip}/control-plane/version \    -u username:password﻿
```

Returns version of the running Snowplow Mini instance.

#### Uploading Iglu Server configuration

```
/control-plane/iglu-config﻿
```

Example using `curl`:

```
curl http://${snowplow_mini_ip}/control-plane/iglu-config \    -F "igluserverhocon=@${path_of_the_iglu_server_config}" \    -u username:password﻿
```

Uploads Iglu Server configuration file and restarts the Iglu Server to activate uploaded configuration.

Return status 200 means that configuration is uploaded and Iglu Server is restarted successfully.
