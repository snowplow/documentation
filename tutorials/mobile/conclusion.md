---
title: "Conclusion"
position: 9
---

You've successfully built a complete mobile analytics solution using Snowplow! This tutorial covered the entire pipeline from data collection through modeling and visualization.

You've learned how to upload and model sample mobile event data using the snowplow-mobile dbt package, create interactive dashboards with Streamlit, implement tracking in mobile apps across multiple platforms, and validate your tracking implementation using Snowplow Micro.

## What you've accomplished

Through this tutorial, you've gained hands-on experience with:

**Data modeling**: You've seen how raw mobile events are transformed into structured tables for sessions, users, and screen views. The snowplow-mobile dbt package automated the creation of metrics like engagement time, bounce rates, and user journeys.

**Data visualization**: Your Streamlit dashboard provides immediate insights into user behavior, popular screens, device usage patterns, and geographic distribution. This demonstrates how modeled data can quickly reveal business-relevant insights.

**Mobile tracking implementation**: You've implemented Snowplow tracking across iOS, Android, React Native, or Flutter platforms. This includes automatic tracking of screen views and app lifecycle events, plus the foundation for custom event tracking.

**Testing and validation**: Using Snowplow Micro, you've learned to validate tracking implementations locally before deploying to production, ensuring data quality from the start.

The combination of these components creates a robust foundation for understanding mobile user behavior and making data-driven decisions about your app.

## Apply this to your own pipeline

Now that you've worked through the complete process with sample data, you can apply these concepts to your own Snowplow pipeline:

### Step 1: Model your production data

Update your dbt configuration to work with your live events table. Modify the variables in your `dbt_project.yml`:

```yaml
vars:
  snowplow_mobile:
    snowplow__start_date: 'YYYY-MM-DD'  # Date of your first events
    snowplow__backfill_limit_days: 1    # Start with small increments
    # Remove snowplow__events to use the default atomic.events table
```

Run a complete refresh if needed:

```bash
dbt run --selector snowplow_mobile --full-refresh --vars 'snowplow__allow_refresh: true'
```

### Step 2: Connect your live tracking

Replace the ngrok endpoint in your mobile app with your production Snowplow collector endpoint. Deploy the updated app and monitor the data flow.

### Step 3: Customize your models

The out-of-the-box snowplow-mobile package provides a solid foundation, but you may want to extend it with custom models specific to your business needs. Check the [dbt custom models guide](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/) for detailed instructions.

### Step 4: Enhance your dashboard

Customize the Streamlit dashboard or build new visualizations that focus on your specific KPIs and business questions. Consider integrating with your existing BI tools for broader access.

## Next steps

With your mobile analytics foundation in place, consider these areas for further development:

- **Advanced event tracking**: Implement custom events that capture business-specific actions and outcomes
- **Real-time analytics**: Explore Snowplow's real-time capabilities for immediate insights
- **Machine learning**: Use your behavioral data for user segmentation, recommendation engines, or predictive analytics
- **Attribution modeling**: Connect mobile interactions to business outcomes and revenue
- **Cross-platform analysis**: Combine mobile data with web and other touchpoints for a complete customer view

The skills and infrastructure you've built through this tutorial provide the foundation for sophisticated mobile analytics that can drive meaningful business insights and growth.

### Resources

- [Snowplow mobile tracker documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/)
- [snowplow-mobile dbt package documentation](https://docs.snowplow.io/docs/modeling-your-data/the-snowplow-mobile-data-model/dbt-mobile-data-model/)
- [Snowplow community forum](https://discourse.snowplow.io/) for questions and discussions
- [Additional tutorials and accelerators](https://docs.snowplow.io/docs/tutorials-and-resources/) for expanding your Snowplow implementation
