---
title: Introduction
position: 1
---

Snowplow data structures are the artifacts defining the rules for event validation within the Snowplow data pipeline. As such, they are a description of event shapes that the pipeline will allow through, and essentially the basis for the shape of data in the warehouse.

The fact that data structures formalize what the warehouse tables look like makes them a cornerstone of Snowplow's facilities for data governance. An unintended change in a data structure could result in data consumers down the line being unable to process that data (e.g. data models breaking). That is why larger organizations guard Data Structure definitions closely, and need approval workflows to allow or disallow changes. For instance, a Data Protection Officer may want to have the final say about collected events, to ensure no PII is harvested.

On top of that, detailed change history can be crucial for such large organizations. It is important to be able to tell in fine detail what was changed, when, and by whom.

The Snowplow Console's UI has facilities to get started quickly with data structures (either using the Builder or the direct JSON editor), and is a solid tool for smaller teams. It doesn't implement such approval processes, neither does it offer such fine-grained visibility around changes.

A common solution when faced with these requirements is to move management to some form of version control platform (github/gitlab). This opens up an entire ecosystem of tools and patterns enabling all manner of custom workflows.

We have built [Snowplow CLI](https://docs.snowplow.io/docs/data-product-studio/snowplow-cli) to help you bridge the gap between these repository-based workflows and Snowplow Console.

## Prerequisites

* A deployed Snowplow pipeline
* [Snowplow CLI](https://docs.snowplow.io/docs/data-product-studio/snowplow-cli) installed and configured
* A familiarity with [git](https://git-scm.com/) and an understanding of [GitHub Actions](https://docs.github.com/en/actions/writing-workflows)
* A sensible [terminal emulator](https://en.wikipedia.org/wiki/Terminal_emulator) and shell

## What you'll be doing

This tutorial will walk through creating and deploying a data structure from the command line using [Snowplow CLI](https://docs.snowplow.io/docs/data-product-studio/snowplow-cli). It will then show how it is possible to automate the validation and deployment process using [GitHub Actions](https://docs.github.com/en/actions/writing-workflows).
