---
title: Conclusion
position: 10
---

Congratulations! You have successfully completed the hybrid app analytics tutorial. You now have a comprehensive understanding of how to implement unified tracking and analytics for mobile apps that combine native components with embedded web views.

## What you've achieved

Through this tutorial, you have:

- **Uploaded and modeled sample data** using the snowplow-mobile dbt package to understand the unified approach to hybrid app analytics
- **Visualized hybrid app data** with Streamlit, demonstrating insights across both native and web view interactions
- **Implemented unified tracking** in hybrid mobile apps that seamlessly combines events from native code (iOS/Android/React Native) and embedded web views
- **Configured session sharing** to ensure events from both contexts appear under the same tracker and session
- **Explored the derived data model** that provides complete user journey analysis across native and web components

The unified tracking approach you've implemented allows you to understand user behavior holistically, treating your hybrid app as a single cohesive experience rather than separate native and web components.

## Next steps

Now that you have set up tracking and learned how to model hybrid app data with the sample dataset, you can apply these techniques to your own production pipeline data.

### Model your pipeline data

If you have tracking set up and data in your `ATOMIC.EVENTS` table:

1. **Complete refresh of your Snowplow mobile package** - Start fresh with your production data by running a full refresh with manifest reset:

```bash
dbt run --selector snowplow_mobile --full-refresh --vars 'snowplow__allow_refresh: true'
```

2. **Modify variables** for your production environment:
   - Remove the `snowplow__events` variable (defaults to `atomic.events`)
   - Set `snowplow__start_date` according to your actual data
   - Consider setting `snowplow__backfill_limit_days` to 1 initially for testing

3. **Run the model** on your production data:

```bash
dbt run --selector snowplow_mobile
```

4. **Test the output** to ensure data quality:

```bash
dbt test --selector snowplow_mobile_lean_tests
```

### Explore advanced use cases

With your hybrid app tracking foundation in place, consider extending your analytics capabilities:

- **Custom event schemas** for app-specific interactions
- **Advanced attribution modeling** across native and web touchpoints  
- **Real-time analytics** using Snowplow's streaming capabilities
- **Machine learning models** on unified behavioral data
- **Cross-platform user journey analysis** when users interact with both mobile and web applications

For more implementation guides and best practices, explore additional Snowplow tutorials and accelerators to realize even greater value from your behavioral data.
