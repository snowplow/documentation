Control Plane API is created for controlling and configuring the Snowplow Mini instance without ssh to it. You can use control plane from Snowplow Mini dashboard or you can send request to specific endpoint of the api with curl.

### Authentication

The Control Plane uses [HTTP basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).

This means that you need to add "-u username:password" to all `curl` commands, where `username` and `password` are as you specified in the Snowplow Mini setup.

### Current Methods

#### Service restart

```
/control-plane/restart-services
```

Example using `curl`:

```
$ curl -XPUT http://${snowplow_mini_ip}/control-plane/restart-services \
-u username:password
```

Restarts all the services running inside the Snowplow Mini, including Stream Collector, Stream Enrich, Elasticsearch Loader.

This API call blocks until all the services have been restarted.

Return status 200 means that services have been successfully restarted.
