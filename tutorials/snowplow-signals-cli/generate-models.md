---
position: 4
title: Generating Data Models for Batch Views
---

Now that your projects are set up, it's time to generate the data models for each batch view. Each project will have its own set of models generated based on its specific schema and requirements.

## Generating Models

Depending on how you initialized your projects, you can generate models in two ways:

### For All Batch Views

If you created projects for all batch views:

```bash
snowplow-batch-autogen generate \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --repo-path "./my_snowplow_repo" \
  --verbose
```

This will generate models for each batch view project in your repository.

### For a Specific Project

If you want to generate models for a specific project (remember that project names follow the format `{view_name}_{view_version}`):

```bash
snowplow-batch-autogen generate \
  --project-name "user_attributes_1" \
  --verbose
```

If you've set up your environment variables, you can use these simpler commands:

```bash
# For all batch views
snowplow-batch-autogen generate --verbose

# For a specific project
snowplow-batch-autogen generate --project-name "user_attributes_1" --verbose
```

## What Happens During Generation?

For each project, the generation process will:

1. Create dbt configuration files
2. Generate SQL models based on the batch view's schema
3. Set up necessary macros and functions
4. Update any existing files if needed

## Project Structure After Generation

After generation, each project in your repository will have this expanded structure:

```
my_snowplow_repo/
├── user_attributes_1/
│   ├── dbt_project.yml      # Main dbt configuration
│   ├── packages.yml         # Dependencies configuration
│   ├── models/             # SQL models
│   │   ├── base/          # Base models
│   │   ├── filtered_events/ # Event filtering
│   │   ├── daily_aggregates/ # Aggregated data
│   │   └── attributes/    # Feature definitions
│   ├── configs/           # Configuration files
│   │   ├── base_config.json
│   │   └── dbt_config.json
│   └── macros/           # Reusable SQL functions
├── product_views_2/
│   └── ... (same structure)
└── user_segments_1/
    └── ... (same structure)
```

## Understanding the Generated Models

For each batch view, the generated models are specifically designed for batch processing:

- **Base models**: Raw data transformations
- **Filtered events**: Event filtering and cleaning
- **Daily aggregates**: Time-based aggregations
- **Attributes**: Final feature definitions

## Troubleshooting

If you encounter any issues during generation:

1. Make sure your projects were properly initialized in the correct path
2. Review the `base_config.json` file in each project for configuration issues
3. Check that your API credentials have the necessary permissions
4. Use the `--verbose` flag for more detailed error messages

Once your models are generated, you're ready to run them and see the results!