# Snowplow data

For this example, the input data is a valid Snowplow TSV event - so we can enable `snowplow_mode`, which will convert the data to a JSON before passing it to the script as a JSON object.

The script below filters out non-web data, based on the `platform` value, otherwise it checks for a `user_id` value, setting a new `uid` field to that value if it's found, or `domain_userid` if not.

It also sets the partitionKey to `app_id`.

```js reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/examples/js-snowplow-script-example.js
```     

The configuration for this script is:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/examples/js-snowplow-config-example.hcl
```
