---
title: "Using the recovery builder to design your recovery"
date: "2021-10-13"
sidebar_label: "Recovery builder"
sidebar_position: 0
sidebar_custom_props:
  offerings:
    - bdp
---

### What is the recovery builder?

The recovery builder is a Console based tool that guides you through building a recovery design so that we can recover your data for you.

:::note This feature is in beta release

This feature is currently in early beta an only available to customers selected for this phase. If you are interested in early access, please contact your Customer Success Manager.

:::

### When should I use the recovery builder?

Before you think about a recovery you'll want to ensure you have diagnosed and fixed the problem which is causing the events to fail process.

:::note Recovery builder limitations

recovery builder has some limitations which means it cannot design for certain recovery scenarios.

These include:

- The name of my attribute is wrong (e.g. there is a typo)
- I need to add an attribute:value pairing into my event
- I need to change the version of an entity I am sending my data against

For these recoveries please log a Support ticket.

:::

### Do I need to share my data with you?

One of Snowplow's featues is that your data lives in your private cloud and we don't have access to it. The recovery builder respects this data privacy boundary.

To use it you will paste in or upload some of your raw data but this will never be stored or sent over the internet, everything happens locally in your browser.
