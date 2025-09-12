---
position: 9
title: Install Snowtype
description: "Use Snowtype for type-safe behavioral event tracking code generation in data products workflow."
schema: "HowTo"
keywords: ["Snowtype Tutorial", "TypeScript Types", "Type Generation", "Type Safety", "Code Generation", "TypeScript Tutorial"]
---

After defining your Event Specifications, the next step is implementing those events on your app. To do that you are going to use Snowtype to generate the required APIs for tracking the Event Specifications.

:::info
For some Event Specification features, such as event counts, it is required that events are tracked together with the `event_specification` context. Snowtype automatically attaches the context without any additional work required from the implementation engineers.
:::

### Installing Snowtype

After having setup a [Console API key](https://docs.snowplow.io/docs/collecting-data/code-generation/using-the-cli/#authenticating-with-the-console) you can install Snowtype on this project by switching to the project root directory and running `npm install @snowplow/snowtype --save-dev`.

Since this is a project without previous Snowtype installation, we need to go through the [init flow](https://docs.snowplow.io/docs/collecting-data/code-generation/using-the-cli/#initializing-snowtype-for-your-project).

To do that, you can go to the Data Product page and click on the `Implement tracking` button. There you can copy the second code command which relates to initializing a new Snowtype project.

![](./images/sntp-init.png)

The inputs should look like the following:

![](./images/sntp-init-inputs.png)

Next you add this Data Product to the Snowtype project by copying the first code command.

![](./images/sntp-patch.png)

Now your Snowtype configuration file should include the Data Product in the `dataProductIds` array.