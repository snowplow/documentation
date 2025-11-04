---
title: Create a local data structure
position: 2
---

Firstly we'll need a place to put things.

```bash
$ mkdir -p snowplow-structures/data-structures
$ cd snowplow-structures
```
:::tip
snowplow-cli data structures commands default to looking for data structures in `./data-structures`.
:::

Now let's create our data structure. We'll create a custom event called 'login'.

```bash
$ snowplow-cli ds generate login --vendor com.example
```
:::note
`ds` is an alias for `data-structures`.
:::

This should provide us the following output

```
3:00PM INFO generate wrote=data-structures/com.example/login.yaml
```

The generated file is written to our default `data-structures` directory under a sub directory matching the `--vendor` we supplied with a filename that mirrors the name we gave the data structure. Help for all the arguments available to `generate` is available by running `snowplow-cli ds generate --help`.

:::note
This directory layout and file naming scheme is also followed by the [download](https://docs.snowplow.io/docs/data-product-studio/data-structures/manage/cli/#downloading-data-structures) command.
:::

Let's see what it has created for us.

```yml title="data-structures/com.example/login.yaml"
apiVersion: v1
resourceType: data-structure
meta:
  hidden: false
  schemaType: event
  customData: {}
data:
  $schema: http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#
  self:
    vendor: com.example
    name: login
    format: jsonschema
    version: 1-0-0
  type: object
  properties: {}
  additionalProperties: false
```
* `apiVersion` should always be `v1`
* `resourceType` should remain `data-structure`
* `meta.hidden` directly relates to showing and hiding [in Console UI](https://docs.snowplow.io/docs/data-product-studio/data-structures/manage/#hiding-a-data-structure)
* `meta.schemaType` can be `event` or `entity`
* `meta.customData` is a map of strings to strings that can be used to send across any key/value pairs you'd like to associate with the data structure
* `data` is the actual [snowplow self describing schema](https://docs.snowplow.io/docs/api-reference/iglu/common-architecture/self-describing-json-schemas) that this data structure describes
