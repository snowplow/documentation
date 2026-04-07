---
title: "Learn how to build a Signals-powered AI agent with AWS Bedrock AgentCore"
sidebar_label: "Introduction"
position: 1
description: "Build a customer-facing AI agent personalized with real-time behavioral data from Snowplow Signals, using Strands Agents and AWS Bedrock AgentCore Memory."
keywords: ["Snowplow Signals", "AWS Bedrock", "AgentCore", "Strands Agents", "personalization", "AI agent", "behavioral data"]
date: "2026-03-27"
---

Customer-facing AI agents are most effective when they understand what a user is doing right now - not just what they type into a chat window. Traditional agents respond generically, forcing users to repeat preferences and explain context that their browsing behavior has already revealed.

This accelerator shows you how to combine [Snowplow Signals](/docs/signals/introduction/) with [AWS Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) to build an AI agent that personalizes responses based on real-time behavioral data and persistent memory. The agent uses the [Strands Agents](https://strandsagents.com/) framework and runs in a Jupyter notebook environment.

The code examples use a travel domain, but the pattern applies to any customer-facing agent - support, shopping, advisory, or content recommendation.

![Example Signals response showing computed behavioral attributes](images/signals-response.png)

By the end of this accelerator you will have:

* An AI agent built with Strands Agents and AWS Bedrock
* Behavioral attributes defined and published via Snowplow Signals
* Persistent customer memory using AgentCore Memory
* An agent that combines behavioral context and memory to deliver personalized responses

The accelerator takes approximately 1 hour to complete. All source code is available in the accompanying [notebook](https://colab.research.google.com/github/snowplow/documentation/blob/aisp-1115/signals-agentic-accelerator/static/notebooks/signals-agentic-accelerator.ipynb).

## Architecture

The accelerator combines three components:

* [Snowplow Signals](/docs/signals/) processes raw [event](/docs/fundamentals/events/) data into behavioral attributes served via the Profiles API. The agent fetches these at runtime to understand what the user is doing right now.
* [AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) provides managed short-term and long-term memory, automatically extracting preferences and facts from conversations so the agent can build context over time.
* [Strands Agents](https://strandsagents.com/) is an open-source Python framework for building AI agents with custom tools and foundation models.

Together, Signals provides real-time behavioral context while AgentCore Memory provides historical context - enabling the agent to personalize responses based on both what the user is doing now and what is known from past interactions.

## Prerequisites

* [Signals Sandbox](https://try-signals.snowplow.io/) account or a Snowplow CDI pipeline with Signals enabled - the agent fetches behavioral attributes from the Signals Profiles API
* An AWS account with [Amazon Bedrock](https://aws.amazon.com/bedrock/) access and AgentCore Memory access - the agent runs on Claude via Bedrock, and your IAM user needs permissions for `bedrock:InvokeModel`, `bedrock-agentcore:*`, and `iam:PassRole` (scoped to `bedrock-agentcore.amazonaws.com`) to create AgentCore Memory resources
* [AWS CLI](https://aws.amazon.com/cli/) installed and configured - used to authenticate with AWS services from the notebook
* Python 3.11 or later - required by the Strands Agents framework
* Familiarity with Python and running Jupyter notebooks

