---
title: Training Data
position: 4
---

In order for the AWS Personalize model to serve usable results, we need to give it some initial training on our actual store.
Out of the box Personalize will have no idea about our customers or products, let alone the relationships between them and what makes a good recommendation.

To solve this "cold start" problem, we need to export our catalog information for AWs Personalize to read, and give it an initial training dataset of interactions for it to build a model off of.