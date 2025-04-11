---
position: 5
title: Running Generated dbt Models
---


## Best Practices

1. Always test your models after generation
2. Review generated code for accuracy
3. Document any custom modifications
4. Keep track of model versions
5. Regularly update your models


After generating your dbt models, you'll need to run them to create the corresponding tables and views in your data warehouse. These runs are primarily for testing and exploration purposes, allowing you to verify the generated models and make any necessary adjustments.

## Prerequisites

Before running the models, ensure you have:
- A working dbt profile configured for your data warehouse
- The necessary permissions to create tables and views

## Running Models

For the first run, you'll need to perform a full refresh:

```bash
dbt run --full-refresh
```

For subsequent runs, you can simply use:

```bash
dbt run
```

This local testing phase is your opportunity to:
- Verify the generated models meet your requirements
- Make any necessary adjustments to the models
- Explore the project structure and understand the transformations

## Next Steps

After you're satisfied with the local testing results, the next step will cover materializing these models to your feature store for production use. 