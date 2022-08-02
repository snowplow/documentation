## Obtaining an API key

[Create a new api key for your organization in console](https://console.snowplowanalytics.com/credentials).

Use the generated api key to obtain an authorization token.

```
curl \
  --header 'X-API-Key: $API_KEY' \
  https://console.snowplowanalytics.com/api/msc/v1/organizations/$ORGANIZATION_ID/credentials/v2/token
```

This command will return an access token wrapped in json.

```
{"accessToken":"<access token value>"}
```

You may then use this access token value to supply authorization headers for subsequent api requests.

```
curl \
  --header 'authorization: Bearer $ACCESS_TOKEN_VALUE'
```
