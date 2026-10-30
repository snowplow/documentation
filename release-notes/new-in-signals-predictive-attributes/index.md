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
Signals shows you what your users are doing in real time: the products they've viewed, what's in their cart, how long since their last search. Knowing what they'll do next, such as whether this session ends in a purchase, has meant building a propensity model yourself, along with the pipeline to train and serve it.

Predictive attributes give you that prediction as a score. You define a goal, such as a purchase, and choose the user behavior the model learns from, such as product views and cart additions. Signals trains a model on your own event history, then scores a session whenever your application asks, while the user is still on your site. The score is a number between 0 and 1 for how likely the session is to reach the goal.

## Key benefits

**Trained on your own data.** Signals builds the training dataset in your Snowflake warehouse, from the same attribute definitions it uses to score live sessions. For each training example, it calculates point-in-time correct attribute values, so the features the model scores are calculated the same way as the features it trained on.

**Scored on request.** Signals calculates the score when your application asks for it, from the most recent attribute values Signals has calculated for the session.

**Session and user behavior together.** One model can combine what a user is doing in this session with what they've done in earlier sessions.

**Quality you can check.** Each training reports its AUC, top-decile lift, baseline goal rate, Brier score, and how much each input contributed. You can compare trainings, publish the one you want, and roll back to an earlier one.

## Example use cases

**Targeted offers.** Show a discount only to sessions with a low purchase score, rather than to everyone who reaches the cart.

**Prioritized support.** Route high-intent sessions to live chat first.

**Returning users.** Score users when they come back, and use the score to decide whether to include them in a campaign.

## How to use predictive attributes

Define, train, and publish predictive attributes in Console or with the Signals Python SDK. Score them from your application with the Python SDK, the Node.js SDK, or the Signals API. Training requires a Snowflake warehouse connection.

See [Define predictive attributes](/docs/signals/predictive-attributes/) to create and train one, and [Retrieve predictive attribute scores](/docs/signals/applications/predictive-attributes/) to use the score in your application.
