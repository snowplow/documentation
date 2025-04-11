---
position: 1
title: Getting Started with Snowplow Signals CLI
---

This guide will help you understand how to use the Snowplow Signals SDK CLI tool to manage your dbt projects and generate data models efficiently.

## Prerequisites

Before starting, ensure you have:

- Python 3.11+ installed
- Snowplow Signals SDK installed
- Valid API credentials:
  - API URL
  - API Key
  - API Key ID
  - Organization ID

## What you'll be doing

This tutorial will guide you through:

1. Setting up your environment
2. Testing API connectivity
3. Initializing dbt projects
4. Generating dbt models and assets
5. Running the dbt project and exploring the data
6. Materiallizing the projects to a Batch Source in the feature store.

## Setting Up Environment Variables

For convenience, you can set up your API credentials as environment variables. This allows you to run commands without specifying credentials each time:

```bash
export SNOWPLOW_API_URL="YOUR_API_URL"
export SNOWPLOW_API_KEY="YOUR_API_KEY"
export SNOWPLOW_API_KEY_ID="YOUR_API_KEY_ID"
export SNOWPLOW_ORG_ID="YOUR_ORG_ID"
export SNOWPLOW_REPO_PATH="./my_snowplow_project"
```

Let's get started with testing your connection to the Snowplow Signals services. 