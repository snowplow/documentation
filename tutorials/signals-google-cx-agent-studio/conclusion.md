---
title: "Conclusion"
sidebar_label: "Conclusion"
position: 7
description: "Review what you built, create the CX Agent Studio agent with Terraform, and see what to change before using this integration pattern in production."
keywords: ["CX Agent Studio", "Terraform", "google_ces", "Signals", "production", "agentic analytics"]
date: "2026-11-09"
---

In this accelerator, you connected a CX Agent Studio concierge agent to Snowplow Signals using only the integration points the platform provides: OpenAPI tools, the agent's instructions, and session variables. The agent reads each shopper's live session attributes and recent activity before it replies, and falls back to a generic greeting for visitors it has no data for. The agent's tool calls, intents, decisions, and unmet requests are tracked into the same pipeline as the shopper's browsing, joined on `domain_sessionid`.

Only the console configuration is specific to CX Agent Studio. Any agent platform that supports OpenAPI tools and session variables injected into tool requests could use the same tool endpoints, and the endpoints don't need to know which platform is calling them.

## Create the agent with Terraform

You built the agent in the console. The repository's `terraform/` directory can create the same app with the `google_ces_*` resources in the Google Terraform provider, version 7.31.0 or later. A single `terraform apply` creates:

- The app and its three session variables
- The three OpenAPI toolsets and the two widget tools
- The root agent and its instructions
- The first app version and the web widget deployment
- The Secret Manager secret for the shared secret, and the IAM binding that lets the CX Agent Studio service agent read it

Terraform replaces the placeholder URL in the OpenAPI files with your `storefront_url` variable, so you don't need local copies of the files. To create a new app, copy `terraform.tfvars.example` to `terraform.tfvars`, fill in your IDs and storefront URL, and run:

```bash
cd terraform
terraform init
TF_VAR_agent_shared_secret_value=<your-shared-secret> terraform plan
TF_VAR_agent_shared_secret_value=<your-shared-secret> terraform apply
```

You can also adopt an agent you built in the console with `terraform import`. See the [Terraform README](https://github.com/snowplow-industry-solutions/signals-google-cx-agent-studio/blob/main/terraform/README.md) for both paths, and for the known plan differences after an import.

## Prepare for production

The companion repository is a reference integration, and is deliberately simple. Before using this pattern with real shoppers, you'd want to:

- Remove the unauthenticated `/api/signals/attributes` endpoint, which exists only for the storefront's debug panel and returns any session's attributes without authentication
- Replace the single shared secret with a stronger authentication method that CX Agent Studio supports, such as a service agent ID token, and rotate credentials regularly
- Host the tool endpoints separately from the storefront, so you can scale, secure, and deploy them independently
- Review the chat widget's access settings, which use public access with origin verification and no reCAPTCHA
- Decide whether to track message previews, using `NEXT_PUBLIC_WIDGET_MESSAGE_PREVIEWS_ENABLED`, based on your privacy requirements
- Replace the demo catalog endpoint with your own product search

## Next steps

To keep building on this integration:

- Change what the agent knows by adding attributes to the attribute group, or events to the agentic context. See [define attributes](/docs/signals/attributes/) and [define agentic contexts](/docs/signals/agentic-contexts/).
- Run the full agent tracking flow locally against Snowplow Micro, using the "Local Agent Tracking Verification" section of the storefront README
- Use the verification harness in `scripts/verification/` to check a live deployment, from shopper browsing through to agent events in the pipeline

Other Signals and agent tracking accelerators:

- [Build a real-time context-aware agent with Signals, Google ADK, and CopilotKit](/tutorials/signals-google-adk-agent/introduction): the same personalization pattern in a code-first framework
- [Instrument an AI agent with behavioral tracking](/tutorials/agentic-self-tracking/introduction): client-side, server-side, and self-tracking for an agent you build yourself
- [Serve Signals data to your agent with the MCP server](/docs/signals/applications/mcp-server/): read Signals attributes and agentic contexts as MCP tools
- [Implement real-time interventions using Signals](/tutorials/signals-interventions/start)
