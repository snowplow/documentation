---
title: "Timings"
sidebar_position: 90
---

# Timings tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Use the `trackTiming` method to track user timing events such as how long resources take to load. Here are its arguments:

| **Name**   | **Required?** | **Description**                | **Type** |
|------------|---------------|--------------------------------|----------|
| `category` | Yes           | Timing category                | string   |
| `variable` | Yes           | Timed variable                 | string   |
| `timing`   | Yes           | Number of milliseconds elapsed | number   |
| `label`    | No            | Label for the event            | string   |

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackTiming', {
  category: 'load',
  variable: 'map_loaded',
  timing: 50,
  label: 'Map loading time'
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackTiming } from '@snowplow/browser-plugin-site-tracking';

trackTiming({
  category: 'load',
  variable: 'map_loaded',
  timing: 50,
  label: 'Map loading time'
});
```
  </TabItem>
</Tabs>


Timing events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0) is the schema for a `timing` event.

`trackTiming` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.
