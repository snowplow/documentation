---
title: "New in Signals: ML training datasets"
description: "The Signals Python SDK can now build a labelled ML training dataset in your warehouse from the attribute groups you already use for serving."
date: "2026-08-18"
update_type:
  - "Product news"
components:
  - "Signals"
  - "AI"
---
Teams already use Signals attributes as model inputs at inference time: retrieving a user's attributes, passing them to a deployed model, and acting on the score while the user is still in session.

Until today, training that model was the part you had to handle yourself. Building a training set meant rebuilding every attribute definition in the warehouse over historical events, then finding the moments worth predicting from and labelling each one. Any drift between that rebuild and what Signals computes live becomes training-serving skew: the model learns from one version of a feature and its real-time score is inferred from another.

Today we are announcing the Signals ML training dataset builder, which does that work for you. It is part of the Signals Python SDK and it runs on the attribute groups you already defined for serving. You tell it what outcome you want to predict, and it returns a labelled table in your warehouse, ready to train on.

## Key benefits

### Attributes as of the moment of prediction

Data leakage is a common reason models test well and then underperform once deployed. With the Signals dataset builder, every attribute is computed using only the events that came before the point you are predicting from, so nothing that happened afterwards can leak into training.

### Labels generated for you

You define the outcome you care about as goal criteria, for example a user completing a purchase or upgrading from a trial. Signals then scans the sessions in your training window and labels each one on whether that outcome happened.

### Your own labelled events, if you have them

If you already have a table of labelled events, you can point the dataset builder at that instead of having it generate the labels for you.

### Train on the history you already have

With Snowplow and Signals, there is nothing new to deploy and no new pipeline to build. The builder runs on the attribute groups already serving your application, and it computes their values from events you have already collected. You do not have to start logging feature history and wait for enough of it to accumulate before you can train. If the events are in your warehouse, the training data can be built now.

## Example use cases

The dataset builder fits where the outcome you are predicting is itself something the user does, and where most of your model's inputs come from behaviour rather than from warehouse tables.

* **Session purchase propensity.** Score intent to buy while the visitor is still browsing, and act on it in session.

* **Trial-to-paid conversion.** Predict which trial accounts will upgrade, from feature activation, breadth of product used and teammate invites.

* **Enquiry and booking intent.** Identify high-intent visitors on travel and marketplace sites from search refinement and listing behaviour.

* **Registration and paywall timing.** Choose the moment to prompt, based on what someone has consumed so far.

* **Content next-action propensity.** Predict the next play, save or share from the sequence of prior interactions.

## Getting started

The dataset builder is available to all Signals customers with a warehouse connection configured, at no additional cost. Upgrade to `snowplow-signals` v0.4.7 or later to get started.

Learn more in our documentation on [creating ML training datasets](/docs/signals/ml-training-datasets/). Our documentation also shares a runnable Google Colab notebook so you can see it in action, you only need to add your Signals credentials, and the finished dataset comes back as a pandas DataFrame ready to train on.
