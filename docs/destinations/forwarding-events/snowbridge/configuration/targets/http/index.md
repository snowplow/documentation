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

## Dynamic Headers

:::note
This feature was added in version 2.3.0
:::

When enabled, the dynamic headers attaches a header to the data according to what your transformation provides in the `HTTPHeaders` field of `engineProtocol`. Data is batched according to the dynamic header value before requests are sent.

## Request templating

:::note
This feature was added in version 3.0.0
:::

This feature allows you to provide a [Golang text template](https://pkg.go.dev/text/template) to construct a request body from a batch of data. This feature should be useful in constructing requests to send to an API, for example.

Input data must be valid JSON, any message whose that fails to be marshaled to JSON will be treated as invalid and sent to the failure target. Equally, if an attempt to template a batch of data results in an error, then all messages in the batch will be considred invalid and sent to the failuret target.

Where the dynamic headers feature is enabled, data is split into batches according to the provided header value, and the templater will operate on each batch separately.

### Helper functions

In addition to all base functions available in the Go text/template package, the following custom functions are available for convenience:

`prettyPrint` - Because the input to the templater is a Go data structure, simply providing a reference to an object field won't produce a JSON object in the output of the template. `prettyPrint` converts the data to prettified JSON (by unmarshaling to json). Use it wherever you expect a JSON object in the output. This is compatible with any data type, but it shouldn't be necessary if the data is not an object.

`env` - Allows you to set and refer to an env var in your template. Use it when your request body must contain sensitive data, for example an API key.

### Template example

The following example provides an API key via environment variable, and iterates the batch to provide JSON-formatted data one by one into a new key, inserting a comma before all but the first event.

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/http-template-full-example.file
```

### Default behaviour, and breaking changes in v3

Where no template is configured, the POST request body will contain an array of JSON containing the data for the whole batch. Data must be valid JSON or it will be considered invalid and sent to the failure target.

Note that this is a breaking change to the pre-v3 default behaviour, in two ways:

1. Previously to v3, we sent data one request per message

This means that where no template is provided, request bodies will be arrays of JSON rather than individual JSON objects. 

For example, pre-v3, a request body might look like this:

```
{"foo": "bar"}
```

But it will now look like this:

```
[{"foo": "bar"}]
```

If you need to preserve the previous behaviour (as long as your data is valid JSON), you can set `request_max_messages` to 1, and provide this template:

```go reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/http-template-unwrap-example.file
```

2. Non-JSON data is not supported

While the intention was never to support non-JSON data, previously to v3 the request body was simply populated with whatever bytes were found in the message data, regardless of whether it is valid JSON.

From v3 on, only valid JSON will work, otherwise the message will be considered invalid and sent to the failure target.

## Response rules (beta)

:::note
This feature was added in version 3.0.0

This feature is in beta status because we may make breaking changes in future versions.
:::

Response rules allow you to configure how the app deals with failures in sending the data. You can configure a response code and an optional string match on the response body to determine how a failure response is handled. Response codes between 200 and 299 are considered successful, and are not handled by this feature.

There are three categories of failure:

`invalid` means that the data is considered incompatible with the target for some reason. For example, you may have defined a mapping for a given API, but the event happens to have null data for a required field. In this instance, retrying the data won't fix the issue, so you would configure an invalid response rule, identifying which responses indicate this scenario.

Data that matches an invalid response rule is sent to the failure target.

`setup` means that this error is not retryable, but is something which can only be resolved by a change in configuration or a change to the target. An example of this is an authentication failure - retrying will fix the issue, the resolution is to grant the appropriate permissions, or provide the correct API key.

Data that matches a setup response rule is handled by a retey as determined in the `setup` configuration block of [retry configuration](/docs/destinations/forwarding-events/snowbridge/configuration/retries/index.md).

`transient` errors are everything else - we assume that the issue is temporary and retrying will resolve the problem. An example of this is being throttled by an API because too much data is being sent at once. There is no explicit configuration for transient - rather, anything that is not configured as one of the other types is considered transient.

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
