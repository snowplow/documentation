---
position: 1
title: Getting Started with Signals Batch Engine
---

Welcome to the Signals Batch Engine guide! This tool helps you generate and manage dbt projects for batch processing of your Snowplow Signals attributes.

## What is Snowplow Signals?

Snowplow Signals is a feature store that helps you manage and serve machine learning features at scale. In the Profiles API, you can have different types of attribute views:

- **Batch Views**: processed offline, perfect for historical data and complex aggregations
- **Stream Views**: processed in real-time, ideal for immediate feature updates

This CLI tool specifically helps you work with batch views by:

- Generating separate dbt projects for each batch view
- Testing and validating your data pipelines
- Materializing features for production use

## Prerequisites

Before starting, ensure you have:

- Python 3.11+ installed
- Snowplow Signals SDK installed
- Valid API credentials from your Snowplow Signals account:
  - API URL
  - API Key
  - API Key ID
  - Organization ID
- Have BatchView/ExternalBatchView(s) already created


## Installation

To install the Signals Batch Engine CLI tool, run the following command:

```bash
pip install 'snowplow-signals[batch-engine]'
```

This will install the CLI tool along with all necessary dependencies for working with batch views.

> **Important**: Make sure you're in the correct Python environment (virtual environment, Poetry, etc.) where you want to install the CLI tool. The CLI commands will only work in the environment where the package is installed.

## What you'll learn

This tutorial will guide you through the complete process of working with batch views in Snowplow Signals:

1. Setting up your environment
2. Testing your connection to Snowplow Signals services
3. Creating projects for your batch views (either all views or a specific one)
4. Generating data models automatically
5. Running and testing your models
6. Materializing your models to the feature store

## Setting Up Environment Variables

To make your workflow smoother, you can set up your API credentials as environment variables. This way, you won't need to type them in every command:

```bash
export SNOWPLOW_API_URL="YOUR_API_URL"
export SNOWPLOW_API_KEY="YOUR_API_KEY"
export SNOWPLOW_API_KEY_ID="YOUR_API_KEY_ID"
export SNOWPLOW_ORG_ID="YOUR_ORG_ID"
export SNOWPLOW_REPO_PATH="./my_snowplow_repo"
```

Ready to begin? Let's start by testing your connection to the Snowplow Signals services. 
