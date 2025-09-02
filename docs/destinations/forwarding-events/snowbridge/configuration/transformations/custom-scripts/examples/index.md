---
title: "Script transformation examples"
date: "2022-10-20"
sidebar_position: 900
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Examples showing the transformation of Snowplow or non-Snowplow data.

## Non-Snowplow data

For this example, the input data is a json string which looks like this:

```json
{
  "name": "Bruce",
  "id": "b47m4n",
  "batmobileCount": 1
}
```

The script filters out any data with a `batmobileCount` less than 1, otherwise it updates the Data's `name` field to "Bruce Wayne", and sets the PartitionKey to the value of `id`:

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/examples/js-non-snowplow-script-example.js
`}</CodeBlock>

The configuration for this script is:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/examples/js-non-snowplow-config-example.hcl
`}</CodeBlock>

## Snowplow data

For this example, the input data is a valid Snowplow TSV event - so we can enable `snowplow_mode`, which will convert the data to a JSON before passing it to the script as a JSON object.

The script below filters out non-web data, based on the `platform` value, otherwise it checks for a `user_id` value, setting a new `uid` field to that value if it's found, or `domain_userid` if not.

It also sets the partitionKey to `app_id`.

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/examples/js-snowplow-script-example.js
`}</CodeBlock>

The configuration for this script is:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/examples/js-snowplow-config-example.hcl
`}</CodeBlock>
