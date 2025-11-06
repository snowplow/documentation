
# Snowplow tutorials and solution accelerators

This file describes the requirements for Snowplow tutorials and accelerators.

Tutorials and accelerators are step-by-step how-to guides. Users follow the steps to:
* Learn how to achieve a goal
* Gain a better understanding of Snowplow

Check out the example tutorial and accelerator files in this folder to see how to structure them, and what to include on each page.

## Is it a tutorial or accelerator?

This table explains the differences between tutorials and solution accelerators:

| Feature                       | Tutorial                        | Solution accelerator         |
| ----------------------------- | ------------------------------- | ---------------------------- |
| Provides a walkthrough for    | Standard Snowplow functionality | A specific business use case |
| Includes third-party products | No                              | Often                        |
| Uses a demo application       | No                              | Yes                          |
| Uses a notebook               | Sometimes                       | Sometimes                    |

Whether it's a tutorial or accelerator affects what information you need to include, and what label you can assign in the metadata.

## What to think about when writing a tutorial or accelerator

Here are some things to consider:
* Who is this for?
  * Could you provide instructions for both Snowplow customers and prospects?
* **Is this the simplest possible implementation**?
  * One happy path, with minimal options or decisions

The usual Snowplow [style guide](https://docs.snowplow.io/style-guide/) rules apply. All headings are in sentence case.

Write in the second person, for example "you'll create", not "let's create" or "we'll create".

## Incorporating demo apps and notebooks

Solution accelerators showcase how to use Snowplow to achieve a certain business outcome. This usually requires a supporting demo application or notebook.

All source code must be available on GitHub, and linked to in the accelerator.

Demo application:
* Link to the accelerator in the README
* As simple and lightweight as possible
* If it has additional dependencies, consider Dockerizing the app
* Instructions for running the app are in the accelerator, not in the README

There's an example README at `./example-app-README.md`.

Notebook:
* Link to the accelerator in the introduction
* Has the same structure and headings as the accelerator pages

The demo application or notebook should be supporting materials for the accelerator, not standalone projects with full instructions. Think single source of truth. There are several downsides to having information duplicated or spread across multiple locations:
* It's harder to maintain
* Potentially confusing for users
* Reduces our ability to measure the accelerator's value

If your demo application includes Snowplow functionality, describe it fully in the accelerator introduction. This supports our goal of helping users to understand how to get value from Snowplow.

## How to fill out the metadata file

Each tutorial or accelerator requires metadata in a `meta.json` file. Look at the `example-accelerator` or `example-tutorial` folders for full examples.

### Title and description

The `title` and `description` explain what the user will achieve by following the instructions.

Formatting:
* Sentence case - no capitalization except for the first word and any product names
* Imperative form - it should sound right if you imagine putting "how to" in front
* Starts with a verb
* One sentence for the description

### Label and use case

The `label` and `useCase` categories help users find the right tutorial or accelerator, support our marketing messaging, and clarify the goal of each one. They're enums; there's a short list of choices for each.

The use case options are:
  * `Composable analytics`
  * `Composable CDP`
  * `Real-time personalization`
  * `Customer-aware AI`

For labels, the options are:
  * `Solution accelerator` - all solution accelerators get this label
  * `Data governance`
  * `Data modeling`
  * `Signals implementation`
  * `Tracking implementation`

### Technology

The `technologies` and `snowplowTech` properties allow users to filter for specific products. You can add multiple items for each.

The `technologies` list is for non-Snowplow tools. It's most relevant for accelerators. Include any third-party products from your accelerator that a user might want to search by.

Use the `snowplowTech` list for key Snowplow products used.

## Understanding the page metadata

Every full markdown file in the documentation repo has a block of metadata at the top.

Here's an example metadata block for a tutorial or accelerator page:

```yaml
---
title: "Introduction"
position: 1
description: "One to two sentences describing the content."
keywords: ["keyword1", "keyword2", "keyword3"]
date: "2025-09-09"    # The date the file was created
---
```

The `title` unsurprisingly becomes the page title. The `position` can be any number, and is used to order the pages relative to each other.

The `description`, `keywords`, and `date` improve SEO. This is important for UX and marketing:
* Increases discoverability within the docs
* Increases external search rankings
* Helps AIs scrape the pages

## How to review a tutorial or accelerator

Before publishing, tutorials and accelerators are reviewed across three aspects:
1. Technical review: do the steps work?
2. UX review: does the workflow make sense?
3. Brand review: does it align with our existing content and objectives?

To review a tutorial or accelerator, put yourself in character as someone with minimal prior knowledge of Snowplow. Follow all the steps exactly as written. Here are some questions to consider.

The **technical** review is the simplest:
* Do the code examples run without errors?
* Does the demo app build and run?
* Is all the source code accessible?

The **UX** review focuses on providing value to the user:
* Are the steps comprehensive and easy to follow?
* Did you understand why each step was required, and what the outcome was?
* Are you satisfied that you learned what was promised in the introduction?
* Is the prerequisites list correct?
* Is it possible to complete the accelerator within one day?

Finally, the **brand** review:
* Does the topic support our strategic marketing objectives?
* Is the content differentiated from existing tutorials or accelerators?
* Does the structure match the framework shown in the example files?
* Is the content consistent with our brand voice and editorial style guidelines?
