---
title: Automatically generated Data Models
sidebar_label: Automatically generated Data Models
sidebar_position: 8
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This feature lets you **generate Data Models directly from a Data Product**, removing the need for repetitive manual setup. Engineers can create models within the same workflow, ensuring **schema consistency**, convenience, and reducing integration errors.

## Key Capabilities

### Flexible Inclusion of Events and Entities
- Include **all** or a **subset** of event specifications or entities.
- Choose exactly which **out-of-the-box columns** to include in the model.

These two features make it possible to create data models as fine-grained and targeted as required, providing you with full control over the level of detail.

### Automatic Data Flattening
To create a **clean, wide table**, the tool automatically flattens data structures into individual columns.

**How flattening works:**
- **Events** → All selected event properties are flattened into their own columns.
- **Entities** → Flattening depends on cardinality:
  - **Single entities** (e.g., `user`) → Flattened into separate columns, e.g., `user_id`, `user_email`.
  - **Multiple entities** (e.g., arrays like `products`) → Stored as a single array column, which you can **unnest later**.

### 3. Event Specification Inference
The system determines which events to include in the final data model through **two distinct approaches**:

**Using Snowtype:**
- Generated data models are **automatically filtered** to event specification IDs added by Snowtype.
- Guarantees that **all events were sent with the intent** to implement this Data Product.
- Ensures **high data quality** and tracking consistency.

**Not Using Snowtype:**
- Generated data models include **all rows matching** the Data Product definition.
- Uses **"best effort" matching** based on events, entities, cardinalities, and rules.
- May include some **unintended events** but allows access to **historical data**.
- Requires **no adjustments** to existing tracking implementations.

### Deployment Options
Choose between two generation methods:

- **View** → Best for lightweight use cases when you need **immediate access to data** with minimal setup.
- **Incremental dbt Model** → Ideal for production pipelines when you want to **materialize data efficiently** and integrate it into existing **dbt projects**.

## Use Cases

### Use Case 1 — Quick Data Exploration
**Scenario:**  
A developer needs to explore event-level data to **validate tracking** or analyze **user behavior**.

**How the Feature Helps:**
- Generate a lightweight **View** directly from a Data Product.
- Automatically flatten events and entities for easier querying.
- Select only relevant event specifications to avoid noise.

**Outcome:**  
Immediate access to a **clean, queryable table** without manual setup — enabling faster debugging and validation.

### Use Case 2 — Production-Ready Data Models
**Scenario:**  
A data engineer wants to integrate curated event data into an **existing dbt project** to power analytics dashboards.

**How the Feature Helps:**
- Create an **incremental dbt model** directly from the Data Product.
- Select only the **necessary events and entities** for optimal performance.
- Ensure **schema consistency** by aligning models with event specifications.
- Minimize integration errors and streamline analytics workflows.

**Outcome:**  
Seamless integration of **modeled event data** into production pipelines — ensuring **scalability, accuracy, and maintainability**.
