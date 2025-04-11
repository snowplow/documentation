---
position: 3
title: Creating Projects for Batch Views
---

Now that we've verified our connection to Snowplow Signals, let's create projects for your batch views. Each batch view will have its own separate dbt project in the specified repository path, with the project name following the format `{view_name}_{view_version}`.

## Creating Projects

You have two options when creating projects:

1. **Generate projects for all batch views**: Creates a separate project for each batch view in your repository
2. **Generate project for a specific view**: Creates a project for just one batch view

### Option 1: All Batch Views

To create projects for all your batch views:

```bash
snowplow-batch-autogen init \
  --api-url "YOUR_API_URL" \
  --api-key "YOUR_API_KEY" \
  --api-key-id "YOUR_API_KEY_ID" \
  --org-id "YOUR_ORG_ID" \
  --repo-path "./my_snowplow_project" \
  --verbose
```

This will create a separate project directory for each batch view in your repository, with each directory named using the format `{view_name}_{view_version}`.

### Option 2: Specific Batch View

To create a project for a specific batch view:

```bash
snowplow-batch-autogen init \
  --view-name "user_attributes" \
  --view-version 1 \
  --verbose
```

If you've set up your environment variables, you can use these simpler commands:

```bash
# For all batch views
snowplow-batch-autogen init --verbose

# For a specific view
snowplow-batch-autogen init --view-name "user_attributes" --view-version 1 --verbose
```

## What Happens During Initialization?

When you run the initialization command, the CLI will:

1. Create a separate project directory for each batch view (named `{view_name}_{view_version}`)
2. Set up the basic configuration files for each project
3. Initialize the necessary folder structure for each project
4. Prepare each project for model generation

## Project Structure

After initialization, your repository will have this structure:

```
my_snowplow_project/
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

Each view gets its own project directory with its own configuration, named using the format `{view_name}_{view_version}`.

## Choosing Between Options

- Use **Option 1** when you want to set up projects for all your batch views at once
- Use **Option 2** when you want to work with a specific batch view

## Troubleshooting

If you run into any issues during initialization:

1. Make sure you have write permissions in the target directory
2. Verify that the view name and version combination doesn't already exist
3. Check that your API credentials have the necessary permissions
4. Use the `--verbose` flag to get more detailed error messages

Once your projects are created, you're ready to generate the data models for each view!
