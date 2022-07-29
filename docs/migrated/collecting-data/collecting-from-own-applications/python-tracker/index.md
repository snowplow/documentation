---
title: "Python Tracker"
date: "2020-02-26"
sidebar_position: 200
---

[![Tracker Maintenance Classification](https://img.shields.io/static/v1?style=flat&label=Snowplow&message=Early%20Release&color=014477&labelColor=9ba0aa&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC)](/docs/migrated/collecting-data/collecting-from-own-applications/tracker-maintenance-classification/)

[![Latest tracker version](https://img.shields.io/pypi/v/snowplow-tracker)](https://pypi.org/project/snowplow-tracker/)

[![Supported Python versions](https://img.shields.io/pypi/pyversions/snowplow-tracker)](https://pypi.org/project/snowplow-tracker/)

  
  
  
  
  
  

The Snowplow Python Tracker allows you to track Snowplow events from your Python apps and games.

The tracker should be straightforward to use if you are comfortable with Python development; any prior experience with Snowplow's [JavaScript Tracker](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-tracker/), Google Analytics or Mixpanel (which have similar APIs to Snowplow) is helpful but not necessary.

There are three basic types of objects you will create when using the Snowplow Python Tracker: subjects, emitters, and trackers.

A subject represents a user whose events are tracked. A tracker constructs events and sends them to one or more emitters. Each emitter then sends the event to the endpoint you configure. This will usually be a Snowplow collector, but could also be a Redis database or Celery task queue.
