---
title: "Distribution and deployment"
date: "2022-10-20"
sidebar_position: 200
---

# Distribution and deployment

## Distribution options

Snowbridge is available on docker:

```bash
docker pull snowplow/snowbridge:{version}
docker run snowplow/snowbridge:{version}
```

Note that due to the restrictive licenc of [a dependency](https://github.com/twitchscience/kinsumer/blob/master/LICENSE), the kinesis source may only be used on AWS infrastructure. For the version which includes this dependency, append `-aws-only` to the version. For example, the `2.0.1` version may be used with kinesis source via the `2.0.1-aws-only` asset. The `2.0.1` asset excludes kinesis source, and may be run on any platform.

## Deployment

The app can be deployed via services like EC2, ECS or Kubernetes using docker.

Configuration and authentication can be done by mounting the relevant files, and/or setting the relevant environment variables as per the standard authentication methods for cloud services.


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Snowbridge" since="1.0.0" idSetting="user_provided_id" disableSetting="disable_telemetry" />
```