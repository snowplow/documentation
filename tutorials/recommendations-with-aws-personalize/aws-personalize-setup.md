---
title: AWS Personalize Setup
position: 5
---

To proceed we need the following infrastructure:

- A Dataset Group: this is the top-level resource for AWS Personalize, and maps to a use case (e.g. Ecommerce) and will contain our Datasets and Recommenders
- A set of Schemas for each of our datasets above; these are defined in Avro format ([the repo has templates](https://github.com/snowplow-incubator/dbt-snowplow-recommendations/tree/main/aws_personalize_utilities/schemas))
- The Datasets configurations themselves; these bind some use-case configuration to the Dataset Group and Schema
- Support infrastructure like IAM roles and policies to allow AWS Personalize to access your data
- A Dataset Import to load your datasets from S3
- Recommenders to choose a model, train on the dataset, and serve personalizations