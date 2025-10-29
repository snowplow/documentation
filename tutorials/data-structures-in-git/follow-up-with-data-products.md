---
title: Follow up with Data Products
position: 6
---

Now that we have our data structures set up, we can define data products to organize and document how these structures are used across our applications. We'll walk through creating source applications, data products, and event specifications using the CLI, then integrate them into our automated workflows.

## Create a source applications

First, we'll create a source application to represent our website that will send the `login` event we defined earlier.

```bash
snowplow-cli dp generate --source-app website
```
:::note
`dp` is an alias for `data-products`. Source applications and event specifications are also managed by this command
:::

This should provide the following output
```
INFO generate wrote kind="source app" file=data-products/source-apps/website.yaml
```

The generated file is written to the default `data-products/source-apps` directory. Help for all the arguments available to `generate` is available by running `snowplow-cli dp generate --help`.

Let's examine the generated file:

```yml title="data-products/source-apps/website.yaml"
apiVersion: v1
resourceType: source-application
resourceName: b8261a25-ee81-4c6a-a94c-7717ba835035
data:
    name: website
    appIds: []
    entities:
        tracked: []
        enriched: []
```

* `apiVersion` should always be `v1`
* `resourceType` should remain `source-application`
* `resourceName` is a unique identifier of the source applications. It must be a valid uuid v4
* `data` is the contents of the source app

:::note
For more information about available fields and values you can refer to the [source applications schema](https://raw.githubusercontent.com/snowplow/snowplow-cli/main/internal/validation/schema/source-application.json). Making your ide schema aware via a [language server](https://github.com/redhat-developer/yaml-language-server) should provide a much smoother editing experience.
:::

Now let's customize our source application. We'll configure it to handle events from our production website as well as staging and UAT environments. We'll also add an owner field and remove the unused entities section.

```yml {6-7} title="data-products/source-apps/website.yaml"
apiVersion: v1
resourceType: source-application
resourceName: b8261a25-ee81-4c6a-a94c-7717ba835035
data:
    name: website
    appIds: ["website", "website-stage", "website-ua"]
    owner: me@example.com
```

Before publishing, we can validate our changes and preview what will happen:

```bash
snowplow-cli dp publish --dry-run
```

The command will show us the planned changes:
```
publish will create source apps file=.../data-products/source-apps/website.yaml name=website resource name=b8261a25-ee81-4c6a-a94c-7717ba835035
```

When we're happy with the proposed changes, we can publish by removing the `--dry-run` flag:

```bash
snowplow-cli dp publish
```

After publishing, you'll be able to see your new source application in the Snowplow Console UI.

## Create a data product and an event specification

Let's now create a data product and an event specification by running the following command

```bash
snowplow-cli dp generate --data-product Login
```
This should provide the following output
```
INFO generate wrote kind="data product" file=data-products/login.yaml
```
Let's see what it has created for us

```yml title="data-products/login.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 0edb4b95-3308-40c4-b266-eae2910d5d2a
data:
    name: Login
    sourceApplications: []
    eventSpecifications: []
```

:::note
For more information about available fields and values you can refer to the [data products schema](https://raw.githubusercontent.com/snowplow/snowplow-cli/main/internal/validation/schema/data-product.json). Making your ide schema aware via a [language server](https://github.com/redhat-developer/yaml-language-server) should provide a much smoother editing experience.
:::

Let's amend it to add an event specification, and a reference to a source application:

```yml {6,7,9,11-14} title="data-products/login.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 0edb4b95-3308-40c4-b266-eae2910d5d2a
data:
    name: Login
    owner: me@example.com
    description: Login page
    sourceApplications:
        - $ref: ./source-apps/website.yaml
    eventSpecifications:
        - resourceName: cfb3a227-0482-4ea9-8b0d-f5a569e5d103
          name: Login success
          event:
            source: iglu:com.example/login/jsonschema/1-0-1
```

:::note
You'll need to come up with a valid uuid V4 for the `resourceName` of an event specification. You can do so by using an [online generator](https://www.uuidgenerator.net), or running the `uuidgen` command in your terminal
:::

:::caution Warning

The `iglu:com.example/login/jsonschema/1-0-1` data structure has to be deployed at least to a develop envinroment. Currently referencing local data structures is not supported

:::

We can run the same `publish --dry-run` command as before, to see if the output is as expected. The output should contain the following lines

```bash
snowplow-cli dp publish --dry-run
```

```
INFO publish will create data product file=.../data-products/login.yaml name=Login resource name=0edb4b95-3308-40c4-b266-eae2910d5d2a
INFO publish will update event specifications file=.../data-products/login.yaml name="Login success" resource name=cfb3a227-0482-4ea9-8b0d-f5a569e5d103 in data product=0edb4b95-3308-40c4-b266-eae29
```

We can apply the changes by using the publish command without the `--dry-run` flag

```bash
snowplow-cli dp publish
```

## Add data products validation and publishing in the github actions

Now that we've modeled a source application, data product and event specification, let's see how we can add them to the existing github actions workflows for data structures. You can customize your setup, use a separate repository or a separate actions, but in this example we'll add the data products publishing into the existing workflows.

Lets modify the PR example, and add the following line. This command will validate and print the changes to the github actions log.

```yml {20} title=".github/workflows/validate-pull-request.yml"
on:
  pull_request:
    branches: [develop, main]

jobs:
  validate:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - uses: snowplow/setup-snowplow-cli@v1

      - run: snowplow-cli ds validate --gh-annotate

      - run: snowplow-cli dp publish --dry-run --gh-annotate
```

Data products, source applications and event specifications don't have the dev and prod environments, so it's enough to publish them once.
We can add the same command but without the `--dry-run` flag to the publish pipeline.

```yml {20} title=".github/workflows/publish-develop.yml"
on:
  push:
    branches: [develop]

jobs:
  publish:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - uses: snowplow/setup-snowplow-cli@v1

      - run: snowplow-cli ds publish dev --managed-from $GITHUB_REPOSITORY

      - run: snowplow-cli dp publish
```

You might want to publish data products in the `.github/workflows/publish-production.yml` as well, or only there. It depends on your setup, but if you strictly follow the rules and always merge to `main` from `develop`, the setup above should be enough.
