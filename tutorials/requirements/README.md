
# Snowplow tutorials and accelerators

This file contains guidelines for writing Snowplow tutorials and accelerators.

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
  * Could it be used by both Snowplow customers and prospects?
* Is this the simplest possible implementation that supports the outcome?
  * One happy path, with minimal options or decisions
* Could someone inexperienced achieve the title outcome?

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

Notebook:
* Link to the accelerator in the introduction
* Has the same structure and headings as the accelerator pages

The demo application or notebook should be supporting materials for the accelerator, not standalone projects with full instructions. Think single source of truth. There are several downsides to having information duplicated or spread across multiple locations:
* It's harder to maintain
* Potentially confusing for users
* Reduces our ability to measure the accelerator's value

## How to fill out the metadata file

Each tutorial or accelerator requires metadata in a `meta.json` file.

### Title and description

The `title` and `description` explain what the user will achieve by following the instructions.

Formatting:
* Sentence case - no capitalization except for the first word and any product names
* Imperative form - it should sound right if you imagine putting "how to" in front
* Starts with a verb
* One sentence for the description

### Label and use case

The `label` and `useCase` categories help users find the right tutorial or accelerator, support our marketing messaging, and clarify the goal of each one. They are enums; there's a short list of choices for each.

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
