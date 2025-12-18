---
title: "Contracts"
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

## Contracts in tracker version 0.9.1

Earlier versions of the tracker up to v0.9.1 used the [PyContracts](http://andreacensi.github.io/contracts/) library to validate argument types and value ranges. In contrast with the latest versions, pycontracts was also used to validate argument types, raising `ContractNotRespected` errors at runtime when passing values with wrong types (this behavior was dropped in favor of type hints in Python 3):

```python
s = Subject()
tracker.set_color_depth("walrus")
```

```python
contracts.interface.ContractNotRespected: Breach for argument 'depth' to Subject:set_color_depth().
Expected type 'int', got 'str'.
checking: Int      for value: Instance of str: 'walrus'
checking: $(Int)   for value: Instance of str: 'walrus'
checking: int      for value: Instance of str: 'walrus'
Variables bound in inner context:
- self: Instance of Tracker: <snowplow_tracker.tracker.Tracker object...> [clip]
```

If your value is of the wrong type, convert it before passing it into the `track...()` method, for example:

```python
level_idx = 42
tracker.track_screen_view("Game Level", str(level_idx))
```

You can turn off type checking to improve performance like this:

```python
from snowplow_tracker import disable_contracts
disable_contracts()
```
