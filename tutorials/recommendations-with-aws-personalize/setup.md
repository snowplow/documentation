---
position: 2
title: Installation and setup
---

This tutorial can be executed with a AWS account and [our corresponding Colab notebook](https://colab.research.google.com/drive/19T6EICwF5nF4yrA7ftS3pE-zp9huxaYk), which utilizes our demo stores as a source of events. The rest of this tutorial guides you setting AWS Personalize with your own sources.

Different stages of this tutorial use Python for code examples, although any programming language with support for AWS SDK can be used. 

Supporting files can be found at [the corresponding GitHub repository](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize). In there you should find:

- [An example on how to implement your own Lambda function (in Python)](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/blob/main/aws_personalize_utilities/lambda_app.py);
    - There's [an alternative implementation using Flask](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/blob/main/aws_personalize_utilities/flask_app.py).
- [Different Terraform modules to help you to setup AWS Personalize, and/or Snowflake and Databricks instances](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/tree/main/terraform_utilities);
- [A specific data model, to help you to extract relevant data to prepare a training dataset for AWS Personalize](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/tree/main/dbt-snowplow-recommendations).

AWS Personalize generally requires custom infrastructure to run. Some of that infrastructure can take time to deploy (20+ minutes) so you may need to make sure it's spun up before starting to work with it.
