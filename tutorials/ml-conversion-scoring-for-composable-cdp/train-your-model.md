---
title: Train your model
position: 3
---

This propensity to convert solution provides a very flexible way to identify who among your audience is most likely to actually engage with you, for example request a demo / sign up for a trial, purchase a first service/product, request an upgrade, accept an offer etc.

You'll train a predictive model using LightGBM and MLflow to identify users most likely to convert based on their behavioral data.

## Import the training notebook

This tutorial uses a notebook for training. It covers:

- Loading and exploring your Snowplow behavioral data from Snowflake
- Feature engineering and data preprocessing using Snowpark
- Training a LightGBM classification model
- Model evaluation and validation
- Saving the model for deployment

### Using Databricks

Import this notebook into your Databricks workspace to run this model for yourself (see how to [Import a notebook](https://docs.databricks.com/notebooks/notebooks-manage.html#import-a-notebook)).

You'll save the model to the MLflow registry.

You can access the notebook here: [Databricks Model Training Notebook](https://github.com/snowplow/composable-cdp-with-predictive-ml-modeling-accelerator/blob/main/content/predictive_ml_models/databricks/static/databricks_training_model.py)

### Using Snowflake

Clone this notebook into your own workspace to run this model for yourself: [Snowflake Model Training Notebook](https://github.com/snowplow/composable-cdp-with-predictive-ml-modeling-accelerator/blob/main/content/predictive_ml_models/snowflake/static/snowflake_training_model.ipynb)

The notebook uses Snowpark.

## Key steps in the training process

The notebook walks you through building a propensity model that uses features like:

- User engagement metrics (time on site, scroll depth)
- Marketing attribution data (source, medium, campaign)
- Geographic and device information
- Temporal patterns (time of visit, day of week)

After training, you'll have a model that can predict the likelihood of conversion for new website visitors, enabling you to focus marketing efforts on the highest-value prospects.
