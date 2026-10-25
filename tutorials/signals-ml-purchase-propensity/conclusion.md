---
title: "Conclusion"
position: 6
sidebar_label: "Conclusion"
description: "Summary of training and serving a purchase propensity model on Signals attributes, with next steps."
keywords: ["signals machine learning", "purchase propensity", "next steps"]
date: "2026-10-25"
---

In this tutorial you trained a purchase propensity model on Signals attributes and scored live sessions with it. The attribute group you published in the first step defined the features for both: the dataset builder computed its historical values for training, and Signals computes its live values for serving. Neither side needed its own feature code beyond the shared `features.py`.

## Next steps

To improve the model and use it in production:

* add features and compare the held-out metrics, for example user-level attributes keyed on `domain_userid` such as previous purchases, which the dataset builder joins to each anchor at the same point in time
* try other dataset options, such as `min_events` to skip the first few events of a session, or `max_negative_ratio` to change the balance of the dataset, described in [Create ML training datasets](/docs/signals/ml-training-datasets/)
* review or customize the generated SQL with `build_dataset_with_session_anchors()`, if you want to run the dataset build on your own schedule
* trigger actions without polling by using [interventions](/docs/signals/interventions/), for example when a session adds to cart
* follow the [prospect scoring](/tutorials/signals-ml-prospect-scoring/intro/) tutorial for a similar model on a marketing website
