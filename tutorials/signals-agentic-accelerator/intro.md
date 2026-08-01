---
title: "Learn how to build a Signals-powered AI agent with AWS Bedrock AgentCore"
sidebar_label: "Introduction"
position: 1
description: "Build a customer-facing AI agent personalized with real-time behavioral data from Snowplow Signals, using Strands Agents and AWS Bedrock AgentCore Memory."
keywords: ["Snowplow Signals", "AWS Bedrock", "AgentCore", "Strands Agents", "agentic context", "personalization", "AI agent", "behavioral data"]
date: "2026-07-29"
---

Customer-facing AI agents are most effective when they understand what a user is doing right now - not just what they type into a chat window. Traditional agents respond generically, forcing users to repeat preferences and explain context that their browsing behavior has already revealed.

This accelerator shows you how to combine [Snowplow Signals](/docs/signals/introduction/) with [AWS Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) to build an AI agent that personalizes responses based on real-time behavioral data and persistent memory. The agent uses the [Strands Agents](https://strandsagents.com/) framework and runs in a Jupyter notebook environment.

The code examples use a travel domain, but the pattern applies to any customer-facing agent - support, shopping, advisory, or content recommendation.

![Example Signals response showing computed behavioral attributes](images/signals-response.png)

By the end of this accelerator you will have:

* An AI agent built with Strands Agents and AWS Bedrock
* Profile attributes defined and published via Snowplow Signals
* An agentic context capturing the session's recent activity as an LLM-ready narrative
* Persistent customer memory using AgentCore Memory
* An agent that combines both kinds of behavioral context with memory to deliver personalized responses

The accelerator takes approximately 1 hour to complete. All source code is available in the accompanying [notebook](https://colab.research.google.com/github/snowplow/documentation/blob/main/static/notebooks/signals-agentic-accelerator.ipynb).

## Two kinds of Signals context

The agent draws on two complementary kinds of Signals context, each through its own tool:

* Profile attributes: computed aggregates about the session, such as how many destination pages the user has viewed and which interests they keep filtering for, served by a Signals [service](/docs/signals/applications/services/). Use attributes when you want defined metrics that your agent, or any other consumer, can rely on.
* An [agentic context](/docs/signals/agentic-contexts/): the user's recent activity, returned as an LLM-ready narrative. Use it when you want to ground the agent in the user's immediate journey, without writing aggregation or formatting logic.

They answer different questions, and this accelerator uses both.

## Architecture

The accelerator combines three components:

* [Snowplow Signals](/docs/signals/) processes raw [event](/docs/fundamentals/events/) data into profile attributes served via the Profiles API, and buffers the session's recent events for the agentic context. The agent fetches both at runtime to understand what the user is doing right now.
* [AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) provides managed short-term and long-term memory, automatically extracting preferences and facts from conversations so the agent can build context over time.
* [Strands Agents](https://strandsagents.com/) is an open-source Python framework for building AI agents with custom tools and foundation models.

Together, Signals provides real-time behavioral context while AgentCore Memory provides historical context - enabling the agent to personalize responses based on both what the user is doing now and what is known from past interactions.

## Prerequisites

* A Snowplow account and pipeline with [Signals enabled](/docs/signals/setup/)
* An AWS account with [Amazon Bedrock](https://aws.amazon.com/bedrock/) access and AgentCore Memory access - the agent runs on Claude via Bedrock, and your IAM user needs permissions for `bedrock:InvokeModel`, `bedrock-agentcore:*`, and `iam:PassRole` (scoped to `bedrock-agentcore.amazonaws.com`) to create AgentCore Memory resources
* [AWS CLI](https://aws.amazon.com/cli/) installed and configured - used to authenticate with AWS services from the notebook
* Python 3.11 or later - required by the Strands Agents framework
* Familiarity with Python and running Jupyter notebooks


