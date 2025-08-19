---
title: Conclusion
position: 8
---

Congratulations! You've finished the monitor website performance with core web vitals tutorial.

You have successfully set up a complete web performance monitoring solution using Snowplow. You can now track core web vitals on your website, enrich the data with device and user agent information, model it using the snowplow-web dbt package, and visualize the results in your preferred dashboard tool.

Your web performance monitoring setup enables you to:

- Track essential core web vitals metrics that directly impact user experience and SEO rankings
- Segment performance data by device, browser, and page to identify specific areas for improvement
- Monitor performance trends over time to detect regressions or validate improvements
- Filter out bot traffic to ensure your analysis focuses on real user experiences

## Next steps

After having gone through what we consider the basis for web performance data collection and monitoring, you might want to collect more data regarding the user experience and page loading information of your pages.

### Performance Navigation Timing plugin

This Snowplow plugin allows for collecting data related to the [Navigation Timing](https://w3c.github.io/navigation-timing/) API. Navigation Timing data gives you access to the complete timing information for navigation of a page. Such information can include how much time it takes to complete DOM construction, if the page was reloaded or retrieved from the back-forward browser cache, how many redirects happened and more.

You find installation instructions and read more at the plugin [documentation page](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/performance-navigation-timing/).

### Additional considerations

- Consider implementing alerts based on your core web vitals thresholds to proactively identify performance issues
- Explore correlating web performance data with business metrics like conversion rates and user engagement
- Set up regular performance audits and establish performance budgets for your development team
- Use the insights from your dashboard to prioritize optimization efforts on your highest-impact pages

If you have more ideas or specific requests for extending your web performance monitoring, feel free to contact us!
