---
hide_title: true
hide_table_of_contents: true
title: "How-To Guide: Implementing Behavioral Data Collection"
description: "Step-by-step tutorials for implementing behavioral data collection, modeling, and analytics with Snowplow."
schema: "HowTo"
keywords: ["Snowplow Tutorials", "Tutorial Index", "Learning Guides", "Step-by-Step", "Tutorial Overview", "Learning Resources"]
image: "/images/gcp-setup.png"
totalTime: "PT45M"
tool:
  - name: "Terraform"
  - name: "Google Cloud Console"
step:
  - name: "Enable APIs"
    text: "Enable Pub/Sub and Dataflow APIs in your GCP project."
    url: "/docs/gcp/setup/#step-1"
  - name: "Deploy Collector"
    text: "Use Terraform to deploy the Scala Stream Collector connected to Pub/Sub."
    url: "/docs/gcp/setup/#step-2"
  - name: "Set Up Enrichment"
    text: "Run the Enrich job with Dataflow templates and write output to BigQuery."
    url: "/docs/gcp/setup/#step-3"
---

```mdx-code-block
import TutorialList from '@site/src/components/tutorials/TutorialList';

```

<TutorialList />
