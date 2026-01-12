In addition to the native functions available in the jq language, the following helper functions are available for use in a jq query:

* `epoch` converts a Go `time.Time` timestamp to an epoch timestamp in seconds, as integer type. jq's native timestamp-based functions expect integer input, but the Snowplow Analytics SDK provides base level timestamps as `time.Time`. This function can be chained with jq native functions to get past this limitation. For example:

```
{ foo: .collector_tstamp | epoch | todateiso8601 }
```

* `epochMillis` converts a Go `time.Time` timestamp to an epoch timestamp in milliseconds, as unsigned integer type. Because of how integers are handled in Go, unsigned integers aren't compatible with jq's native timestamp functions, so the `epoch` function truncates to seconds, and the `epochMillis` function exists in case milliseconds are needed. This function cannot be chained with native jq functions, but where milliseconds matter for a value, use this function.

```
{ foo: .collector_tstamp | epochMillis }
```

* `hash(algorithm, salt)` hashes the input value. To use unsalted hash, pass an empty string for salt. Salt may be provided as an environment variable using hcl syntax.

The following hash algorithms are supported:
- `sha1` - SHA-1 hash (160 bits)
- `sha256` - SHA-256 hash (256 bits)
- `md5` - MD5 hash (128 bits) 

```
{ foo: .user_id |  hash("sha1"; "${env.SHA1_SALT}") }
```