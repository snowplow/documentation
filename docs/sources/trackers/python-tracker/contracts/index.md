---
title: "Contracts"
description: "Data contracts and validation in Python tracker for behavioral event structure integrity."
schema: "TechArticle"
keywords: ["Python Contracts", "Type Contracts", "Python Types", "Data Contracts", "Python Analytics", "Type Safety"]
sidebar_position: 70
---

Python is a dynamically typed language, but each of our methods expects its arguments to be of specific types and value ranges. To avoid wrong inputs, the tracker takes two approaches:

1. It specifies [type hints](https://docs.python.org/3/library/typing.html) on each function argument and return value. This allows IDEs to validate function calls in your code and also enables static type checking using tools such as [mypy](http://mypy-lang.org/). However, type violations do not result in runtime errors.
2. It validates expected value ranges during runtime and throws `ValueError` errors in case they are violated. Contracts are defined for arguments to check that they belong to expected value ranges such as:

```python
s = Subject()
tracker.set_platform("coffee") # throws ValueError because "coffee" is not one of supported platforms
tracker.set_screen_resolution(width=-1, height=-1) # throws ValueError because width and height arguments have to be greater than 0
```

You can turn off runtime contract validation like this:

```python
from snowplow_tracker import disable_contracts
disable_contracts()
```