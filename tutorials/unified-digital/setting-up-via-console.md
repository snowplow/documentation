---
title: "Run the Unified Digital dbt package using Snowplow Console"
sidebar_label: "Run via Console"
position: 3
description: "Deploy the Unified Digital dbt package through Snowplow Console's fully managed service. Configure web and mobile data processing, enrichments, and scheduling through the Console interface."
keywords: ["snowplow console data models", "managed dbt deployment"]
---

Once you are happy with how your local configuration is working, you will want to schedule it to run regularly. Snowplow provides a fully managed service for running data models securely.

To get started, follow these steps:

1. Commit the local configuration you built previously to a Git repository.

2. Create a Git connection to your repository. In Console, navigate to **Destinations > Connections > Set up connection > Git connection**

3. Create a warehouse connection. In Console, navigate to **Destinations > Connections > Set up connection > Data modeling connection**

4. Create a model project. In Console, select **Modeling > Model projects > Create model project**

5. Add a run configuration with a schedule to your model project. Click **Add run configuration** and **Add schedule**. Pick your preferred schedule, e.g. daily at 00:00 AM.

For a full reference on running data models via Snowplow Console, see [Run data models from Console](/docs/modeling-your-data/running-data-models-via-console/).
