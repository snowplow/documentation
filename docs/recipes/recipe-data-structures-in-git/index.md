---
title: "Managing Data Structures in Git"
description: "Learn how to utilize snowplow-cli and github actions to manage authoring and publishing for your data structures"
sidebar_position: 41
---

# Introduction

Snowplow Data Structures are the artifacts defining the rules for event validation within the Snowplow data pipeline. As such, they are a description of event shapes that the pipeline will allow through, and essentially the basis for the shape of data in the warehouse.

The fact that Data Structures formalize what the warehouse tables look like makes them a cornerstone of Snowplow's facilities for data governance. An unintended change in a data structure could result in data consumers down the line being unable to process that data (e.g. data models breaking). That is why larger organizations guard Data Structure definitions closely, and need approval workflows to allow or disallow changes. For instance, a Data Protection Officer may want to have the final say about collected events, to ensure no PII is harvested.

On top of that, detailed change history can be crucial for such large organizations. It is important to be able to tell in fine detail what was changed, when, and by whom.

The Snowplow Console's UI offers excellent facilities to get started quickly with Data Structures (either using the Builder or directly the JSON editor), and is a solid tool for smaller teams; but it doesn't implement such approval processes, neither does it offer such fine-grained visibility around changes.

A common solution when faced with these requirements is to move management to some form of version control platform (github/gitlab). This opens up an entire ecosystem of tools and patterns enabling all manner of custom workflows.

We have built [snowplow-cli](/docs/understanding-tracking-design/managing-your-data-structures/cli/) to help you bridge the gap between these repository based workflows and BDP Console.

## Prerequisites

