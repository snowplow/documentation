In addition to the native functions available in the jq language, the following helper functions are available for use in a jq query:

`epoch` - converts a time.Time to an epoch in seconds, as integer type. jq's native timestamp based functions expect integer input, but the Snowplow Analytics SDK provides base level timestamps as time.Time. This function can be chained with jq native functions to get past this limitation. For example:

```
{ foo: .collector_tstamp | epoch | todateiso8601 }
```

`epochMillis` - converts a time.Time to an epoch in milliseconds, as unsigned integer type. Because of how integers are handled in Go, unsigned integers aren't compatible with jq's native timestamp functions, so the `epoch` function truncates to seconds. This function cannot be chained with native jq functions, but where milliseconds matter for a value, use this function.

```
{ foo: .collector_tstamp | epochMillis }
```