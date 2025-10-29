---
title: Training Data
position: 4
---

In order for the Shaped.ai model to serve usable results, we need to give it some initial training on our actual store.
Out of the box Shaped.ai will have no idea about our customers or products, let alone the relationships between them and what makes a good recommendation.

To solve this "cold start" problem, we need to export our catalog information for Shaped.ai to read, and give it an initial training dataset of interactions for it to build a model off of.

From this state a real Snowplow user would ideally be using our [E-Commerce DBT models](https://github.com/snowplow/dbt-snowplow-ecommerce).

As output from those models, of most interest to us for use with Shaped.ai is the `snowplow_ecommerce_product_interactions` model. This model includes interactions users have with products, including views and purchases - the information we need for Shaped.ai models!

Once the model runs and `snowplow_ecommerce_product_interactions` table gets populated, a Parquet file can be generated using one of the following guides, accoding to your data warehouse technology: 

- Snowflake: https://docs.snowflake.com/en/user-guide/tutorials/script-data-load-transform-parquet
- Databricks: https://docs.databricks.com/aws/en/query/formats/parquet#options

From this we can start to look at the requirements for Shaped.ai and what we need to transform this data into a format that matches its requirements for a Product Interactions data set.

We need:

- At least 1000 View events
- At least 25 users
- 4 columns per event:
    - `USER_ID`: We'll map this to the customer ID or Domain User ID for anonymous customers.
    - `ITEM_ID`: This will just be the product ID
    - `TIMESTAMP`: We will use `derived_tstamp` as the most accurate timestamp we have; this also needs to be transformed into unix timestamp format
    - `EVENT_TYPE`: We will map our Snowplow events to be either 'View' or 'Purchase' as appropriate

With these training datasets in hand, we can now store them in Shaped.ai and start the setup for Shaped.ai models to ingest them.

## Shaped.ai setup

To proceed we need the following items:

- An initial Dataset: the `snowplow_ecommerce_product_interactions` created as a Parquet file in the previous step, so we can easily import them
- A Model Descriptor, in the YAML format

Shaped.ai has a very good Python library. Make sure to use Python version 3.11 (currently, their CLI does not work on newer Python versions). Install their CLI using the following command:

```sh
$ pip install shaped
```

The next steps will require you to have full access to Shaped.ai, as creating API Keys will be necessary. 

To import your Parquet file into Shaped.ai, use the following commands:

```sh
$ shaped init --api-key your-shaped-ai-api-key-here
$ shaped create-dataset-from-uri --name recommendations_ecomm_model_interactions --path ./your-exported-file.parquet --type parquet
```

Make sure the datasets were imported successfully, checking each Dataset through Shaped.ai UI. After this, you should create a model using a YAML file. One suggestion for this file contents would be as follows:

```yml
# Specify your unique model name and any configurations.
model:
  name: testing_snowplow_model
  description: A model to test Snowplow data integration.

# Specify the datasets that your model needs.
connectors:
  - id: recommendations_ecomm
    name: recommendations_ecomm
    type: Dataset
  - id: recommendations_ecomm_model_interactions
    name: recommendations_ecomm_model_interactions
    type: Dataset

fetch:
  events: |
    SELECT
      DOMAIN_USERID as user_id,
      PRODUCT_ID as item_id,
      1 AS label,  
      ECOMMERCE_ACTION_TYPE as event,
      ECOMMERCE_ACTION_TYPE as event_value,
      DERIVED_TSTAMP as created_at
    FROM recommendations_ecomm_model_interactions
```

Supposing the file was saved as `sample_model_definition.yaml`, the model can be created with this command:

```sh
$ shaped create-model --file sample_model_definition.yaml
```

If all goes well, Shaped.ai will show a model being created in their UI. After the model is created, we can use Shaped.ai API to fetch pre-calculated recommendation scores!