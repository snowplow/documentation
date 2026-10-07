---
title: "Evaluate decision models on past traffic"
sidebar_position: 40
sidebar_label: "Evaluate decision models"
description: "Replay a decision model call, such as a call to a System One model or an LLM prompt, on past sessions with a Signals dataset, and check its answers against what users did next."
keywords: ["System One models", "decision models", "offline evaluation", "Jev", "replay", "agentic context", "dataset builder"]
date: "2026-10-07"
---

A decision model answers a typed question about a state object, for example which panel a page should lead with, or whether a user is likely to buy in this session. System One models such as TypeSafe's Jev work this way, and so does an LLM prompt that returns one of a fixed set of answers. These models don't need training, so there is no training dataset to test them on before they go live.

A Signals dataset gives you that test set. It rebuilds the moments your application would have called the model, the attributes and agentic contexts it would have read at each moment, and what each user did next. You then ask the model at every moment and check its answers. Because the dataset is built from the same definitions that serve your application in real time, the states match what production sends, without later events leaking in.

Use an evaluation to:

- Check whether the call happens at moments where the model has enough to go on
- Compare versions of the state on the same moments, including what each version costs in input tokens
- Compare the model's stated probabilities with what users did, before a threshold depends on them
- Rerun the same test after you change the questions, the state, or the model

## Map your call to a dataset

Start from the call your application already makes. Each part of it maps to part of the dataset request:

| Part of the call | Dataset setting |
| --- | --- |
| When the application makes the call | The anchors. Use [user-supplied anchors](/docs/signals/datasets/anchors/index.md#user-supplied-anchors) from logs of past calls, [event anchors](/docs/signals/datasets/anchors/index.md#event-anchors) when the call responds to an event, or [trigger anchors](/docs/signals/datasets/anchors/index.md#trigger-anchors) when it responds to a condition over attributes. |
| The Signals data the state is built from | The attribute groups and the agentic contexts the application reads, passed as `attribute_groups` and `event_logs`. See [Add context and outcomes](/docs/signals/datasets/context-and-outcomes/index.md). |
| How the state is built | Your own state-building code, run over each dataset row instead of a live Signals response |
| What the decision is meant to predict or change | [Outcome columns](/docs/signals/datasets/context-and-outcomes/index.md#outcomes), such as a purchase later in the session |

If the state also uses data that Signals doesn't have, such as fields from your own database, add it as extra columns on user-supplied anchors, or note that it's missing from the evaluation.

## Evaluate with a coding agent

The Snowplow skills include an `evaluate-decision-context` skill that runs the whole evaluation from your coding agent. It reads your code to find the call, builds the dataset, renders each state with your own state-building code, asks the model, and writes a report. It asks before it creates warehouse tables or calls a model.

To add the Snowplow skills to Claude Code:

```bash
/plugin marketplace add snowplow/skills
/plugin install snowplow@snowplow
```

To add them to another agent:

```bash
npx plugins add snowplow/skills
```

Then point the agent at the call:

```txt
We call Jev on product pages in src/decide.ts. Test it on last month's traffic:
replay it at product views, check the answers against purchases later in the
session, and tell me whether the recent activity in the state is worth what it costs.
```

The skill reads your Signals credentials from `SIGNALS_API_URL`, `SIGNALS_API_KEY`, `SIGNALS_API_KEY_ID`, and `SIGNALS_ORG_ID`, and your model credentials from the environment. It supports Jev directly, and any other model through a command that reads states and returns answers. It keeps every request, state, and answer as files in a working directory, so you can rerun or review the evaluation later.

## Evaluate with the Python SDK

You can run the same steps yourself with the [Signals Python SDK](/docs/signals/connection/index.md). This example evaluates a call made on product views. It assumes a `decide(state)` function that makes your existing model call and returns the answer, and a `build_state(row)` function adapted from your application's state-building code.

```python
from datetime import datetime, timezone

import pandas as pd
from snowplow_signals import (
    AtomicProperty,
    Criteria,
    Criterion,
    DatasetOutcome,
    SessionSample,
    TrainingSpan,
    WarehouseTable,
)

product_view = Criteria(all=[Criterion.eq(AtomicProperty(name="event_name"), "product_view")])
purchase = Criteria(all=[Criterion.eq(AtomicProperty(name="event_name"), "transaction")])

run = sp_signals.submit_dataset_run_with_event_anchors(
    attribute_groups=[sp_signals.get_attribute_group(name="session_shopping")],
    event_logs=[sp_signals.get_event_log(name="recent_activity")],
    criteria=product_view,
    training_span=TrainingSpan(
        start_time=datetime(2026, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 1, 22, tzinfo=timezone.utc),
    ),
    max_per_session=2,
    pick="random",
    sample=SessionSample(max_sessions=3000, seed="eval-v1"),
    outcomes=[DatasetOutcome(name="purchased_later", criteria=purchase)],
    anchors_table=WarehouseTable(table="product_page_eval_anchors"),
    dataset_table=WarehouseTable(table="product_page_eval"),
)

# After the run succeeds
rows = sp_signals.get_dataset_run_preview(run.id, limit=10000).to_pandas()
rows["answer"] = [decide(build_state(row)) for row in rows.to_dict("records")]

# How often each answer was followed by a purchase, against the average
summary = rows.groupby("answer").purchased_later.agg(["mean", "size"])
summary["lift"] = summary["mean"] / rows.purchased_later.mean()
print(summary)
```

To compare a different version of the Signals data on the same moments, reuse the anchors table from the first run as user-supplied anchors and change only the context:

```python
run_v2 = sp_signals.submit_dataset_run_with_custom_anchors(
    attribute_groups=[sp_signals.get_attribute_group(name="session_shopping_v2")],
    anchors_table=WarehouseTable(table="product_page_eval_anchors"),
    has_label=False,
    event_logs=[sp_signals.get_event_log(name="recent_activity")],
    outcomes=[DatasetOutcome(name="purchased_later", criteria=purchase)],
    dataset_table=WarehouseTable(table="product_page_eval_v2"),
)
```

Changes to the questions, the model, or how the state is rendered from the same Signals data don't need a new dataset. Run `decide()` again on the same rows.

## Interpret the results

Outcomes record what users did next, not whether an answer was correct. A high purchase rate among users the model labeled as ready to buy is evidence that the answer means something, but a user can be ready to buy and still leave. Use outcomes to compare versions, and confirm the version you ship with an experiment in production.

When you compare versions, compare them on the same anchors, and treat small differences with caution. With rare outcomes, a difference can come from the sample alone. Estimate an interval, for example with a bootstrap over the rows, before you conclude that one version is better.

Compare the model's average predicted probability with the observed outcome rate. If they differ widely, correct the probability before your application acts on a threshold. A correction fitted on one period and checked on a later one shows whether it holds.

The dataset follows the same rules as the real-time engines, but it is a rebuild rather than a recording of production. Events that arrive at the same moment, values that change only with time, and data from outside Signals can differ from what your application read live.