* A deployed Snowplow BDP pipeline
* [snowplow-cli](/docs/understanding-tracking-design/managing-your-data-structures/cli/#download) downloaded and configured
* A familiarity with [git](https://git-scm.com/) and an understanding of [github actions](https://docs.github.com/en/actions/writing-workflows)
* A sensible [terminal emulator](https://en.wikipedia.org/wiki/Terminal_emulator) and shell


## What you'll be doing

This recipe will walk through creating and deploying a data structure from the command line using [snowplow-cli](https://github.com/snowplow-product/snowplow-cli). It will then show how it is possible to automate the validation and deployment process using [github actions](https://docs.github.com/en/actions/writing-workflows).

## Create a local data structure

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

You'll note that snowplow-cli uses a naming scheme that follows a `vendor/name` pattern and defaults to `yaml` output. This is not a prerequisite for other commands to work, just an opinionated default.

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
* `meta.hidden` directly relates to showing and hiding [in BDP Console UI](/docs/understanding-tracking-design/managing-your-data-structures/ui/#hiding-a-data-structure)
* `meta.schemaType` can be `event` or `entity`
* `meta.customData` is a map of strings to strings that can be used to send across any key/value pairs you'd like to associate with the data structure
* `data` is the actual [snowplow self describing schema](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/) that this data structure describes

## Modify, validate and publish

Firstly we'll add a property to our data structure definition. We'd like to know if a login succeeded or failed. Our modified `login.yaml` should look like this

```yml {16,17} title="data-structures/com.example/login.yaml"
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
  properties:
    result:
      enum: [success, failure]
  additionalProperties: false
```

### Validate

We should validate our changes before we attempt to publish them. Let's do that

```bash
$ snowplow-cli ds validate data-structures/com.example/login.yaml
```
:::tip
You can supply snowplow-cli with a directory and it will look for anything that looks like a data structure. Also given the default data structure directory is being used the previous command is equivalent to `snowplow-cli ds validate`.
:::

You should see output similar to this:
```
3:00PM INFO validating from paths=[data-structures/com.example/login.yaml]
3:00PM INFO will create file=data-structures/com.example/login.yaml vendor=com.example name=login version=1-0-0
3:00PM WARN validation file=data-structures/com.example/login.yaml
  messages=
  │ The schema is missing the "description" property (/properties/result)
  │ The schema is missing the "description" property (/)
```

### Publish to development

Apart from the missing descriptions everything looks good. We can fill them in later™. Let's go ahead and publish our data structure to our [development](/docs/managing-data-quality/testing-and-qa-workflows/) environment.

```bash
$ snowplow-cli ds publish dev
```
:::tip
We omit the directory here but as with other commands the default directory will get used and it will attempt to publish any data structures it can find.
:::


The command should output something close to the following:

```
3:00PM INFO publishing to dev from paths=[data-structures]
3:00PM INFO will create file=data-structures/com.example/login.yaml vendor=com.example name=login version=1-0-0
3:00PM WARN validation file=data-structures/com.example/login.yaml
  messages=
  │ The schema is missing the "description" property (/properties/result)
  │ The schema is missing the "description" property (/)
3:00PM INFO all done!
```

:::note
Publishing to `dev` will also run validation. It will only fail on ERROR notifications.
:::

You should now be able to see your published data structure in [BDP Console UI](https://console.snowplowanalytics.com/data-structures). If you click through from the data structure listing to view the `login` data structure you should see the following banner.

![](./images/locked.png)

Any data structures published using snowplow-cli will automatically get this banner and have UI based editing disabled. It is a good idea to settle on one source of truth for each data structure to avoid potential conflicts.

### Publish to production

With our data structure deployed to develop and working as we expect we can safely publish it to production.

```bash
$ snowplow-cli ds publish prod
```
```
3:00PM INFO publishing to prod from paths=[data-structures]
3:00PM INFO will update file=data-structures/com.example/login.yaml local=1-0-0 remote=""
3:00PM INFO all done!
```
:::note
Data structures must be published to `dev` before they can be published to `prod`
:::

We have now seen how to create, validate and then publish a new data structure from the command line. Next we'll look at how to configure github actions to run validation and publishing automatically for us.


## Automating with github actions

### Set up repository

We'll not go into the details of creating github repositories and initial commits here. The [github docs](https://docs.github.com/) do an excellent job of that already. The next few steps will assume a working github repository containing the directory and data structure we created in the previous section. It will have two branches named `main` and `develop` which should be in sync.

### Publish to develop workflow

We would like pushes to our `develop` branch to be automatically published to our [development](/docs/managing-data-quality/testing-and-qa-workflows/) environment. Github workflows can be [triggered](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow) by all kinds of repository events. The one we are interested in here:
```yml
on:
  push:
    branches: [develop]
```

With our trigger point worked out we need to complete a series of steps:
1. configure snowplow-cli via environment variables provided as [github action secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
2. checkout our repo
3. install snowplow-cli
4. run the `snowplow-cli ds publish dev` command as we did earlier

The full action:

```yml title=".github/workflows/publish-develop.yml"
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

      - run: curl -L -o snowplow-cli https://github.com/snowplow-product/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64 && chmod u+x snowplow-cli

      - run: ./snowplow-cli ds publish dev --managed-from $GITHUB_REPOSITORY
```
:::tip
The value of the `--managed-from` flag will be displayed inside the 'This data structure is locked' banner we saw earlier in the UI. It is designed to help people track down the source of truth for this data structure.
:::

### Publish to production workflow

In the same way we want our `develop` branch to deploy to our `develop` environment we want our `main` branch to deploy to our `production` environment.

As we saw earlier publishing to production is very similar to publishing to development. The only new thing we need here is a different workflow trigger.

```yml title=".github/workflows/publish-production.yml"
on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY}}

    steps:
      - uses: actions/checkout@v4

      - run: curl -L -o snowplow-cli https://github.com/snowplow-product/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64 && chmod u+x snowplow-cli

      - run: ./snowplow-cli ds pub prod --managed-from $GITHUB_REPOSITORY
```

### Validate on pull request workflow

A core component of version control based workflows is the [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). For our repository we would like to ensure as best we can that any data structure changes are valid and problem free before they get merged into develop. Lucky for us there is a github workflow event for that.

By combining the `snowplow-cli ds validate` command and the github workflow pull request event we arrive at this:
```yml title=".github/workflows/validate-pull-request.yml"
on:
  pull_request:
    branches: [develop, main]

jobs:
  publish:
    runs-on: ubuntu-latest
    env:
      SNOWPLOW_CONSOLE_ORG_ID: ${{ secrets.SNOWPLOW_CONSOLE_ORG_ID }}
      SNOWPLOW_CONSOLE_API_KEY_ID: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY_ID }}
      SNOWPLOW_CONSOLE_API_KEY: ${{ secrets.SNOWPLOW_CONSOLE_API_KEY}}

    steps:
      - uses: actions/checkout@v4

      - run: curl -L -o snowplow-cli https://github.com/snowplow-product/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64 && chmod u+x snowplow-cli

      - run: ./snowplow-cli ds validate --gh-annotate
```
:::tip
The `--gh-annotate` flag will make the validate command output [github workflow command](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions) compatible output. We'll see an example of what that looks like in the next section.
:::


### Worked example

Now we have our workflows in place let's work through an example. Our login data structure needs some attention. Our requirements have changed and rather than 'success' and 'failure' the login result will now need to report numbers and not strings. So instead of `[success, failure]` it'll be `[200, 403]`.

Having created a [new branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) called `login-results-error-codes` and making the changes locally we should end up here:
```bash title="git diff develop"
--- a/data-structures/com.example/login.yaml
+++ b/data-structures/com.example/login.yaml
@@ -10,9 +10,9 @@ data:
     vendor: com.example
     name: login
     format: jsonschema
-    version: 1-0-0
+    version: 1-0-1
   type: object
   properties:
     result:
-      enum: [success, failure]
+      enum: [200, 403]
   additionalProperties: false
```

That all looks good so we'll go ahead and push to github and [create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

We wait patiently for our validate on pull request workflow to run and then..

![](./images/worked-pr-checks.png)

Not great. To dig in and find the problem we open the 'file' tab on the pull request and see..

![](./images/worked-diff-annotated.png)
:::note
Validation only takes your configured [destinations](https://console.snowplowanalytics.com/destinations) into account.
:::

Together with the description warnings we forgot to fix earlier we have some errors. Changing the values of the enum would change the type of the `result` property which will cause problems further down the line for our data. The error suggests we need to make a major version bump to avert disaster. We'll do that (and add descriptions).

Our next attempt:
```bash title="git diff develop"
--- a/data-structures/com.example/login.yaml
+++ b/data-structures/com.example/login.yaml
@@ -10,9 +10,11 @@ data:
     vendor: com.example
     name: login
     format: jsonschema
-    version: 1-0-0
+    version: 2-0-0
   type: object
+  description: Login outcome event
   properties:
     result:
-      enum: [success, failure]
+      description: The resulting http error code of a login request
+      enum: [200, 403]
   additionalProperties: false
```

And the workflow result..

![](./images/worked-pr-checks-ok.png)

Excellent. Now our colleagues can feedback on our changes and if everyone is happy we can merge to `develop` which will trigger our `publish-develop.yml` workflow.

![](./images/worked-pub-dev.png)

Finally, once we are convinced everything works we can open another pull request from `develop` to `main`, merge that and trigger our `publish-production.yml` workflow.

## Let's break down what we've done

* We have seen how snowplow-cli can be used to work with data structures from the command line
* We have applied that knowledge to build github workflows which support automated validation and publication

## What you might want to do next

Start to think about how you could integrate snowplow-cli into your own workflows. If you have any ideas or come across any problems then we would love to hear about them, please reach out via discourse.
