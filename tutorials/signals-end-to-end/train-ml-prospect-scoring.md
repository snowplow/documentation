---
title: Train ML Prospect Scoring Model
position: 4
---

### ML Model Overview

As prospects browse the website, Signals will calculate the aggregated attributes.
We want to score the combination of these attributes using an ML model to better understand if a specific prospect is likely to submit a form.

Here's our prediction structure and timeline:

![](./screenshots/prediction-structure.png)

We will prepare historical data resembling the same Signals features and train an XGBoost model on top.

### Prepare Historical Atomic Data for Training

Navigate to "Prepare Historical Data" section in the Colab.
It has the SQL required to prepare a relevant training dataset.

Double-check that your `ATOMIC_TABLE` variable points to your Snowflake Atomic table.

```python
ATOMIC_TABLE = "snowplow_tracker_db.atomic.events"
```

Now read through the `query` variable to understand the SQL data preparation query.

:::info
If you use a different warehouse, adjust the code here to pull data from it into a pandas DataFrame.
:::

:::caution Warning
The default SQL expects that you have `submit_form` events.
If there are no `submit_form` events in your dataset, adjust SQL to use other event as the target in the `target_had_submit_form_next1h` column.
:::

### Best Practices For Atomic Events Training Datasets

1. Make sure that key behaviours you want to use for predictions are properly captured via events.
2. Choose a subset of `domain_userid`s (or your other entities depending on the prediction point) that will be included in training.
3. Filter Atomic events for a subset of entities that you defined as eligible for training.
4. Choose historical training time periods that allow your `domain_userid`s (or other entities) to reach the target.
    * Let's say you expect your `domain_userid` to convert in 7 days. Then choose `domain_userid`s who first appeared between 90d and 30d ago, and set a cutoff of 7d for them to convert. Don't just choose the last 30 days, as a `domain_userid` who appeared yesterday wouldn't have enough time to reach the cutoff date.
    * Or if you're trying to predict churn, make sure to give `domain_userid`s enough time to become "churned". E.g., you can make an assumption that anyone who hasn't had events for 30 days is considered churned. So you'd need to train only on data that happened up until `today - 30d`.
5. Make sure there's no target leakage in your dataset. The most common pitfalls are:
    * Including events in historical training that happened after the prediction point in the journey.
    * Including information that wouldn't be available at the time of prediction in training (e.g., accidentally enriching the training dataset with some "as of today" data from the warehouse or CRM).

### Train and Evaluate The Model

In this tutorial we train a regular XGBoost classification model.

:::note
Use this template to adjust to your own ML needs.
Training an ML model for your specific use cases is a task in itself and goes far beyond this tutorial.
:::

Key steps in the ML journey are:

1. Preprocess data for training (e.g., `StandardScaler` for numerical columns, `OneHotEncoder` for categorical, `train_test_split` for training/testing split).
2. Fit the model pipeline using `model.fit`.
3. Persist model binary with `joblib.dump`. We will use the trained model binary later for inference in the API endpoint.
4. Evaluate model performance: calculate regular metrics, confusion matrix, ROC-AUC curve, visualize feature importance, optionally, use SHAP to get prediction explanations.

```python
preprocessor = ColumnTransformer(transformers=[
    ('num', StandardScaler(), numerical_cols),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
])
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', xgb.XGBClassifier(eval_metric='logloss', random_state=seed))
])

# Split, train, and evaluate
X = db_df[x_columns]
y = db_df[y_column]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=seed, stratify=y)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# Export
joblib.dump(model, "xgb_model.joblib")

# Quick model metric evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
...
ConfusionMatrixDisplay.from_estimator(model, X_test, y_test, cmap='Blues', ax=axes[0])
...
fpr, tpr, _ = roc_curve(y_test, y_prob)
...
explainer = shap.Explainer(model.named_steps['classifier'], X_train_transformed)
...
```

Follow along the notebook to check how these are implemented and adjust them to your needs.

![](./screenshots/model_evaluate.png)
