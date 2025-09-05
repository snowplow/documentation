---
title: "Defining Rule-based Interventions"
sidebar_position: 70
sidebar_label: "Interventions"
---

Interventions are opportunities to take actions to improve user outcomes.
Your applications or end-user devices can subscribe to interventions intended for their current attribute keys, and respond to them once they trigger.

You can publish interventions from your own applications at any time, or the Signals streaming engine itself can publish them when it updates attributes and the new attributes match certain rules; this can save you having to consume the event stream yourself when you want interventions to fire in simple situations.

To configure a rule-based intervention, you will need to define an intervention, and the set of rules to determine if it should trigger or not.

The rule syntax is similar to that used for defining attribute group event filter criteria.

All configuration is defined using the Signals Python SDK.

## Minimal example

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
```

Once applied and active, this intervention will trigger the first time Signals processes an event that first sets the `example_group` attribute group's `test_attribute` attribute to a value that is not null (e.g. the first time it gets set).

## Options

The table below lists all available arguments for a `RuleIntervention`:

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The unique name/identifier of the intervention | `string` | ✅ |
| `owner` | Email address for the owner of this intervention definition | `string` | ✅ |
| `description` | A human-readable description of the intervention | `string` | ❌ |
| `tags` | Metadata for the intervention, as a dictionary | `object` | ❌ |
| `version` | A numeric version for this definition | `integer` | ❌ |
| `target_attribute_keys` | List of attribute key names to publish this intervention to. Any attribute keys in this list that have a value in the event that triggered the update will be targeted with the intervention. If not defined, defaults to the attribute keys associated with any attribute groups you reference in `criteria`. | `string[]` | ❌ |
| `criteria` | Tree of `Criterion` expressions to evaluate against attribute key attributes | One of: `InterventionCriterion`, `InterventionCriteriaAll`, `InterventionCriteriaAny`, `InterventionCriteriaNone` | ✅ |

### Evaluating attributes

The `criteria` tree defines the conditions that an attribute key's attributes should meet to be eligible for the intervention to trigger.

When a referenced attribute is updated, the updated and previous states are evaluated against the criteria; if the previous state did not meet the conditions but the newly updated state does, the trigger activates and the intervention gets published to the attribute keys that have a value and are defined in the `target_attributes_key` setting.
Criterion always refer to the latest published version of the attribute group that contained that attribute.

The simplest `criteria` tree takes an `InterventionCriterion` instance, with possible arguments:

| Argument | Description | Type |
| --- | --- | --- |
| `attribute` | The attribute group and attribute name (separate by a colon) to evaluate. | `string` |
| `operator` | The operator used to compare the `attribute` to the `value` (if required). | One of: `=`, `!=`, `<`, `>`, `<=`, `>=`, `like`, `not like`, `in`, `not in`, `rlike`, `not rlike`, `is null`, `is not null` |
| `value` | If required by the `operator`, the comparison value. | `str`, `int`, `float`, `bool`, `list[str]`, `list[int]`, `list[float]`, `list[bool]` or `None` |

For more complex conditions, `criteria` also accepts `InterventionCriteriaAll`, `InterventionCriteriaAny`, and `InterventionCriteriaNone`.
You can use these classes to combine multiple criteria as lists with the following parameters:

| Argument | Description | Parameters |
| --- | --- | --- |
| `InterventionCriteriaAll` | Logically AND all the inner criteria. Only trigger if all the nested criteria are also true/triggered. | `all`: list of nested `criteria` |
| `InterventionCriteriaAny` | Logically OR all the inner criteria. Only trigger if at least one of the nested criteria are true/triggered. | `any`: list of nested `criteria` |
| `InterventionCriteriaNone` | Logically NOR all the inner criteria. Only trigger if all of the nested criteria are false/untriggered. | `none`: list of nested `criteria` |

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
