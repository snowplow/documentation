---
title: "Introduction"
position: 1
description: "Build personalized travel experiences using Snowplow Signals to customize content and chatbot responses based on real-time user behavior."
keywords: ["Snowplow Signals", "personalization", "real-time", "travel", "chatbot", "attributes"]
date: "2025-01-21"
---

Welcome to the **Build personalized experiences with Signals** tutorial.

This tutorial walks you through building personalized experiences on a travel website using [Snowplow Signals](/docs/signals/). You'll learn how to capture user behavior and define attributes that represent user preferences, and how to use these insights to customize both website content and chatbot responses in real-time.

Personalization has become essential for creating engaging user experiences. Traditional approaches often rely on static user profiles or require manual segmentation. Snowplow Signals enables dynamic personalization by processing behavioral data in real-time and making it immediately available for customization.

This tutorial is designed for developers, engineers, and analysts who want to implement real-time personalization.

In this tutorial, you will:

1. Set up and run an example travel website for exploring Southeast Asian destinations
2. Define behavioral attributes using the Snowplow Signals Python SDK in a Jupyter notebook
3. Connect the website to Snowplow Signals to personalize displayed content based on user behavior
4. Integrate an AI chatbot that provides personalized recommendations using Signals data
5. Implement interventions to control when personalized features appear based on user behavior


## Prerequisites

You will need:
- Signals enabled for your pipeline **or** have set up [Snowplow Local](https://github.com/snowplow-incubator/snowplow-local) and [Signals Sandbox](https://try-signals.snowplow.io/dashboard)
- The [Snowplow Inspector](https://chromewebstore.google.com/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm?hl=en) installed in your browser to view events, attribute groups and interventions
- Some familiarity with running Jupyter notebooks, either locally on your machine or in Google Colab
- [Docker](https://www.docker.com/) installed and configured on your computer
- Access to Google Colab or GitHub to run the Jupyter [notebook](https://colab.research.google.com/github/snowplow/documentation/blob/main/tutorials/signals-bdp/signals.ipynb)

- Optional: an [OpenAI API key](https://platform.openai.com/api-keys) if you wish to customise the agent responses based on Signals
