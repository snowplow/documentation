# Non-Snowplow data

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

For this example, the input data is a json string which looks like this: 

```json
{
  "name": "Bruce",
  "id": "b47m4n",
  "batmobileCount": 1
}
```

The script filters out any data with a `batmobileCount` less than 1, otherwise it updates the Data's `name` field to "Bruce Wayne", and sets the PartitionKey to the value of `id`:

<Tabs groupId="platform">
  <TabItem value="js" label="Javascript" default>

```js reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/examples/js-non-snowplow-script-example.js
```

  </TabItem>
  <TabItem value="lua" label="Lua">

```lua reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/examples/lua-non-snowplow-script-example.lua
```

  </TabItem>
</Tabs>

The configuration for this script is:

<Tabs groupId="platform">
  <TabItem value="js" label="Javascript" default>

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/examples/js-non-snowplow-config-example.hcl
```

  </TabItem>
  <TabItem value="lua" label="Lua">

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/examples/lua-non-snowplow-config-example.hcl
```

  </TabItem>
</Tabs>
