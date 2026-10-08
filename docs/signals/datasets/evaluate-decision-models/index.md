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

- Find answers that overlap, where the model often splits its probability between the same two answers
- Find answers the model gives with low confidence, and what the states behind them have in common
- Check what users did after each answer, such as buying or adding to cart
- Rerun the same checks after you change the questions, the state, or the Signals data behind it

## Map your call to a dataset

Start from the call your application already makes. Each part of it maps to part of the dataset request:

| Part of the call | Dataset setting |
| --- | --- |
| When the application makes the call | The anchors. Use [user-supplied anchors](/docs/signals/datasets/anchors/index.md#user-supplied-anchors) from logs of past calls, [event anchors](/docs/signals/datasets/anchors/index.md#event-anchors) when the call responds to an event, or [trigger anchors](/docs/signals/datasets/anchors/index.md#trigger-anchors) when it responds to a condition over attributes. |
| The Signals data the state is built from | The attribute groups and the agentic contexts the application reads, passed as `attribute_groups` and `agentic_contexts`. See [Add context and outcomes](/docs/signals/datasets/context-and-outcomes/index.md). |
| How the state is built | Your own state-building code, run over each dataset row instead of a live Signals response |
| What the decision is meant to predict or change | [Outcome columns](/docs/signals/datasets/context-and-outcomes/index.md#outcomes), such as a purchase later in the session |

If the state also uses data that Signals doesn't have, such as fields from your own database, add it as extra columns on user-supplied anchors, or note that it's missing from the evaluation.

## Evaluate with a coding agent

The Snowplow skills include an `evaluate-decision-context` skill that runs the whole evaluation from your coding agent. It reads your code to find the call, builds the dataset, renders each state with your own state-building code, asks the model, runs the checks described in [Interpret the results](#interpret-the-results), and writes a report. It asks before it creates warehouse tables or calls a model.

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
We call Jev on product pages in src/decide.ts to tag each visitor's shopping
intent. Test it on last month's traffic: replay it at product views, tell me
which answers overlap or come back unsure, and check them against what
visitors did next.
```

The skill reads your Signals credentials from `SIGNALS_API_URL`, `SIGNALS_API_KEY`, `SIGNALS_API_KEY_ID`, and `SIGNALS_ORG_ID`, and your model credentials from the environment. It supports Jev directly, and any other model through a command that reads states and returns answers. It keeps every request, state, and answer as files in a working directory, so you can rerun or review the evaluation later.

## Evaluate with the Python SDK

You can run the same steps yourself with the [Signals Python SDK](/docs/signals/connection/index.md). This example evaluates a call made on product views that asks which shopping intent a visitor has. It assumes two functions:

- `decide(state)` makes your existing model call and returns a dictionary with the chosen `answer`, its `confidence`, and the `probabilities` of every allowed answer
- `build_state(row)` is adapted from your application's state-building code, and builds the state from a dataset row

```python
from datetime import datetime, timezone

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
add_to_cart = Criteria(all=[Criterion.eq(AtomicProperty(name="event_name"), "add_to_cart")])

run = sp_signals.submit_dataset_run_with_event_anchors(
    attribute_groups=[sp_signals.get_attribute_group(name="session_shopping")],
    agentic_contexts=[sp_signals.get_event_log(name="recent_activity")],
    criteria=product_view,
    training_span=TrainingSpan(
        start_time=datetime(2026, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 1, 22, tzinfo=timezone.utc),
    ),
    max_per_session=1,
    pick="random",
    sample=SessionSample(max_sessions=5000, seed="eval-v1"),
    outcomes=[
        DatasetOutcome(name="purchased_later", criteria=purchase),
        DatasetOutcome(name="added_to_cart_within_10m", criteria=add_to_cart, within_seconds=600),
    ],
    anchors_table=WarehouseTable(table="intent_eval_anchors"),
    dataset_table=WarehouseTable(table="intent_eval"),
)
```

After the run succeeds, ask the model at every moment and run the three checks:

```python
rows = sp_signals.get_dataset_run_preview(run.id, limit=10000).to_pandas()
results = [decide(build_state(row)) for row in rows.to_dict("records")]

rows["answer"] = [r["answer"] for r in results]
rows["confidence"] = [r["confidence"] for r in results]
ranked = [sorted(r["probabilities"].items(), key=lambda kv: kv[1], reverse=True) for r in results]
rows["runner_up"] = [r[1][0] for r in ranked]
rows["gap"] = [r[0][1] - r[1][1] for r in ranked]

# Overlap: pairs of answers that are often close calls
close_calls = rows[rows.gap < 0.4]
print(close_calls.groupby(["answer", "runner_up"]).size().sort_values(ascending=False))

# Confidence: how sure the model is about each answer
print(rows.groupby("answer").confidence.agg(median="median", unsure=lambda c: (c < 0.6).mean()))

# Outcomes: what users did after each answer, against the average
outcomes = ["purchased_later", "added_to_cart_within_10m"]
print(rows.groupby("answer")[outcomes].mean())
print(rows[outcomes].mean())
```

A change to the questions or to how the state is built from the same Signals data doesn't need a new dataset. Call `decide()` again on the same rows.

To change the Signals data, for example to add an attribute or change what an agentic context keeps, reuse the anchors table from the first run as user-supplied anchors and change only the context. The new dataset has the same moments, so the results are directly comparable:

```python
run_v2 = sp_signals.submit_dataset_run_with_custom_anchors(
    attribute_groups=[sp_signals.get_attribute_group(name="session_shopping_v2")],
    anchors_table=WarehouseTable(table="intent_eval_anchors"),
    agentic_contexts=[sp_signals.get_event_log(name="recent_activity_v2")],
    outcomes=[
        DatasetOutcome(name="purchased_later", criteria=purchase),
        DatasetOutcome(name="added_to_cart_within_10m", criteria=add_to_cart, within_seconds=600),
    ],
    dataset_table=WarehouseTable(table="intent_eval_v2"),
    has_label=False,
)
```

## Interpret the results

Each check points to a different kind of change. Change one thing at a time and rerun on the same moments, so that each comparison shows what that change did.

### Overlapping answers

Two answers overlap when the model often gives one with the other close behind. An answer that the model rarely picks, and picks with low confidence, usually describes the same users as another answer. Merge the answers, or rewrite their criteria so they describe something the state can show. For example, an answer for comparing products and an answer for researching products both describe a user reading product pages, and the state may have nothing that separates them.

### Low confidence

When the model is unsure about one answer, read a sample of the states behind it. The cause is usually one of these:

1. **Missing data.** The state doesn't contain what the answer depends on, such as visits to a sale section. Add an attribute or change the agentic context, then rebuild the context on the same anchors.
2. **Noisy data.** The state contains entries that look relevant but aren't, such as promotion impressions with no promotion name. Change the agentic context or how the state is built.
3. **An ambiguous definition.** The state has the data, but the criteria don't say how to treat it, such as whether a single sale page visit counts as looking for a bargain. Rewrite the criteria. Outcomes can help you choose: compare what users with and without that behavior did next.

### Outcomes

Outcomes record what users did next, not whether an answer was correct. A high purchase rate among users the model labeled as ready to buy is evidence that the answer means something, but a user can be ready to buy and still leave. An answer the model gives confidently can still be followed by the same behavior as the average, so check the outcomes before you build an action on an answer. Confirm the version you ship with an experiment in production.

With rare outcomes, a difference between answers or versions can come from the sample alone. Estimate an interval, for example with a bootstrap over the rows, before you conclude that one version is better.

For yes/no questions, compare the model's average predicted probability with the observed outcome rate. If they differ widely, correct the probability before your application acts on a threshold.

The dataset follows the same rules as the real-time engines, but it is a rebuild rather than a recording of production. Events that arrive at the same moment, values that change only with time, and data from outside Signals can differ from what your application read live.
