## Obtaining an API key

[Create a new api key for your organization in console](https://console.snowplowanalytics.com/credentials).

#### Authorizing with v2

Use the generated api key to obtain an authorization token.

```bash
curl \
  --header 'X-API-Key: $API_KEY' \
  https://console.snowplowanalytics.com/api/msc/v1/organizations/$ORGANIZATION_ID/credentials/v2/token
```

#### Authorizing with v3

Use the generated api key ID and secret to obtain an authorization token.

```bash
curl \
  --header 'X-API-Key-ID: $API_KEY_ID' \
  --header 'X-API-Key-Secret: $API_KEY_SECRET' \
  https://console.snowplowanalytics.com/api/msc/v1/organizations/$ORGANIZATION_ID/credentials/v3/token
```

This command will return an access token wrapped in json.

```json
{"accessToken":"<access token value>"}
```

You may then use this access token value to supply authorization headers for subsequent api requests.

```bash
curl \
  --header 'authorization: Bearer $ACCESS_TOKEN_VALUE'
```
