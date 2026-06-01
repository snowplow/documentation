---
position: 9
title: Install Snowtype to enable code generation from tracking plans
sidebar_label: Install Snowtype
description: "Install and initialize Snowtype CLI to generate tracking APIs from event specifications. Automatically attach event_specification entities and enable event count features without additional implementation work."
keywords: ["snowtype cli installation", "code generation tracking", "event specification api", "console api key setup"]
---

After defining your Event Specifications, the next step is implementing those events on your app. To do that you are going to use Snowtype to generate the required APIs for tracking the Event Specifications.

:::info
For some Event Specification features, such as event counts, it is required that events are tracked together with the `event_specification` entity. Snowtype automatically attaches the entity without any additional work required from the implementation engineers.
:::

## Installing Snowtype

After having set up a [Console API key](/docs/event-studio/implement-tracking/install-snowtype/#authenticate) you can install Snowtype on this project by switching to the project root directory and running `npm install @snowplow/snowtype@latest --save-dev`.

Since this is a project without previous Snowtype installation, we need to go through the [init flow](/docs/event-studio/implement-tracking/install-snowtype/#initialize-your-project).

To do that, you can go to the tracking plan page and click on the `Implement tracking` button. There you can copy the second code command which relates to initializing a new Snowtype project.

!["Implement tracking" modal showing the Generate code tab with the npx snowtype patch command for updating and the npx snowtype init command for first-time setup, with a green arrow highlighting the init command's Copy button](./images/sntp-init.png)

The inputs should look like the following:

![Terminal output from running the Snowtype init command, showing interactive prompts answered with Browser Tracker, TypeScript, JSON format, and ./src/tracking as the output directory, ending with "Configuration created"](./images/sntp-init-inputs.png)

Next you add this tracking plan to the Snowtype project by copying the first code command.

!["Implement tracking" modal with a green arrow highlighting the Copy button for the npx snowtype patch command used to add the tracking plan to the Snowtype project](./images/sntp-patch.png)

Now your Snowtype configuration file should include the tracking plan in the `dataProductIds` array.
