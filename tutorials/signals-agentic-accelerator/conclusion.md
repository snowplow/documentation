---
title: "Conclusion and next steps"
sidebar_label: "Conclusion"
position: 7
description: "Summary of the Signals-powered AI agent accelerator, cleanup instructions, and next steps for production deployment."
keywords: ["conclusion", "cleanup", "next steps", "AgentCore", "Signals", "agentic context", "production"]
date: "2026-07-31"
---

You've built an AI agent that combines real-time behavioral data from Snowplow Signals with persistent memory from AWS Bedrock AgentCore Memory. The agent can:

* Answer queries using custom tools (destination lookup, experience info, web search)
* Fetch profile attributes from Signals to understand the session in aggregate
* Fetch an agentic context from Signals to see what the user has just been doing, event by event
* Retrieve and store customer context across conversations using AgentCore Memory
* Deliver personalized responses that reflect both browsing behavior and historical preferences

This pattern - tools plus behavioral context plus persistent memory - is useful in any customer-facing agent, from support bots to shopping assistants to content recommenders.

If you connected the [SEA Explorer demo app](/tutorials/signals-agentic-accelerator/connect-demo-app), you also have a working frontend that calls Bedrock with Signals and Memory integration, demonstrating the full end-to-end flow.

## Clean up

Delete the AgentCore Memory resources created during this accelerator to avoid ongoing costs.

```python
from bedrock_agentcore.memory import MemoryClient
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

memory_client = MemoryClient(region_name=region)
memory_client.gmcp_client.delete_memory(memoryId=memory_id)
print(f"Deleted memory resource: {memory_id}")
```

If you published a Signals service and attribute group, run the optional cleanup cell at the end of the notebook to remove them. Unpublish and delete the service first, then the attribute group it uses.

```python
sp_signals.unpublish([travel_service])
sp_signals.delete([travel_service])

sp_signals.unpublish([session_attributes_group])
sp_signals.delete([session_attributes_group])
```

Unpublish and delete the agentic context in Console, under **Signals** > **Agentic contexts**. See [deleting an agentic context](/docs/signals/agentic-contexts/#deleting-an-agentic-context).

## Next steps

* **Deploy to production**: Use [AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime.html) to deploy your agent as a scalable, serverless endpoint with built-in observability. Use [AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html) to expose your tools as shared MCP endpoints with JWT authentication.
* **Add more Signals attributes**: Define additional [profile attributes](/docs/signals/introduction/) based on your application's event data - for example, purchase history, content engagement patterns, or feature usage.
* **Capture more activity**: Extend the [agentic context](/docs/signals/agentic-contexts/) with the other events your site tracks, such as searches or itinerary changes, so the narrative covers more of the user's journey.
* **Explore accelerators**: The [Build a personalized travel agent with Signals](/tutorials/signals-personalize-travel/intro) accelerator covers a simpler implementation using OpenAI and Signals without persistent memory. The [AI agent with real-time user context](/tutorials/signals-ai-agent-context/introduction) tutorial builds the same two-source pattern in Next.js with the Vercel AI SDK.
* **Learn more about Signals**: Read the [Signals documentation](/docs/signals/introduction/) for advanced attribute definitions and CDI integration.
* **Learn more about AgentCore**: Explore the [AgentCore developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/index.html) and [code samples](https://github.com/awslabs/amazon-bedrock-agentcore-samples).
