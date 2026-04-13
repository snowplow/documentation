---
title: "Create the agent prototype with Strands Agents"
sidebar_label: "Create the agent"
position: 2
description: "Build an AI agent prototype using the Strands Agents framework with tools for destination lookup, web search, and Snowplow Signals integration."
keywords: ["Strands Agents", "AI agent", "tools", "AWS Bedrock", "Claude", "prototype"]
date: "2026-03-27"
---

In this step, you'll build a working agent prototype using the [Strands Agents](https://strandsagents.com/) framework. The agent combines a foundation model with custom tools to answer queries, look up information, and fetch behavioral data from Snowplow Signals.

The example implements a travel assistant, but the same pattern - define tools, configure a model, create an agent with a system prompt - applies to any domain.

## Open the Jupyter notebook

Use the Strands Agents framework in a Jupyter notebook to build the agent. You can run the notebook directly using Google Colab [here](https://colab.research.google.com/github/snowplow/documentation/blob/main/static/notebooks/signals-agentic-accelerator.ipynb), or download it locally.

## Define the agent tools

Strands Agents uses the `@tool` decorator to turn Python functions into tools the agent can invoke. Each tool should have a single, well-defined responsibility and return structured output the agent can reason about.

Run the notebook cell that defines four tools for the agent:

| Tool | Purpose |
| :--- | :------ |
| `get_destination_info` | Look up destination details from a local data source |
| `get_experience_info` | Retrieve information about available experiences |
| `web_search` | Search the web for current information via DuckDuckGo |
| `get_signals` | Fetch behavioral attributes from Snowplow Signals |

The `get_signals` tool connects to the Snowplow Signals Profiles API using the credentials you configured in the previous cell. You will define the attributes it retrieves in the next step.

## Configure the foundation model

Run the notebook cell that sets up the foundation model. Make sure you have configured your AWS credentials and region in the credentials cell first. On Google Colab, store your IAM access keys as Colab secrets (key icon in the left sidebar). The notebook loads them automatically. If running locally, ensure your AWS CLI is configured.

```python
model = BedrockModel(
    model_id="us.anthropic.claude-sonnet-4-20250514-v1:0",
    temperature=0.3,
    region_name=AWS_REGION,
)
```

The `temperature` parameter controls how random the model's output is, on a scale from 0 to 1. A value of 0.3 produces more consistent, predictable responses - appropriate for a customer-facing agent where accuracy matters more than creativity.

## Create and configure the agent

Run the notebook cell that combines the model, tools, and a system prompt into a functioning agent. The system prompt defines the agent's role and includes an explicit instruction to use `get_signals` and explain how the returned behavioral data influenced the recommendation. This is key to delivering transparent, personalized responses.

```python
agent = Agent(
    model=model,
    tools=[get_destination_info, get_experience_info, web_search, get_signals],
    system_prompt=SYSTEM_PROMPT,
)
```

## Test the agent

Run the test cell in the notebook to verify the agent works:

```python
response = agent("Tell me about Bangkok as a destination")
```

This query uses the `get_destination_info` tool, which returns data from the local data source. When you call the agent, it follows this execution flow:

1. **Query analysis** - the agent analyzes the user's question
2. **Tool selection** - the agent determines which tools to call
3. **Tool execution** - the agent calls the selected tools with appropriate parameters
4. **Response synthesis** - the agent combines tool results with its knowledge to produce a response

You should see a response like:

```
Tool #1: get_destination_info
Bangkok is a vibrant and exciting destination in Thailand. Here are
some highlights:

- **Best for**: Culture, street food, temples, and nightlife
- **Climate**: Tropical - warm and humid year-round with average
  temperatures of 28-35°C
- **Top experiences**: Grand Palace and Wat Phra Kaew, street food
  tours in Chinatown, Chatuchak Weekend Market, and longtail boat
  rides through the canals

Bangkok is a great base for exploring Southeast Asia, with easy
connections to Thailand's islands and neighboring countries.
```

At this point, the `get_signals` tool will not return data because you have not yet configured Signals attributes. In the next step, you will define and publish behavioral attributes that the agent can use for personalization.
