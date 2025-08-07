---
title: Conclusion
position: 12
---

Congratulations! You have successfully completed the Analytics for Web tutorial. You have learned how to model and visualize Snowplow data using the snowplow-web dbt package, set up tracking and enrichments, and created meaningful visualizations from your data.

Over this tutorial, you have:

- Uploaded sample Snowplow event data to your warehouse
- Configured and run the snowplow-web dbt package to transform raw events into analytical tables
- Created visualizations using Streamlit or Databricks
- Set up comprehensive web tracking for page views, user interactions, and context
- Added enrichments to enhance your event data with additional information
- Explored the derived tables and gained insights into user behavior

You now have a solid foundation for using Snowplow to gain deeper insights into customer behavior on your website and make data-driven business decisions.

## Next steps

### Model your pipeline data

At this stage you should have tracking and enrichment set up, some data in the `ATOMIC.EVENTS` table, enabled IAB, UA parser and YAUAA enrichments, and a working dbt project with the web model configurations for the sample data.

To use your own pipeline data:

1. **Modify variables** - Remove the `snowplow__events` variable since you'll now use the default `atomic.events` table. Change the `snowplow__start_date` variable according to the data you have in your events table.

2. **Run the model** - Execute `dbt run --selector snowplow_web` to process your actual pipeline data.

3. **Test your setup** - Run `dbt test --selector snowplow_web_lean_tests` to identify potential issues with the data.

### Visualize your pipeline data

Update your visualization setup to point to your new derived schema:

- **Streamlit**: Change the `schema` variable within the `secrets.toml` file
- **Databricks**: Update the schema references within your notebook queries

### Custom models

You're now ready to take action and use your Snowplow generated data to help your business grow. As a next step you might want to check out our [detailed guide](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/) on how to create custom models to adjust the snowplow-web data model to your own needs if the out-of-the-box solution doesn't fully fit your requirements.
