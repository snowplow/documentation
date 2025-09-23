---
title: "Defining interventions using the Python SDK"
sidebar_position: 200
sidebar_label: "Using the Python SDK"
description: "Use the Snowplow Signals Python SDK to programmatically define interventions via code."
---

To use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) to define interventions, start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` object. You'll need this connection to publish interventions.

There are two ways to define an intervention using the SDK or API:
* Rule-based interventions (default)
* Direct interventions

## Rule-based interventions

Rule-based interventions are triggered automatically when their criteria are met. They use `RuleIntervention` objects, and are published to Signals using `publish`, similar to other configuration objects.

This is the minimum configuration needed to create an intervention definition:

```python
from snowplow_signals import RuleIntervention, InterventionCriterion

hello_intervention = RuleIntervention(
    name="say_hello",
    owner="me@example.com",
    criteria=InterventionCriterion(
        attribute="example_group:test_attribute",
        operator="is not null",
    ),
)

sp_signals.publish([hello_intervention])
```

Once applied and active, this intervention will trigger the first time Signals processes an event that first sets the `example_group` attribute group's `test_attribute` attribute to a value that is not null (e.g. the first time it gets set).

### Options

The table below lists all available arguments for a `RuleIntervention`:

| Argument                | Description                                                                                                                                                                   | Type                                                                                                              | Required? |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| `name`                  | The unique name/identifier of the intervention                                                                                                                                | `string`                                                                                                          | ✅         |
| `owner`                 | Email address for the owner of this intervention definition                                                                                                                   | `string`                                                                                                          | ✅         |
| `description`           | A human-readable description of the intervention                                                                                                                              | `string`                                                                                                          | ❌         |
| `version`               | A numeric version for this definition                                                                                                                                         | `integer`                                                                                                         | ❌         |
| `target_attribute_keys` | List of attribute key names to publish this intervention to. If not defined, defaults to the attribute keys associated with any attribute groups you reference in `criteria`. | `string[]`                                                                                                        | ❌         |
| `criteria`              | Tree of `Criterion` expressions to evaluate against attribute key attributes                                                                                                  | One of: `InterventionCriterion`, `InterventionCriteriaAll`, `InterventionCriteriaAny`, `InterventionCriteriaNone` | ✅         |

### Evaluating attributes with criteria

The `criteria` tree defines the conditions that an attribute key's attributes should meet to be eligible for the intervention to trigger.

When a referenced attribute is updated, the updated and previous states are evaluated against the criteria. If the previous state did not meet the conditions but the newly updated state does, the trigger activates and the intervention gets published to the attribute keys that have a value and are defined in the `target_attributes_key` setting.
Criterion always refer to the latest published version of the attribute group that contained that attribute.

The simplest `criteria` tree takes an `InterventionCriterion` instance, with possible arguments:

| Argument    | Description                                                              | Type                                                                                           |
| ----------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `attribute` | The attribute group and attribute name to evaluate, separated by a colon | `string`                                                                                       |
| `operator`  | The operator used for evaluating the attribute                           | `str`, see table below                                                                         |
| `value`     | If required by the `operator`, the comparison value                      | `str`, `int`, `float`, `bool`, `list[str]`, `list[int]`, `list[float]`, `list[bool]` or `None` |

This table shows the available operators:

| Operator      | Description                 | Value is required? |
| ------------- | --------------------------- | ------------------ |
| `=`           | Equals                      | ✅                  |
| `!=`          | Not equals                  | ✅                  |
| `<`           | Less than                   | ✅                  |
| `>`           | Greater than                | ✅                  |
| `<=`          | Less than or equal          | ✅                  |
| `>=`          | Greater than or equal       | ✅                  |
| `like`        | Pattern matching (SQL LIKE) | ✅                  |
| `not like`    | Pattern not matching        | ✅                  |
| `rlike`       | Regex pattern matching      | ✅                  |
| `not rlike`   | Regex not matching          | ✅                  |
| `in`          | Value in list               | ✅ (list)           |
| `not in`      | Value not in list           | ✅ (list)           |
| `is null`     | Value is null/empty         | ❌                  |
| `is not null` | Value exists                | ❌                  |

For more complex conditions, `criteria` also accepts `InterventionCriteriaAll`, `InterventionCriteriaAny`, and `InterventionCriteriaNone`.
You can use these classes to combine multiple criteria as lists with the following parameters:

| Argument                   | Description                                                                                                  | Parameters                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `InterventionCriteriaAll`  | Logically AND all the inner criteria. Only trigger if all the nested criteria are also true/triggered.       | `all`: list of nested `criteria`  |
| `InterventionCriteriaAny`  | Logically OR all the inner criteria. Only trigger if at least one of the nested criteria are true/triggered. | `any`: list of nested `criteria`  |
| `InterventionCriteriaNone` | Logically NOR all the inner criteria. Only trigger if all of the nested criteria are false/untriggered.      | `none`: list of nested `criteria` |

These support nesting, so you can create complex conditions if required:

```python
from snowplow_signals import (
    RuleIntervention,
    InterventionCriterion,
    InterventionCriteriaAll,
    InterventionCriteriaAny,
    InterventionCriteriaNone,
)

criteria = InterventionCriteriaAll(all=[
    InterventionCriterion(attribute="mygroup:pageview_count", operator=">=", value=3),
    InterventionCriteriaAny(any=[...]),
    InterventionCriteriaNone(none=[...]),
])
```

### Extended example

This example shows how to use criteria:

```python
from snowplow_signals import (
    RuleIntervention,
    InterventionCriterion,
    InterventionCriteriaAll,
)

cart_abandonment = RuleIntervention(
    name="cart_abandonment_discount",
    owner="marketing@company.com",
    description="Offer discount when high-value cart is abandoned",
    criteria=InterventionCriteriaAll(all=[
        InterventionCriterion(
            attribute="shopping:cart_value",
            operator=">",
            value=75.00
        ),
        InterventionCriterion(
            attribute="shopping:minutes_since_last_activity",
            operator=">=",
            value=15
        ),
    ]),
    target_attribute_keys=["domain_userid"]  # Target individual users
)

sp_signals.publish([cart_abandonment])
```

It will trigger based on attribute changes within the `shopping` attribute group, but only if all conditions are met.

## Direct interventions

Direct interventions have no criteria, and are not tied to attribute values. They use `InterventionInstance` objects, and are pushed to Signals using `push_intervention`, rather than being published like other configuration objects.

You can directly push these interventions to any attribute keys using the Signals Python SDK or API. If the intervention is valid, Signals will immediately push it to any subscribers for the targeted attribute key IDs.

```python
from snowplow_signals import AttributeKeyIdentifiers, InterventionInstance, Signals

# The specific attribute key IDs to publish the intervention to
targets = AttributeKeyIdentifiers({
  "domain_sessionid": ["8c9104e3-c300-4b20-82f2-93b7fa0b8feb"],
})

sp_signals.push_intervention(
  targets,
  InterventionInstance(
    name="my_intervention",
    version=1,
  )
)
```

## Versioning

Use `version=1` for the first version of an intervention. After publishing, if you want to change the definition in any way, iterate the version number.
