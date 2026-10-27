---
title: "Train and evaluate the model"
position: 4
sidebar_label: "Train the model"
description: "Train a gradient-boosted purchase propensity model on a Signals training dataset, evaluate it on held-out sessions, and save it for serving."
keywords: ["purchase propensity model", "gradient boosting", "scikit-learn", "model evaluation"]
date: "2026-10-25"
---

<NotebookLinks path="snowplow/documentation/blob/main/static/notebooks/signals-ml-purchase-propensity.ipynb" />

In this step you'll train a classifier on the dataset, check how well it ranks sessions it hasn't seen, and save it for the `/predict` endpoint.

## Share the feature preparation code

Put the code that turns attributes into model inputs in its own module, `features.py`. You'll import it here for training and again in the endpoint for serving. If you prepared features differently in the two places, the model would be scored on inputs it never trained on.

```python
# features.py
import pandas as pd

FEATURES = [
    "page_views",
    "product_views",
    "add_to_carts",
    "remove_from_carts",
    "checkout_steps",
    "minutes_in_session",
]
COUNTERS = [f for f in FEATURES if f != "minutes_in_session"]


def to_features(rows: pd.DataFrame) -> pd.DataFrame:
    """Turn Signals attribute values into model inputs."""
    X = rows.reindex(columns=FEATURES).astype("float64")
    X[COUNTERS] = X[COUNTERS].fillna(0)
    return X
```

`reindex` adds any missing column as null, so the function works for a single live session that's missing some attributes, as well as for the full training table.

## Split by session and train

Each session contributes several rows, one per anchor. Rows from the same session are very similar, so if some of them end up in training and others in the test set, the evaluation looks better than it is. Split by session instead, and hold out the most recent sessions so the test mimics scoring future traffic:

```python
from features import FEATURES, to_features

session_start = df.groupby("domain_sessionid")["anchor_ts"].transform("min")
cutoff = session_start.quantile(0.8)

train = df[session_start < cutoff]
test = df[session_start >= cutoff]

X_train, y_train = to_features(train), train["label"]
X_test, y_test = to_features(test), test["label"]
```

Train a gradient-boosted tree model. scikit-learn's `HistGradientBoostingClassifier` works well on tabular counts, needs no feature scaling, and accepts nulls, so `minutes_in_session` can stay empty when it's missing.

```python
from sklearn.ensemble import HistGradientBoostingClassifier

model = HistGradientBoostingClassifier(max_iter=300, learning_rate=0.05, random_state=42)
model.fit(X_train, y_train)
```

## Evaluate on held-out sessions

Measure how well the model ranks the held-out rows. ROC AUC is the probability that a random positive scores above a random negative, where `0.5` is chance. Average precision summarizes precision across all thresholds, and you compare it to the positive rate, which is what a model with no information would get.

```python
from sklearn.metrics import average_precision_score, roc_auc_score

scores = model.predict_proba(X_test)[:, 1]
print(f"ROC AUC:           {roc_auc_score(y_test, scores):.3f}")
print(f"Average precision: {average_precision_score(y_test, scores):.3f}")
print(f"Positive rate:     {y_test.mean():.3f}")
```

With the sample data, expect a ROC AUC of about `0.87` and an average precision of about `0.60`, against a positive rate of about `0.16`. With your own data, the values depend on your site and the window. If the results are close to chance, check the number of purchasing sessions in the window, as described in [Build the dataset](../build-training-dataset/#build-the-dataset), and that the ecommerce event version in your attributes matches your tracking.

### Interpret the scores

The dataset builder keeps at most five negative rows for every positive one, which is far more positives than real traffic has. The model's output is therefore a ranking score, not the true probability that a session buys. Two sessions can be compared by score, and a threshold can be chosen from the held-out data, but a score of `0.4` doesn't mean a 40% chance of purchase.

To pick a threshold, look at the precision and recall at different cutoffs on the test set, and choose the trade-off that suits what you'll do with the score:

```python
from sklearn.metrics import precision_recall_curve

precision, recall, thresholds = precision_recall_curve(y_test, scores)
```

## Save the model

Train the final model on all the rows, so it learns from the most recent sessions as well, and save it:

```python
import joblib

final_model = HistGradientBoostingClassifier(max_iter=300, learning_rate=0.05, random_state=42)
final_model.fit(to_features(df), df["label"])
joblib.dump(final_model, "propensity_model.joblib")
```

To retrain later, submit a new dataset run with a more recent training window and repeat this step. Keep the attribute group definition the same, or publish a new version of it, so that the live attributes always match what the model was trained on.
