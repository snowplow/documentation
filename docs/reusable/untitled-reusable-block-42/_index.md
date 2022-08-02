### 8\. Default redirect endpoint

Updated v2.0.0 - EnableDefaultRedirect set to false by default

If you wish to enable the default endpoint, then you would need to set `enableDefaultRedirect = true` in the `config.hocon` file. Alternatively, you can set the default endpoint to `false` (disabled) and instead set up a custom user-defined url for redirects. For example, the following configuration will only allow redirects for the custom-defined `/com.acme/redirect-me` endpoint, whereas the default `/r/tp2` will not be available.

enableDefaultRedirect = false
paths {
  "/com.acme/redirect-me" = "/r/tp2"
}
