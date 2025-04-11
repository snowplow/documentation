---
position: 4
title: Generating Models
---

Now that your project is initialized, let's generate the dbt models:

```bash
snowplow-batch-autogen generate \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --repo-path "./my_snowplow_project" \
  --verbose
```

With environment variables set:

```bash
snowplow-batch-autogen generate --verbose
```

## What This Command Does

This command will:

- Set up dbt configuration files
- Generate data models based on your schema
- Create necessary macros
- Update existing files if needed

## Expected Output

When successful, you should see:

```
🛠️ Generating dbt models in ./my_snowplow_project
✅ Successfully generated dbt models
```

And the file structure would be:

```
{attribute_view_name}/
├── dbt_project.yml
├── packages.yml
├── models/
│   ├── base/
│   ├── filtered_events/
│   ├── daily_aggregates/
│   └── attributes/
├── configs/
│   ├── base_config.json
│   └── dbt_config.json
└── macros/
```

## Troubleshooting

If you encounter issues:

1. Ensure the project were initialized in the path you try to generate it
2. Deep dive on the `base_config.json` file