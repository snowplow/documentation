---
position: 4
title: Generate data models
---

Each project will have its own set of models generated based on its specific schema and requirements.

For each project, the generation process will:

1. Create dbt configuration files
2. Generate SQL models based on the batch view's schema
3. Set up necessary macros and functions
4. Update any existing files if needed

For each batch view, the generated models are specifically designed for batch processing:

* Base models: raw data transformations
* Filtered events: event filtering and cleaning
* Daily aggregates: time-based aggregations
* Attributes: final feature definitions

## Run generate command

Depending on how you initialized your projects, you can generate models in two ways.

If you created projects for all views, you can generate models for all of them at once:

```bash
# For all views
snowplow-batch-autogen generate --verbose
```

To generate models for a specific project:

```bash
snowplow-batch-autogen generate \
  --project-name "user_attributes_1" \
  --verbose
```

Remember that project names follow the format `{view_name}_{view_version}`.

## Project structure

After generation, each project in your repository will have this expanded structure:

```
my_snowplow_repo/
├── user_attributes_1/
│   ├── dbt_project.yml        # Main dbt configuration
│   ├── packages.yml           # Dependencies configuration
│   ├── models/                # SQL models
│   │   ├── base/              # Base models
│   │   ├── filtered_events/   # Event filtering
│   │   ├── daily_aggregates/  # Aggregated data
│   │   └── attributes/        # Feature definitions
│   ├── configs/               # Configuration files
│   │   ├── base_config.json
│   │   └── dbt_config.json
│   │   └── batch_source_config.json
│   └── macros/                # Reusable SQL functions
├── product_views_2/
│   └── ... (same structure)
└── user_segments_1/
    └── ... (same structure)
```

## Troubleshooting

If you encounter any issues during generation:

1. Check that your projects were properly initialized in the correct path
2. Review the `base_config.json` file in each project for configuration issues
3. Check that your API credentials have the necessary permissions
4. Use the `--verbose` flag for more detailed error messages
