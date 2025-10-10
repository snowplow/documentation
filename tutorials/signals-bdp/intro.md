---
title: Introduction
position: 1
---

This accelerator walks you through how to set up Snowplow Signals with a Snowplow pipeline, create some test stream attributes and use them to personalize an example travel site provided to you.

It assumes you already have either 
1. a BDP pipeline with Signals setup already OR
2. Have signed up for a trial of the Signals through [Try Signals](https://try-signals.snowplow.io) and are using [Snowplow Local](https://docs.snowplowanalytics.com/docs/installation-guides/snowplow-local/) as your local pipeline.

This will help provide an introduction to not just the basic concepts of Signals but also how you can retrieve and work with this data to provide on-site personalisation by changing both the content displayed as well as the responses an agent provides to the user.

This accelerator is best positioned for developers, engineers and analysts who have basic familiarity with Python. To run the demo website it is expected you have some familiarity with Docker.

In this accelerator you will:
1. Spin up an example travel website for exploring South East Asia
2. Define some Signals using the Signals Python SDK in a Jupyter notebook
3. Connect the website to Snowplow Signals and personalize the displayed content
4. Connect a conversational agent using a third party service to the Signals data to provide personalized chat responses to the user


### Prerequisites

- have Signals enabled for your BDP pipeline OR have Snowplow Local setup and Signals Sandbox
- have the [Snowplow Inspector](https://chromewebstore.google.com/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm?hl=en) installed in your browser to view events, [Attribute groups](https://docs.snowplow.io/docs/signals/concepts/#attribute-groups) and [Interventions](https://docs.snowplow.io/docs/signals/concepts/#interventions)
- some familiarity with running Jupyter notebooks (either locally on your machine or in Google Colab)
- have [Docker](https://www.docker.com/) installed and configured on your computer
- Access to Google Colab or Github to run the Jupyter [notebook](https://colab.research.google.com/github/snowplow/documentation/blob/main/tutorials/signals-bdp/signals.ipynb)

- [Optional] An [OpenAI API key](https://platform.openai.com/api-keys) if you wish to customise the agent responses based on Signals