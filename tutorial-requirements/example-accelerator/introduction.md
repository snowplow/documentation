---
title: "Introduction"
position: 1
description: "One to two sentences describing the content for marketing and SEO purposes."
keywords: ["keyword1", "keyword2", "keyword3"]
date: "2025-11-05"
---

Welcome to the **example** accelerator.

Solution accelerators provide step-by-step instructions for achieving a specific business outcome using Snowplow, often alongside other third-party tools.

Include 1-3 paragraphs about the goal of the accelerator
* Include links to the relevant docs pages
* Who is this for?
* What will they learn?
* Why would they want to do this?
* Roughly how long will it take to follow the accelerator?

State if a Snowplow account is required, or if they can use Sandbox, Micro, or Local.

## Architecture

Describe the accelerator architecture in this section. Include a diagram that shows all the components, and how they fit into a Snowplow implementation.

The accelerator should provide the simplest possible implementation for the use case:
* Streamlined, opinionated set of steps
* State exactly what products are being used and why
* As lightweight a demo application as possible, with the relevant logic and implementation separated from the main app code
* Avoid requiring users to connect to their production cloud infrastructure or warehouse

Solution accelerators must include a demo app and/or a notebook:
* Link to the GitHub repo for the accompanying demo app
* Link to the Google Colab hosted notebook
* Notebook code must be in GitHub, either in the demo app or the docs repo

All source code must be available.

### Snowplow implementation

If your demo app includes Snowplow tracking or other Snowplow components, add this section:
* Describe how they're implemented
* Say why each Snowplow component is used
* Explain what events are generated
* Link to the appropriate docs pages
* Provide paths to the relevant implementation files

## Prerequisites

Add a bullet point list of requirements:
* Is it for customers only, or can they use Sandbox, Micro, or Local?
* Any specific technical knowledge required? Aim to make the accelerator as accessible as possible for new users.
* Do they need an account for a third-party product?
* Is there a minimum release version required for any of the components?

Where possible, explain very briefly why each prerequisite is required.

Don't list API keys as a prerequisite: include how to get them as one of the accelerator steps.

## Acknowledgements

If the accelerator was built with another company, thank and link to them here.
