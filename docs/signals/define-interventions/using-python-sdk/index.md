---
title: "Defining attributes using the Python SDK"
sidebar_position: 200
sidebar_label: "Using the Python SDK"
description: "Use the Snowplow Signals Python SDK to programmatically define attribute groups, services, and interventions via code."
---

The pages in this section describe how to use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) to define attribute groups, services, and interventions.

You must first deploy Signals using the self-serve process in Console, under the **Signals** section. After deployment, you'll have access to the Signals API URL needed for Python SDK usage.


---

## Defining interventions

All configuration is defined using the Signals Python SDK, as shown here, or the Signals API.

### Minimal example

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

### Options

The table below lists all available arguments for a `RuleIntervention`:

| Argument                | Description                                                                                                                                                                                                                                                                                                    | Type                                                                                                              | Required? |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| `name`                  | The unique name/identifier of the intervention                                                                                                                                                                                                                                                                 | `string`                                                                                                          | ✅         |
| `owner`                 | Email address for the owner of this intervention definition                                                                                                                                                                                                                                                    | `string`                                                                                                          | ✅         |
| `description`           | A human-readable description of the intervention                                                                                                                                                                                                                                                               | `string`                                                                                                          | ❌         |
| `version`               | A numeric version for this definition                                                                                                                                                                                                                                                                          | `integer`                                                                                                         | ❌         |
| `target_attribute_keys` | List of attribute key names to publish this intervention to. Any attribute keys in this list that have a value in the event that triggered the update will be targeted with the intervention. If not defined, defaults to the attribute keys associated with any attribute groups you reference in `criteria`. | `string[]`                                                                                                        | ❌         |
| `criteria`              | Tree of `Criterion` expressions to evaluate against attribute key attributes                                                                                                                                                                                                                                   | One of: `InterventionCriterion`, `InterventionCriteriaAll`, `InterventionCriteriaAny`, `InterventionCriteriaNone` | ✅         |

#### Evaluating attributes

The `criteria` tree defines the conditions that an attribute key's attributes should meet to be eligible for the intervention to trigger.

When a referenced attribute is updated, the updated and previous states are evaluated against the criteria; if the previous state did not meet the conditions but the newly updated state does, the trigger activates and the intervention gets published to the attribute keys that have a value and are defined in the `target_attributes_key` setting.
Criterion always refer to the latest published version of the attribute group that contained that attribute.

The simplest `criteria` tree takes an `InterventionCriterion` instance, with possible arguments:

| Argument    | Description                                                                | Type                                                                                                                        |
| ----------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `attribute` | The attribute group and attribute name (separate by a colon) to evaluate.  | `string`                                                                                                                    |
| `operator`  | The operator used to compare the `attribute` to the `value` (if required). | One of: `=`, `!=`, `<`, `>`, `<=`, `>=`, `like`, `not like`, `in`, `not in`, `rlike`, `not rlike`, `is null`, `is not null` |
| `value`     | If required by the `operator`, the comparison value.                       | `str`, `int`, `float`, `bool`, `list[str]`, `list[int]`, `list[float]`, `list[bool]` or `None`                              |

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

## Publishing interventions

Interventions can be published to current subscribers of any combination of attribute keys via the API -- or automatically published when attribute changes meet rules you set.

### Automatic stream-based interventions via Signals

You can define interventions with a set of rules to trigger them via the [Signals Python SDK](https://github.com/snowplow-incubator/snowplow-signals-sdk).

As the Signals streaming engine processes Snowplow events, it will calculate any attributes you have configured.
As the attribute values get updated, the streaming engine will evaluate the associated attribute key's attributes against the rules you have defined.
If the attributes match the rule conditions, the rest of your intervention definition gets published as an intervention targeting that attribute key.

Any users currently subscribed to interventions on their attribute keys will then receive the intervention, and your application can then react to it and perform actions.

### Custom intervention via the API

You can also publish custom interventions to any attribute keys you like at any time using the Signals SDK and API.
If the intervention is valid, it will immediately be published to any subscribers for the targeted attribute key IDs, which can then react and perform actions based on it.

```python
from snowplow_signals import AttributeKeyIdentifiers, InterventionInstance, Signals

# regular signals SDK authentication
sp_signals = Signals(
    api_url=SIGNALS_DEPLOYED_URL,
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,
    org_id=ORG_ID,
)

# attribute keys to publish the intervention to
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
