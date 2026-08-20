---
title: "Introducing Databricks Streaming Loader"
description: "We are excited to introduce the Databricks Streaming Loader, a new integration with Databricks that allows you to continuously load data with sub-minute latency."
date: "2025-10-02"
update_type:
  - "Release notes"
components:
  - "Loaders"
  - "Databricks"
---
We are excited to introduce the **Databricks Streaming Loader**, a new integration with Databricks that allows you to continuously load data with sub-minute latency.

Low-latency loading is an excellent foundation for real-time use cases, e.g. editorial analytics. This way, you can centralize your data in the lake house, instead of relying on separate streaming and batch architectures.

The new loader is currently **in Preview**, available for AWS, Azure and GCP pipelines. Under the hood, it relies on a Databricks Unity Volume and Databricks Lakeflow pipeline. You can find the setup instructions and more details [in the documentation](/docs/destinations/warehouses-lakes/databricks/?databricks-integration=streaming-loader).
