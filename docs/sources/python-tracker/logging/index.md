---
title: "Emitter logs in the Python tracker"
sidebar_label: "Logging"
date: "2020-02-26"
sidebar_position: 80
description: "Configure Python logging levels for the tracker emitters module to control debug, info, and error message output."
keywords: ["python logging", "tracker debug", "log levels"]
---

The emitters.py module has Python logging turned to give you information about requests being sent. The logger prints messages about what emitters are doing. By default, only messages with priority "INFO" or higher will be logged.

To change this:

```python
from snowplow_tracker import logger

# Log all messages, even DEBUG messages
logger.setLevel(10)

# Log only messages with priority WARN or higher
logger.setLevel(30)

# Turn off all logging
logger.setLevel(60)
```
