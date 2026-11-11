---
title: "Set up Snowplow tracking and Signals for the storefront"
sidebar_label: "Set up Snowplow"
position: 2
description: "Connect a BigQuery destination, clone the Atelier Signals storefront, publish its tracking plan and Signals configuration to your Snowplow organization, and check that Signals calculates attributes for a browsing session."
keywords: ["Signals", "tracking plan", "Snowtype", "attribute group", "agentic context", "Snowplow CLI"]
date: "2026-11-09"
---

On this page, you'll set up the Snowplow side of the integration. By the end, the storefront will be tracking events into your pipeline, and Signals will be calculating attributes for each browsing session.

You'll need a Snowplow environment with Signals enabled. If you don't have one, [sign up for a Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial?utm_source=docs.snowplow.io&utm_medium=referral) now. Your trial environment is provisioned automatically after you verify your email address, and it includes everything this page needs: Console, a Collector, and Signals. Once you can sign in to Console, check that Signals is enabled for your organization.

:::tip[Use the setup script]
The repository includes an interactive script, `scripts/setup-trial-org.sh`, that asks for your credentials and runs the commands on this page and the next one for you. This page explains each step, so you know what the script does. If you use the script, read along and skip the commands.
:::

## Connect a BigQuery destination

This step is optional. The personalization works without it, but Snowplow Console doesn't show the event trace for a conversation. To view the events the storefront and agent send, connect a warehouse. This accelerator uses BigQuery: the [analytics page](/tutorials/signals-google-cx-agent-studio/agentic-analytics) queries the agent's events alongside the shopper's browsing events.

In Console, add a BigQuery destination and follow the setup steps it shows. See [load Snowplow data to BigQuery](/docs/destinations/warehouses-lakes/bigquery/) for the Google Cloud project, service account, and permissions you'll need. The setup script doesn't do this step for you.

If you plan to use the analytics page, connect the destination now, so that the events from your testing in the rest of the accelerator load into BigQuery.

## Clone the repository and add your credentials

Clone the repository and install the storefront's dependencies:

```bash
git clone https://github.com/snowplow-industry-solutions/signals-google-cx-agent-studio.git
cd signals-google-cx-agent-studio/storefront
npm install
cp .env.example .env.local
```

All commands from here on run from the `storefront/` directory unless stated otherwise.

Open `.env.local` and add the values from Snowplow Console:

