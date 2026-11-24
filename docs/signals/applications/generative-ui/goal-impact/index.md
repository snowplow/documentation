---
title: "Measure the goal impact of Signals GenUI surfaces"
sidebar_position: 35
sidebar_label: "Goal impact"
description: "See how often sessions reached a goal, such as adding a product to the bag, depending on which of a Signals GenUI surface's components they saw."
keywords: ["signals genui", "goal impact", "generative ui", "component mix", "goal rate"]
date: "2026-11-24"
---

The **Goal impact** tab of a surface in Console shows how often sessions reached a goal, such as adding a product to the bag, depending on which of the surface's components they saw.

Goal impact reads your events through your [Signals warehouse connection](/docs/signals/setup/index.md). It only has results for surfaces rendered with `useJsonRenderSurface`, since the other hooks don't track what the user saw.

This page reads an example report for the `pdp_purchase_assist` surface from the [quickstart](/docs/signals/applications/generative-ui/quickstart/index.md), the block under **Add to bag** on a product page. The model composes it from three components: `ShippingInfo`, `ReviewHighlight`, which it shows once the user has read the page for about 20 seconds, and `FitGuide`. The numbers are an example.

## Choose a goal

On the surface's **Goal impact** tab, choose the **Goal event**: here, adding a product to the bag. To count only some of those events, select **Add a condition**.

Choose a **Period**, here **Last 30 days**. If the model wraps every block in a layout component, such as a root `Stack`, add it to **Exclude components** so it doesn't appear in every row. Then select **Show impact**.

## Read the totals

The totals cover every session that saw the surface in the period. A goal only counts when it came after the surface first rendered in the session.

| Sessions that saw the surface | Reached the goal | Goal events | Average goal rate |
| --- | --- | --- | --- |
| 12,400 | 1,116 | 1,450 | 9.0% |

Of the 12,400 sessions that saw the block, 1,116 went on to add a product to the bag, some of them more than once. The average goal rate, 9.0%, is the baseline for every row below.

## Compare component mixes

The first table puts each session in one row, by the set of components it saw: its *mix*.

| Visible components | Sessions | Reached goal | Goal rate | Goal events | vs average |
| --- | --- | --- | --- | --- | --- |
| `ShippingInfo` | 5,200 | 364 | 7.0% | 470 | −2.0 pts |
| `ReviewHighlight` `ShippingInfo` | 3,100 | 341 | 11.0% | 440 | +2.0 pts |
| `FitGuide` `ReviewHighlight` `ShippingInfo` | 1,800 | 252 | 14.0% | 330 | +5.0 pts |
| Nothing shown | 1,700 | 85 | 5.0% | 120 | −4.0 pts |
| 6 other mixes | 600 | 74 | 12.3% | 90 | +3.3 pts |

Most sessions saw only `ShippingInfo`, and reached the goal less often than average. Sessions that also saw `ReviewHighlight` did better, and those that saw all three components reached the goal at 14.0%, five points above average. **Nothing shown** is the sessions where the model chose to show nothing, or only excluded components. Mixes seen in fewer than 100 sessions are grouped in the last row.

## Look at each component

The second table shows each component on its own. A session counts under every component it saw, so the sessions add up to more than the total.

| Component | Sessions where visible | Goal rate | Revealed later | Median time to reveal |
| --- | --- | --- | --- | --- |
| `ShippingInfo` | 10,500 | 9.6% | 0% | |
| `ReviewHighlight` | 5,200 | 12.3% | 68% | 24 s |
| `FitGuide` | 2,000 | 14.1% | 35% | 41 s |

**Revealed later** shows how often a component appeared after the generated UI first rendered, once the user's [live values](/docs/signals/applications/generative-ui/frameworks/index.md) met its condition. `ShippingInfo` was always there from the start. `ReviewHighlight` was revealed later in about two thirds of the generated UIs that showed it, a median of 24 seconds after the first render, which matches its rule of about 20 seconds of reading. The rest of the time, the user had already read long enough when the block was generated.

## Choose which generated UIs get the credit

A session often sees several generated UIs, one on each product page it visits. **Credit goes to** sets which of them count, in both tables:

| Option | Components that count |
| --- | --- |
| **Every render seen** | Every component the session saw before it first reached the goal, or in the whole session if it never did. Generated UIs on different pages combine into one mix. |
| **Last render seen** | Only the components of the last generated UI the session saw before it first reached the goal, or of its last one if it never did |

Suppose a user saw `FitGuide` on a jacket's page, then added a T-shirt to the bag from a page that showed only `ShippingInfo`. With **Every render seen**, their session counts under the mix with `FitGuide`. With **Last render seen**, it counts under `ShippingInfo` alone. Switching between the two doesn't read your warehouse again.

## What a goal rate tells you

The model chooses what to show from each user's behavior, so the sessions in one row behave differently from those in another. In the example, the model shows `FitGuide` to users who are already reading the page closely, and those users may have added to the bag without it. A goal rate shows which components came before the goal, not that they caused it.

A component counts as seen once it's on the page, whether or not the user scrolled to it.
