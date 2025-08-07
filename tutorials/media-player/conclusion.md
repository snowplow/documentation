---
title: Conclusion
position: 9
---

Congratulations! You have successfully completed the media player analytics tutorial. You now have a comprehensive understanding of how to implement tracking and analytics for media players across different platforms and gain valuable insights from user behavior data.

## What you've achieved

Through this tutorial, you have:

- **Uploaded and modeled sample data** using the snowplow-media-player dbt package to understand media engagement patterns
- **Visualized media performance** with Tableau, demonstrating insights into content consumption and ad performance
- **Implemented comprehensive tracking** across different media players including web JavaScript trackers, mobile SDKs, and platform-specific plugins
- **Set up testing workflows** to validate your tracking implementation
- **Explored the derived data model** that provides detailed analytics on media consumption, user engagement, and advertising effectiveness

The analytics foundation you've built provides insights into video engagement patterns, content performance metrics, audience retention, and advertising effectiveness across your media platforms.

## Next steps

Now that you have set up tracking and learned how to model media player data with the sample dataset, you can apply these techniques to your own production pipeline data.

### Model your pipeline data

If you have tracking set up and data in your `ATOMIC.EVENTS` table:

1. **Complete refresh of your Snowplow media player package** - Start fresh with your production data by running a full refresh with manifest reset:

```bash
dbt run --selector snowplow_media_player --full-refresh --vars 'snowplow__allow_refresh: true'
```

2. **Modify variables** for your production environment:
   - Remove the `snowplow__events_table` variable (defaults to `atomic.events`)
   - Set `snowplow__start_date` according to your actual data
   - Enable desired contexts and configuration depending on which media plugin or tracking implementation you use
   - Consider setting `snowplow__backfill_limit_days` to 1 initially for testing

3. **Run the model** on your production data:

```bash
dbt run --selector snowplow_media_player
```

4. **Test the output** to ensure data quality:

```bash
dbt test --selector snowplow_media_player_lean_tests
```

### Visualize your pipeline data

You can now get started with the analysis of user behavior across your media and video content by utilizing the Tableau workbook provided. For guidance on changing the dashboard to your own data source, refer back to the visualization section.

### Explore advanced use cases

With your media player tracking foundation in place, consider extending your analytics capabilities:

- **Custom models** - Check out our [detailed guide](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/) on how to create custom models to adjust the snowplow-media-player data model to your own needs
- **Advanced media analytics** for specific platforms like YouTube, Vimeo, or custom players
- **Cross-platform user journey analysis** when users consume content across web and mobile platforms
- **Real-time media monitoring** using Snowplow's streaming capabilities
- **Machine learning models** for content recommendation and engagement prediction
- **Advanced advertising analytics** including attribution modeling and campaign optimization

For more implementation guides and best practices, explore additional Snowplow tutorials and accelerators to realize even greater value from your media analytics data.
