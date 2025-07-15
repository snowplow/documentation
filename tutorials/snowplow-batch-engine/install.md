---
position: 1.5
title: Install the CLI
---

To install the Signals Batch Engine CLI tool, run the following command:

```bash
pip install 'snowplow-signals[batch-engine]'
```

This will install the CLI tool along with all necessary dependencies for working with batch views.

**Important**: Make sure you're in the correct Python environment (virtual environment, Poetry, etc.) where you want to install the CLI tool. The CLI commands will only work in the environment where the package is installed.

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
