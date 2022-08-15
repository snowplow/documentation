---
title: "Adding filters to your recovery"
date: "2021-10-13"
sidebar_position: 3000
---

Filters determine whether your recovery steps will be applied to a specific failed event, events will only be processed if they validate successfully against all filters.

The recovery process crudely process all Failed Events within a given time period. Within this period you may have had multiple different events failing, for multiple reasons reasons.

You want your recovery steps to apply only to events that need these recovery steps applying, this helps to avoid duplicates or failed recoveries.

As examples you could target one or more of:

- Certain Schema e.g. only where schema name = add\_to\_cart\_1\_0\_0
- Certain keyword (For example, app\_id, or URL) e.g. only where app\_id = website
- Certain value for a specific field, etc e.g. only where currency < 3

If there is a match the event will be processed (it will be filtered in), if there is not a match it will not be process (it will be filtered out).

### Adding a filter

To add a filter step, click the `Add a filter` button. This will allow you to build a filter.

1. First select the attribute you wish to target with this filter. As you type attributes from your event will auto-complete.
2. Select the test you want to run
3. Depending on the test a number of other options may appear, fill these out as required. Once complete a notification will let you know if your example failed event matches against these criteria.
4. Click 'Add this filter'

Once added the step will appear in your list of filters.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/10/Screen-Shot-2021-10-13-at-16.16.42.jpg?w=1024)

### Testing your filters

As you build up a set of filters they will automatically be run against your example failed event and you will be shown whether your event passes these filters (would be processed) or fails to pass them (would not be processed).

You can also test the filters against a batch of events. To do this, simply upload a batch file of events and each event in turn will be tested against your filters. You'll then be able to browse to sense check which were filtered out.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/10/Screen-Shot-2021-10-13-at-16.14.27.jpg?w=1024)

In this example two of the events in our batch did not pass our filters
