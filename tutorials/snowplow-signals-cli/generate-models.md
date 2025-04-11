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

- Generate data models based on your schema
- Create necessary macros
- Set up configuration files
- Update existing files if needed

## Expected Output

When successful, you should see:

```bash
🛠️ Generating dbt models in ./my_snowplow_project
✅ Successfully generated dbt models
```

## Model Generation Process

The generation process includes:

1. Analyzing your schema
2. Creating base models
3. Generating staging models
4. Setting up macros and tests

## Updating Existing Models

To update existing models:

```bash
snowplow-batch-autogen generate \
  --update \
  --verbose
```

## Best Practices

1. Always test your models after generation
2. Review generated code for accuracy
3. Document any custom modifications
4. Keep track of model versions
5. Regularly update your models

## Troubleshooting

If you encounter issues:

1. Check API service health
2. Verify schema compatibility
3. Ensure proper project structure
4. Review error messages in verbose mode

## Next Steps

After generating your models:

1. Review the generated code
2. Test the models in your environment
3. Set up a batch source

-- FIXME either way here we will have a new page for that