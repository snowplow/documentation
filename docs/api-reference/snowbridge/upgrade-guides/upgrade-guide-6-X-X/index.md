---
id: "Snowbridge 6.x upgrade"
title: "Snowbridge 6.x upgrade guide"
sidebar_label: "Snowbridge 6.x upgrade"
date: "2026-07-15"
sidebar_position: 600
description: "Upgrade Snowbridge to version 6.X.X with breaking changes to HTTP target OAuth2 configuration, the hash transformation helper, and the Docker base image."
keywords: ["snowbridge 6.x upgrade", "upgrade guide", "snowbridge migration", "version 6"]
---

## Version 6.0.0 breaking changes

Version 6.0.0 restructures the HTTP target's OAuth2 settings, changes the values returned by the `hash` transformation helper, and rebuilds the Docker images on a distroless base. Only the OAuth2 change requires a configuration edit, but review each section below before upgrading.

### HTTP target OAuth2 configuration

The four top-level `oauth2_*` settings have been replaced by an `oauth_client {}` block. This makes room for the new [JWT bearer flow](/docs/api-reference/snowbridge/configuration/targets/http/index.md#jwt-bearer-flow), which is configured through a separate `oauth_jwt {}` block.

| v5 setting (top-level) | v6 setting (inside `oauth_client {}`) |
|---|---|
| `oauth2_client_id` | `client_id` |
| `oauth2_client_secret` | `client_secret` |
| `oauth2_refresh_token` | `refresh_token` |
| `oauth2_token_url` | `token_url` |

**Migration required**: move your OAuth2 credentials into an `oauth_client {}` block.

**Before:**
```hcl
target {
  use "http" {
    url                  = "https://acme.com/x"
    oauth2_client_id     = env.CLIENT_ID
    oauth2_client_secret = env.CLIENT_SECRET
    oauth2_refresh_token = env.REFRESH_TOKEN
    oauth2_token_url     = "https://my.auth.server/token"
  }
}
```

**After (6.0.0):**
```hcl
target {
  use "http" {
    url = "https://acme.com/x"

    oauth_client {
      client_id     = env.CLIENT_ID
      client_secret = env.CLIENT_SECRET
      refresh_token = env.REFRESH_TOKEN
      token_url     = "https://my.auth.server/token"
    }
  }
}
```

`oauth_client {}` and `oauth_jwt {}` are mutually exclusive — configuring both fails at startup.

### `hash` transformation helper

The `hash` helper available in [custom scripts](/docs/api-reference/snowbridge/configuration/transformations/custom-scripts/index.md) and [jq transformations](/docs/api-reference/snowbridge/configuration/transformations/builtin/jq.md) returns the digest of the chosen hash function, rather than a PBKDF2-derived key.

**Output values change**, but no configuration change is required:

* Unsalted hashing returns the plain digest of the selected function.
* Salted hashing returns an HMAC of the input, keyed with the salt.
* Output length follows the selected function — 40 hex characters for `sha1`, 64 for `sha256`, 32 for `md5` — instead of the fixed 48 hex characters produced by PBKDF2.

**Migration required** if you depend on hash values matching data produced by earlier versions. Values hashed by Snowbridge 6.x will not match values hashed by 5.x or earlier for the same input, so any downstream joins, deduplication, or identity stitching on a hashed field will break across the upgrade boundary. Where a destination stores previously hashed values, plan for the change of value — for example by re-hashing historical data, or by switching to a new field.

### Distroless Docker images

Both the main and AWS-only images are built on `gcr.io/distroless/static-debian12:nonroot` instead of Alpine. The image contains only the Snowbridge binary — there is no shell, package manager, or other userland.

This has no effect on how Snowbridge is configured or run, but it does change a few operational details:

* `docker exec` into a running container no longer works — there is no `sh` or `busybox` to exec into. Use logs and metrics for debugging instead.
* The container runs as UID/GID `65532:65532` (the distroless `nonroot` user) rather than the Alpine-created `snowplow` user. If you mount a config file or TLS certificates into the container, make sure they are readable by that UID.
* Anything in your deployment that installs packages into the image or runs shell commands in it (for example a shell-based health check, or an entrypoint wrapper script) needs to be reworked.

### Go module path

The Go module path is `github.com/snowplow/snowbridge/v6`. This only affects you if you import Snowbridge packages in your own Go code — for example the [HTTP target's request templater](https://github.com/snowplow/snowbridge/tree/master/pkg/target/http). Update your imports from `github.com/snowplow/snowbridge/v5/...` to `github.com/snowplow/snowbridge/v6/...`.
