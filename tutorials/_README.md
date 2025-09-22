
# Snowplow tutorials and accelerators

This file contains guidelines for writing Snowplow tutorials and accelerators.

## Writing style

Best practise for writing the text:
* The usual Snowplow [style guide](https://docs.snowplow.io/style-guide/) rules apply
  * All headings should be in sentence case
  * No exclamation marks, no emojis
* Keep the tutorial streamlined and opinionated
  * One happy path without too many options or decisions
  * It's good to include some troubleshooting help too where necessary
* Write in the second person
  * It's clearer about what's going on
  * "You'll create" not "let's create" or "we'll create"
  * "This tutorial uses X library" not "We'll be using X library"
* Although a tutorial may be designed for a specific persona, they are part of our technical marketing collateral
  * It's good for tutorials to be understandable to broader audiences
  * Explain even "obvious" things

## Tutorial structure

Tutorials have the following structure:

```text
Introduction
	Architecture <-- optional
	Prerequisites
	Acknowledgements <-- for external contributions
Install X
Do some stuff
Deploy the thing
Conclusion
	Next steps
```

### Introduction

The first page of the tutorial:
* It should have `title: "Introduction"`
* Start with a sentence like "Welcome to the XYZ tutorial."
* Explain in the opening paragraphs:
  * What the focus of the tutorial is
  * What's the business use case or value
  * Who the tutorial is for
  * What they'll be doing
* Include:
  * Links to the relevant docs
  * Links to the relevant other repo(s)
  * A diagram if possible
  * A **Prerequisites** heading
  * An optional **Acknowledgements** heading, for tutorials written by external collaborators
* Prerequisites:
  * Usually a bullet point list
  * These can be anything from permissions to knowledge to codebases
  * Add links for third-party tool websites
  * Add links to instructions for getting credentials if necessary
* Add an optional **Architecture** heading if the tutorial is complicated
  * This section needs a diagram
* Don't include:
  * Explanations of Snowplow concepts that are already explained in the docs
  * Code blocks
  * Actions or instructions for them to follow as part of the tutorial

### Main pages

The tutorial content pages:
* Should be titled in imperative case
  * E.g. "Install the SDK", "Generate models"
  * It should sound right if you imagine putting "how to" in front of each
* The first page after the introduction would normally be "Install the X" or "Set up Y"
* Each page should start with at least one paragraph about the goal of this section, or what the steps will do
* Subheadings are good to break up different sections on the page
  * Each subsection needs at least a sentence introducing the next steps, and maybe why the steps are required
  * Avoid numbering the headings - the order of operations is the order in which they appear on the page
* Be explicit about where in their project or machine the code should be added or run
* Use screenshots liberally
* Show the expected outcome of the steps

### Conclusion

The last page of the tutorial:
* It should have `title: "Conclusion"`
* Summarise what they've learned or achieved, especially in the context of business value
* End with a **Next steps** subsection

## Notebooks

For tutorials that incorporate a Jupyter notebook:
* Link to the notebook in the Introduction and the install/set up page
* The tutorial and notebook should have the same structure and code examples
* Add a link in the notebook to the tutorial
* The notebook should have minimal text and explanation
  * Maximum one or two sentences per subheading
  * It shouldn't be a complete, standalone project
  * Think single source of truth

## Resource repos

For tutorials that are based around a demo project in another repo:
* Link to the repo in the Introduction and the install/set up page
* Add a link in the README to the tutorial
* The repo README should have minimal text and explanation
  * Information about running the project should all be in the tutorial
  * Think single source of truth

## File structure

Tutorials have:
* Their own directory inside the documentation codebase, in `tutorials/`
* A metadata file, `meta.json`, defining what will show on the card on the Tutorials landing page
  * For titles and description:
    * Be concise
    * Use imperative form - it should sound right if you imagine putting "how to" in front of each
  * There's a short list of **labels** to choose from, pick one:
    * `Data governance`
    * `Data modeling`
    * `Signals implementation`
    * `Solution accelerator`
    * `Tracking implementation`
  * There's a short list of **use cases** to choose from, pick one:
    * `Composable analytics`
    * `Composable CDP`
    * `Real-time personalization`
    * `Customer-aware AI`
  * Solution accelerators are a specific thing, they are:
    * Focused on business use cases
    * End-to-end solutions
* Images in a subfolder called `images`
* Separate pages as separate `.md` files
  * The file name will be the URL
  * The title will be the page main heading
  * Specify what order the pages appear in by defining the page `position` (doesn't have to be integers)

Example metadata:
```json
{
  "title": "Manage data structures with Git",
  "label": "Data governance",
  "description": "Use Snowplow CLI and GitHub Actions to manage authoring and publishing for your data structures.",
  "useCases": ["Composable analytics"],
  "technologies": [],
  "snowplowTech": ["Snowplow CLI"]
}
```

Example page frontmatter:
```markdown
---
title: "Introduction"                           # Page title (sentence case)
position: 1
description: "One to two sentences describing the content for marketing purposes."
keywords: ["keyword1", "keyword2", "keyword3"]  # Marketing keywords
date: "2025-09-09"                              # File creation date (YYYY-MM-DD)
---

Welcome to the **doing a cool thing with Snowplow** tutorial.

etc
```
