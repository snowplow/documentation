---
title: "Adding recovery steps"
date: "2021-10-13"
sidebar_position: 2000
---

A failed event is recovered by applying one or more steps to the payload to fix the issue that is causing a failure.

You can take three actions within a step:

1. **Replace** - replace the value by matching a regex statement against the current value and providng a replacement value. This is commonly used when an incorrect value has been passed in.
2. **Remove** - remove the attribute entirely. This is commonly used when an attribute has been passed in that does not exist in the Data Structure schema.
3. **Cast** - cast the attribute value from one type to another e.g. string to number.

### Adding a step manually

To add a recovery step, click the `Add structured step` button. This will allow you to build a recovery step. You'll see a list of the event failure messages on the right hand side of the panel for reference.

1. First select the attribute you wish to target with this step. As you type attributes from your event will auto-complete.
2. Select the recovery operation you want to run (Replace, Remove, Cast)
3. Depending on the operation a number of other options may appear, fill these out as required.
4. Click 'Add this step'

Once added the step will appear in your list of recovery steps, and in the right hand panel you will see the resulting payload as a result of your step.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/10/failed-evs-steps-add-1.jpg?w=1024)

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/10/failed-evs-steps-add-2.jpg?w=1024)

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/10/failed-evs-steps-add-3.jpg?w=1024)

### Using recommendations

Where possible the UI will provide recommendations for recovery based on the error messages in your failed event.

To view recommendations click the `View recommendations` button. This will show a list of recommendations per error message, where possible.

To apply a recommendation click `Apply this step`. You will be taken to a partially / fully configured step. Check you are happy with the configuration and click `Add this step` to add it to your recovery design.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/10/failed-evs-steps-recomms.jpg?w=1024)
