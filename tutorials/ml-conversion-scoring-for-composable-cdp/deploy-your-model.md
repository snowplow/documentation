---
title: Deploy your model
position: 3.5
---

Now that your model is built and saved, you'll learn how to load and use your model to generate predictions for new users.

Now that your model is built and saved in MLflow registry, you'll learn how to load and use your model in a Databricks notebook to generate predictions for new users.

## Import the deployment notebook

The deployment notebook covers:

- Preparing new user data for prediction
- Creating a propensity scores table for use with Census

### Using Databricks

You can access the deployment notebook here: [Databricks Model Deployment Notebook](https://github.com/snowplow/composable-cdp-with-predictive-ml-modeling-accelerator/blob/main/content/predictive_ml_models/databricks/static/databricks_deploying_model.py)

### Using Snowflake

Learn how to create a Snowflake User Defined Function for your model.

Clone this notebook into your own workspace to run this model for yourself: [Snowflake Model Deployment Notebook](https://github.com/snowplow/composable-cdp-with-predictive-ml-modeling-accelerator/blob/main/content/predictive_ml_models/snowflake/static/snowflake_deploying_model.ipynb)

## Generating predictions

The deployment process creates a `snowplow_user_propensity_scores` table that contains:

- User identifiers that match your business user IDs
- Propensity scores (probability of conversion)
- Risk categories (high, medium, low propensity)
- Model metadata and prediction timestamps

This table becomes the foundation for building targeted audiences in Census, allowing you to activate your ML insights across your marketing tools.

Now you're ready to use your model output for activation via Census. The next section guides you through how to target high propensity visitors to optimize ad spend.
