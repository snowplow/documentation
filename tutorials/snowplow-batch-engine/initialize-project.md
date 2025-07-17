---
position: 3
title: Create projects
---

Having tested the connection, you can now initialize your projects.

When you run the initialization command, the CLI will:

1. Create a separate project directory for each relevant view
2. Set up the basic configuration files for each project
3. Initialize the necessary folder structure for each project
4. Prepare each project for model generation

## Run initialize

You can generate projects for all the relevant views in Signals at once, or one at a time.

```bash
# For all views
snowplow-batch-autogen init --verbose

# For a specific view
snowplow-batch-autogen init \
  --view-name "user_attributes" \
  --view-version 1 \
  --verbose
```

Each view will have its own separate dbt project, with the project name following the format `{view_name}_{view_version}`.

The files will be generated at the path specified in your `SNOWPLOW_REPO_PATH` environment variable.

## Project structure

After initialization, your repository will have a structure like this:

```
my_repo/
├── my_view_1/
│   └── configs/
│       └── base_config.json
├── etc.
```

In this example, projects were generated for three views: `user_attributes` v1, `product_views` v2, and `user_segments` v3:

```
my_snowplow_repo/
├── user_attributes_1/
│   └── configs/
│       └── base_config.json
├── product_views_2/
│   └── configs/
│       └── base_config.json
└── user_segments_1/
    └── configs/
        └── base_config.json
```

## Troubleshooting

If you run into any issues during initialization:

1. Check that you have write permissions in the target directory
2. Check that you don't already have a project with the same name as one you're trying to initialize
4. Check that your API credentials have the necessary permissions
5. Use the `--verbose` flag to get more detailed error messages
