---
title: "Conclusion"
position: 6
sidebar_label: "Conclusion"
description: "Summary of training and serving a purchase propensity model on Signals attributes, with next steps."
keywords: ["signals machine learning", "purchase propensity", "next steps"]
date: "2026-10-25"
---

<NotebookLinks path="snowplow/documentation/blob/main/static/notebooks/signals-ml-purchase-propensity.ipynb" />

In this tutorial you trained a purchase propensity model on Signals attributes and scored live sessions with it. Along the way you:

* Defined, tested, and published a `domain_sessionid` attribute group and service, with the Python SDK or an AI assistant
* Built a labeled, point-in-time correct training dataset in Snowflake from the published definition
* Trained a gradient-boosted model, and evaluated it on held-out sessions
* Served the model behind a `/predict` endpoint that reads the same attributes live from Signals

The published attribute group defined the features for both training and serving, so the only feature code you wrote was the shared `features.py`.

## Next steps

To improve the model and use it in production:

* Add features and compare the held-out metrics, for example user-level attributes keyed on `domain_userid` such as previous purchases, which the dataset builder joins to each anchor at the same point in time
* Try other dataset options, such as `min_events` to skip the first few events of a session, or `max_negative_ratio` to change the balance of the dataset, described in [Create ML training datasets](/docs/signals/ml-training-datasets/)
* Review or customize the generated SQL with `build_dataset_with_session_anchors()`, if you want to run the dataset build on your own schedule
* Trigger actions without polling by using [interventions](/docs/signals/interventions/), for example when a session adds to cart
* Follow the [prospect scoring](/tutorials/signals-ml-prospect-scoring/intro/) tutorial for a similar model on a marketing website
