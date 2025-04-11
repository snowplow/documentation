---
position: 3
title: Initializing a Project
---

Now that we've verified our connection, let's create a new dbt project:

```bash
snowplow-batch-autogen init \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --repo-path "./my_snowplow_project" \
  --verbose
```

With environment variables set:

```bash
snowplow-batch-autogen init --verbose
```

## What This Command Does

This command will:

- Set up base configuration files
- Initialize necessary directories
- Set up the basic project scaffolding

## Expected Output

When successful, you should see:

```
Initializing dbt project(s) in ./my_snowplow_project
✅ Successfully initialized dbt project(s)
```

## Project Structure

The initialization will create the following structure:

```
{attribute_view_name}/
└── configs/
    └── base_config.json
```

## Advanced Initialization Options

### Initializing Specific Views

You can initialize a specific attribute view:

```bash
snowplow-batch-autogen init \
  --view-name "user_attributes" \
  --view-version 1 \
  --verbose
```

## Troubleshooting

If you encounter issues:

1. Check repository path permissions
2. Check if you request existing batch view

Once your project is initialized, you're ready to generate your dbt models.