| Variable                             | Where to find it                                                          |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `SNOWPLOW_CONSOLE_API_KEY_ID`        | **Settings** > **Manage organization** > **View and manage API keys**, when you [create a key](/docs/account-management/#create-an-api-key) |
| `SNOWPLOW_CONSOLE_API_KEY`           | Same screen, paired with the key ID                                       |
| `SNOWPLOW_CONSOLE_ORG_ID`            | **Settings** > **Manage organization**                                    |
| `SIGNALS_DEPLOYED_URL`               | **Signals** > **Overview**                                                |
| `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL` | Your pipeline's Collector endpoint                                        |
| `NEXT_PUBLIC_SNOWPLOW_APP_ID`        | Use `atelier-storefront-dev` for local development                        |
| `AGENT_SHARED_SECRET`                | Any value for now; you'll create the production value on the next page   |

When you create the API key, select every feature at its highest permission level. The setup uses data structures and tracking plans permissions to publish the tracking plan, and Signals permissions to publish the Signals configuration. A key without Signals permissions returns `401 Unauthorized` when you publish to Signals. See [connection credentials](/docs/signals/connection/) for more about the Signals credentials.

Leave `NEXT_PUBLIC_CES_DEPLOYMENT_ID` empty. You'll get this value when you create the chat widget deployment in CX Agent Studio.

:::note[Content blockers]
Some content blockers block any request whose path contains `/com.snowplowanalytics.snowplow/`, which is the tracker's default request path. If you see events missing for some browsers, set `NEXT_PUBLIC_SNOWPLOW_POST_PATH` to one of your pipeline's custom tracker request paths. Leave it unset when testing against [Snowplow Micro](/docs/testing/snowplow-micro/), which only accepts the default path.
:::

## Publish the tracking plan

A new Snowplow organization doesn't have the storefront's custom [schemas](/docs/fundamentals/schemas/), and Signals can't calculate attributes from events it doesn't have schemas for. The repository stores the full [tracking plan](/docs/fundamentals/tracking-plans/) as configuration files in `storefront/tracking-assets/`. It includes:

- Ecommerce events under the `com.snowplow_demo.fashion` vendor, such as `product_viewed`, `cart_updated`, and `checkout_started`, plus a `product` entity
- Three entities for the agent events: `conversation`, `catalog_search`, and `context_lookup`
- Event specifications for the storefront and the agent, and two source applications: one for the browser and one for the server-side agent tracking

The agent events themselves, such as `tool_execution` and `user_intent_detected`, use the `com.snowplow.agent.tracking` schemas from Iglu Central, so you don't need to publish them.

Check the tracking plan without changing anything in your organization:

```bash
npm run seed:tracking-plans -- --dry-run
```

Then publish it:

```bash
npm run seed:tracking-plans
```

The script uses the [Snowplow CLI](/docs/api-reference/snowplow-cli/) to publish the data structures to your development environment, then promotes them to production. Signals only accepts schemas that are in production. It then publishes the tracking plan.

The storefront uses [Snowtype](/docs/event-studio/implement-tracking/install-snowtype/) to generate type-safe tracking functions from the tracking plan. The generated code depends on your organization's tracking plan IDs, so it isn't committed to the repository. Generate it now:

```bash
npm run snowtype:generate
```

The storefront won't build until you've run this command, because its source code imports the generated functions.

## Publish the Signals configuration

The Signals configuration lives in Python files under `storefront/signals/config/`, and defines three objects:

- An [attribute group](/docs/signals/attributes/attribute-groups/), `fashion_ecommerce_session_attributes`, with 15 attributes calculated per session from the ecommerce events
- A [service](/docs/signals/applications/services/), `fashion_ecommerce_demo`, that the tool endpoint uses to read the attribute group
- An [agentic context](/docs/signals/agentic-contexts/), `fashion_session_activity`, that keeps up to 100 of the session's product, cart, and checkout events from the last hour

All three use `domain_sessionid` as the [attribute key](/docs/signals/attributes/attribute-keys/), so the agent can read them with only the Snowplow session ID.

These are some of the attributes the agent uses:

| Attribute                     | Calculated from                                    |
| ----------------------------- | -------------------------------------------------- |
| `favorite_designer`           | Most frequent designer across viewed products      |
| `favorite_occasion`           | Most frequent occasion across viewed products      |
| `recently_viewed_product_ids` | Unique list of viewed product IDs                  |
| `high_intent_product_ids`     | Products added to the cart                         |
| `checkout_stage`              | Most recent checkout step reached                  |

The agentic context includes a prompt that tells the agent how to read the activity:

```python title="storefront/signals/config/event_logs.py"
CONCIERGE_PROMPT = (
    "You are interpreting a shopper's live browsing session for a luxury fashion "
    "concierge agent. Each event below happened just now, in order. Summarize the "
    "shopper's taste and intent in plain language: which designers, categories, and "
    "occasions they're drawn to; what they've added to or removed from their cart; "
    "and how far they've progressed through checkout. Refer to the shopper in the "
    "third person, keep it concise, and only state what the events actually show."
)
```

Signals returns this prompt along with the events, so you can change how the agent interprets the activity without editing the agent.

To publish, create a Python virtual environment and install the [Signals Python SDK](/docs/signals/connection/):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

Check the configuration locally, then publish it:

```bash
npm run signals:publish -- --dry-run
npm run signals:publish
```

If the publish fails with a `401` error, your API key doesn't have Signals permissions. A `404` error that mentions a schema means the data structures aren't in production yet, so re-run `npm run seed:tracking-plans`.

## Check that Signals calculates attributes

Start the storefront locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), browse a few products across at least one category, and add one to your cart. The local storefront sends events to your real Collector.

The storefront's debug panel shows your current `domain_sessionid`. You can also read it from the second field of the `_sp_id` cookie.

Query the storefront's attributes endpoint for your session:

```bash
curl "http://localhost:3000/api/signals/attributes?identifier=<your-domain-sessionid>"
```

Within a few seconds of browsing, the response should include attributes that match what you did, such as `favorite_category` and `total_product_views`. If the attributes are empty, check that `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL` and `NEXT_PUBLIC_SNOWPLOW_APP_ID` are set. The storefront disables tracking and logs a message in the browser console if either is missing.

To see everything Signals holds for your session, including the agentic context, run this from the repository root:

```bash
./scripts/get-info-from-signals.sh <your-domain-sessionid>
```
