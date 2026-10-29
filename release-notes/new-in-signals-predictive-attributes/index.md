---
title: "New in Signals: predictive attributes"
description: "Train a model on the history of your stream attributes, using event data in your Snowflake warehouse, and score how likely each session is to reach a goal in real time."
sidebar_label: "Signals predictive attributes"
keywords: ["predictive attributes", "propensity score", "machine learning", "conversion prediction", "Signals", "Snowflake"]
date: "2026-10-26"
category:
  - "Product news"
components:
  - "Signals"
platforms:
  - "Snowflake"
---
Stream attributes tell you what a user has done in a session: how many products they've viewed, what they added to their cart, how long since their last search. Deciding what that means for the session's outcome has meant writing rules by hand, such as "three product views and an add to cart", and guessing at the thresholds.

A predictive attribute replaces the guess with a model. You define a goal, such as a `transaction` event, and choose the stream attributes that describe the behavior leading up to it. Signals trains a model on your event history, then scores live sessions from the current values of those attributes. The score is a number between 0 and 1 for how likely the session is to reach the goal.

## Key benefits

**Trained on your own data.** Signals builds the training dataset in your Snowflake warehouse, from the same attribute definitions it uses to score live sessions. For each training example, it calculates the attribute values as they were at that moment, so the model learns from the same view of a session that it sees when scoring.

**Scored on request.** Signals calculates the score when your application asks for it, from the most recent attribute values Signals has calculated for the session.

**Session and user inputs together.** Inputs can come from attribute groups with different attribute keys, so one model can combine what a user is doing in this session with what they've done before.

**Quality you can check.** Each training reports its AUC, top-decile lift, baseline goal rate, Brier score, and the importance of each input attribute. You can compare trainings, publish the one you want, and roll back to an earlier one.

## Example use cases

**Targeted offers.** Show a discount only to sessions with a low purchase score, rather than to everyone who reaches the cart.

**Prioritized support.** Route high-intent sessions to live chat first.

**Returning users.** Score users when they come back, and use the score to decide whether to include them in a campaign.

## How to use predictive attributes

Define, train, and publish predictive attributes in Console or with the Signals Python SDK. Score them from your application with the Python SDK, the Node.js SDK, or the Signals API. Training requires a Snowflake warehouse connection.

See [Define predictive attributes](/docs/signals/predictive-attributes/) to create and train one, and [Retrieve predictive attribute scores](/docs/signals/applications/predictive-attributes/) to use the score in your application.
