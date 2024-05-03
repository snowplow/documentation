---
title: "HTTP Target"
description: "Send data over HTTP."
---

## Basic Authentication

Where basicauth is used, it may be configured using the `basic_auth_username` and `basic_auth_password` options. Where an authorisation header is used, it may be set via the `headers` option.

we recommend using environment variables for sensitive values - which can be done via HCL's native `env.MY_ENV_VAR` format (as seen below).

TLS may be configured by providing the `key_file`, `cert_file` and `ca_file` options with paths to the relevant TLS files.

## OAuth2

Snowbridge supports sending authorized requests to OAuth2 - compliant HTTP targets. This can be enabled in by setting `oauth2_client_id `, `oauth2_client_secret`, `oauth2_refresh_token` (these 3 are long-lived credentials used to generate short-lived bearer access tokens) and `oauth2_token_url`(which is the URL of authorization server providing access tokens).

Like in the case of basic authentication, we recommend using environment variables for sensitive values.

## Configuration options

Here is an example of the minimum required configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/http-minimal-example.hcl
```

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/http-full-example.hcl
```

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
