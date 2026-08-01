---
title: "Add persistent customer context with AgentCore Memory"
sidebar_label: "Add agent memory"
position: 5
description: "Integrate AWS Bedrock AgentCore Memory to give your AI agent persistent context across conversations using preference and semantic memory strategies."
keywords: ["AgentCore Memory", "persistent memory", "personalization", "hooks", "Strands Agents", "long-term memory", "agentic context"]
date: "2026-07-31"
---

Without persistent memory, every conversation with an AI agent starts from zero. Users must repeat their preferences, explain their history, and re-establish context each time.

[AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) solves this by providing managed short-term and long-term memory for agents. In this step, you'll create a memory resource, seed it with sample customer history, and integrate it into your agent using hooks that automatically retrieve and store context.

## Create AgentCore Memory resources

Run the notebook cell that creates a memory resource with two strategies:

| Strategy | Purpose | Namespace |
| :------- | :------ | :-------- |
| `USER_PREFERENCE` | Learns customer preferences and behavioral patterns | `travel/customer/{actorId}/preferences` |
| `SEMANTIC` | Captures factual information and conversation context | `travel/customer/{actorId}/semantic` |

The `{actorId}` placeholder in the namespace will be replaced at runtime with the customer identifier, ensuring each customer's memories are isolated.

```python
response = memory_client.create_memory_and_wait(
    name="TravelAgentMemory",
    description="Travel agent memory",
    strategies=strategies,
    event_expiry_days=90,
)
```

Memory resource creation takes a couple of minutes, so wait for the confirmation message before proceeding.

## Seed customer history

Run the notebook cell that loads sample previous interactions. This simulates a returning customer who has expressed preferences for warm, adventurous, family-friendly destinations:

```python
previous_interactions = [
    ("I'd love to go and visit somewhere warm.", "USER"),
    ("I can help with that! For warm destinations, I'd recommend Bali, "
     "Thailand, or the Philippines.", "ASSISTANT"),
    ("I'm looking for experiences that are a little bit more adventurous", "USER"),
    ("Great - extreme sports or something a little bit more down to earth?", "ASSISTANT"),
    ("Something a little tamer than extreme sports please! Ideally something "
     "that is fun but I can also do with the family.", "USER"),
]

CUSTOMER_ID = "customer_001"

memory_client.create_event(
    memory_id=memory_id,
    actor_id=CUSTOMER_ID,
    session_id="previous_session",
    messages=previous_interactions,
)
```

AgentCore Memory automatically processes these interactions into long-term memories. The `USER_PREFERENCE` strategy extracts preferences while the `SEMANTIC` strategy stores factual context.

## Integrate memory hooks

Run the notebook cell that defines the `TravelAgentMemoryHooks` class. This uses the Strands Agents [hook system](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/hooks/) to automatically retrieve and store memory around each agent interaction:

* `retrieve_customer_context` - fires when a new user message arrives, retrieves relevant memories from both namespaces, and injects them into the message as context
* `save_travel_interaction` - fires after the agent responds, saves the interaction to memory for future retrieval

The `retrieve_memories` call uses semantic search - it finds memories relevant to the current query, not just the most recent ones. This means if a user asks about beach destinations, the agent retrieves memories about their beach preferences even if those were mentioned weeks ago.

## Test personalized responses

Run the notebook cells that rebuild the agent with memory hooks and test it. The agent now has three sources of context to draw on: memory, profile attributes, and session activity.

```python
agent_with_memory = Agent(
    model=model,
    hooks=[memory_hooks],
    tools=[get_destination_info, get_experience_info, web_search, get_signals,
           get_session_activity],
    system_prompt=SYSTEM_PROMPT,
)
```

Test with queries that should trigger memory retrieval:

```python
response = agent_with_memory("Can you recommend some destinations for me?")
```

Because you seeded `customer_001` with preferences for warm, adventurous, family-friendly destinations, the agent should incorporate this context into its recommendations without the user needing to restate those preferences. For example:

```
Based on your previous conversations, I know you're looking for warm,
family-friendly destinations with a touch of adventure. Here are some
recommendations:

1. **Bali, Indonesia** - Great for families with options like white water
   rafting, cycling through rice terraces, and snorkeling. The warm climate
   and welcoming culture make it ideal for all ages.

2. **Costa Rica** - Perfect for adventure-loving families with zip-lining,
   wildlife tours, and volcanic hot springs, all in a warm tropical setting.

3. **Thailand** - Combines family-friendly beaches in Krabi with activities
   like elephant sanctuaries and kayaking through mangroves.

Would you like more details on any of these destinations?
```

To test the profile attributes, ask the agent a question that triggers the `get_signals` tool:

```python
response = agent_with_memory(
    "Based on my browsing behavior, what experiences would suit me?"
)
```

You should see a response like:

```
Tool #1: get_signals

Based on your browsing activity, I can see you've been exploring
several destinations with a focus on family-friendly and cultural
experiences. Here are some experiences that match your interests:

1. **Bali Rice Terrace Cycling Tour** - A gentle family cycling route
   through Ubud's rice terraces, combining culture and light adventure.

2. **Chiang Mai Cooking Class** - A hands-on Thai cooking experience
   that's great for families and fits your interest in cultural
   activities.

3. **Krabi Island Hopping** - A boat tour visiting multiple islands
   with snorkeling stops, suitable for all ages and matching your
   preference for warm, coastal destinations.

These recommendations are based on your browsing patterns showing
strong interest in cultural and family-friendly content.
```

Then ask something that depends on the order of what the user did, rather than on totals. This is what the `get_session_activity` tool is for:

```python
response = agent_with_memory(
    "What was I just looking at, and what should I do there?"
)
```

The tool hands the agent the same narrative you printed when you validated the agentic context, so the agent can name the destination pages the user opened most recently and the filters they applied, instead of reasoning from counters alone.

In a production deployment, the agent calls both Signals tools automatically based on the system prompt instructions - users would not need to explicitly ask about their browsing behavior. The session ID would come from the application context rather than being hardcoded, so the agent personalizes every response using real-time behavioral data alongside stored memory.
