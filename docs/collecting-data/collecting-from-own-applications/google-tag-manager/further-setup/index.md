---
title: Further Setup
---

### Tracker Name

It is important to set the tracker name. The reason you might have more than one tracker name generated on the site is if you have different configuration objects or tracking endpoints to which you want to send commands.

When the tag runs, it first checks if a tag with this name has already been initialized. If it has, it then proceeds to send the command to this tracker name. If a tracker with this name has _not_ been initialized, a new tracker is initialized with the tracker configuration from this settings variable.

This means that a tracker configuration is applied **only once** to the tracker. Thus if you have more than one tag running on the site, each with the same tracker name but different tracker configurations, only the configuration of the tag that fires _first_ will be applied to the tracker.
