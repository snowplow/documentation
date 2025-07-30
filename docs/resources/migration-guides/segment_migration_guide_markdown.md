# A competitive migration guide: From Segment to Snowplow

This guide is for technical implementers considering a migration from Segment to Snowplow. This move represents a shift from a managed Customer Data Platform (CDP) to a more flexible, composable behavioral data platform which runs in your cloud environment.

## The strategic imperative: Why data teams migrate from Segment to Snowplow

The move from Segment to Snowplow is usually driven by a desire for greater control, higher data fidelity, and a more predictable financial model.

### Achieve data ownership and control in your cloud

The key architectural difference is deployment. Segment is a SaaS platform where your data is processed on their servers. Snowplow runs as a set of services in your private cloud (AWS/GCP/Azure), giving you full ownership of your data at all stages.

This provides several advantages:

- **Enhanced security and compliance**: Keeping data within your own cloud simplifies security reviews and compliance audits (e.g., GDPR, CCPA, HIPAA), as no third-party vendor processes raw user data
- **Complete data control**: You can configure, scale, and monitor every component of the pipeline according to your specific needs
- **Elimination of vendor lock-in**: Because you own the infrastructure and the data format is open, you are not locked into a proprietary ecosystem

### A new approach to governance: Foundational data quality

Segment and Snowplow approach data governance differently. Segment's Protocols feature validates data reactively, acting as a gatekeeper for incoming events. This is often a premium feature and, if not rigorously managed, can lead to inconsistent data requiring significant downstream cleaning. Furthermore, there is no separation between development and production environments, meaning no easy way to test changes before deploying them.

Snowplow enforces data quality proactively with mandatory, machine-readable **[schemas](https://docs.snowplow.io/docs/fundamentals/schemas/)** for every [event](https://docs.snowplow.io/docs/fundamentals/events/) and [entity](https://docs.snowplow.io/docs/fundamentals/entities/). [Events that fail validation](https://docs.snowplow.io/docs/fundamentals/failed-events/) are quarantined for inspection, ensuring only clean, consistent data lands in your warehouse. This "shift-left" approach moves the cost of data quality from a continuous operational expense to a one-time design investment.

### Unlock advanced analytics with greater granularity

Segment is primarily a data router, excelling at sending event data to third-party tools. Snowplow is designed to create a rich, granular behavioral data asset. Segment's `track` events use a flat JSON `properties` object, limiting contextual depth. Snowplow's [event-entity model](https://docs.snowplow.io/docs/fundamentals/events/) allows a single event to be enriched with numerous contextual entities on the tracker and also in the pipeline, providing over 100 structured data points per event.

This rich, structured data is ideal for:

- **Complex data modeling**: Snowplow provides [open-source dbt packages](https://docs.snowplow.io/docs/modeling-data/modeling-your-data/dbt/) to transform raw data into analysis-ready tables
- **AI and machine learning**: High-fidelity data is ideal for training ML models like recommendation engines or churn predictors
- **Deep user behavior analysis**: Rich entities enable multi-faceted exploration of user journeys without complex data wrangling

### A predictable, infrastructure-based cost model

Segment's pricing is based on Monthly Tracked Users (MTUs), which can become expensive and unpredictable as you scale. This model can penalize growth.

Snowplow's costs are based on your cloud infrastructure usage (compute and storage from AWS or GCP), which is more predictable and cost-effective at scale. This model aligns cost directly with data processing volume, not user count, encouraging comprehensive data collection without financial penalty.

| Feature | Segment | Snowplow |
|---------|---------|----------|
| **Deployment Model** | SaaS-only; data processed on Segment servers hosted by AWS | Private cloud; runs entirely in your AWS/GCP/Azure account |
| **Data Ownership** | Data access in warehouse; vendor controls pipeline | True ownership of data and entire pipeline infrastructure |
| **Governance Model** | Reactive; post-hoc validation with Protocols (a premium add-on) | Proactive; foundational schema validation for every event |
| **Data Structure** | Flat events with properties, user traits and context objects | Rich events enriched by multiple, reusable entities |
| **Primary Use Case** | Data routing to 3rd party marketing/analytics tools | Creating a foundational behavioral data asset for BI and AI |
| **Pricing Model** | Based on Monthly Tracked Users (MTUs) and API calls | Based on your underlying cloud infrastructure costs |
| **Real-Time Capability** | Limited low-latency support and observability | Real-time streaming pipeline (e.g., via Kafka) supports use cases in seconds |

## Deconstructing the data model: From flat events to rich context

To appreciate the strategic value of migrating to Snowplow, it is essential to understand the fundamental differences in how each platform approaches the modeling of behavioral data. This is not just a technical distinction; it is a difference in approach that has consequences for data quality, flexibility, and analytical power. Segment operates on a simple, action-centric model, while Snowplow introduces a more sophisticated, context-centric paradigm that more accurately reflects the complexity of the real world.

### The Segment model: A review of track, identify, and the property-centric approach

Segment's data specification is designed for simplicity and ease of use. It is built around a handful of core API methods that capture the essential elements of user interaction. The most foundational of these is the `track` call, which is designed to answer the question, "What is the user doing?". Each `track` call records a single user action, known as an event, which has a human-readable name (e.g., `User Registered`) and an associated `properties` object. This object is a simple JSON containing key-value pairs that describe the action (e.g., `plan: 'pro'`, accountType: 'trial'`).

The other key methods in the Segment spec support this action-centric view:

- **`identify`**: Answers the question, "Who is the user?" It associates a `userId` with a set of `traits` (e.g., `email`, `name`), which describe the user themselves
- **`page` and `screen`**: Record when a user views a webpage or a mobile app screen, respectively
- **`group`**: Associates an individual user with a group, such as a company or organization
- **`alias`**: Used to merge the identities of a user across different systems or states (e.g., anonymous to logged-in)

This model forces the world into a verb-centric framework. The event—the action—is the primary object of interest. All other information, whether it describes the product involved, the user performing the action, or the page on which it occurred, is relegated to being a "property" or a "trait" attached to that action. While this approach is intuitive, it lacks a formal, structured way to define and reuse the *nouns* of the business—the users, products, content, and campaigns—as first-class, independent components of the data model itself. This architectural choice leads to data being defined and repeated within the context of each individual action, rather than as a set of interconnected, reusable concepts.

### The Snowplow approach: Understanding the event-entity distinction

Snowplow introduces a more nuanced and powerful paradigm that separates the *event* (the action that occurred at a point in time) from the *entities* (the nouns that were involved in that action). In Snowplow, every tracked event can be decorated with an array of contextual entities. This is the core of the event-entity model.

An **[event](https://docs.snowplow.io/docs/fundamentals/events/)** is an immutable record of something that happened. A **[self-describing event](https://docs.snowplow.io/docs/fundamentals/events/#self-describing-events)** in Snowplow is the equivalent of a Segment `track` call, capturing a specific action like `add_to_cart`.

An **[entity](https://docs.snowplow.io/docs/fundamentals/entities/)**, however, is a reusable, self-describing JSON object that provides rich, structured context about the circumstances surrounding an event. This distinction is a key differentiator: Instead of adding properties like `product_sku`, `product_name`, and `product_price` to every single event related to a product, you define a single, reusable `product` entity. This one entity can then be attached to a multitude of different events throughout the customer journey:

- `view_product`
- `add_to_basket`
- `remove_from_basket`
- `purchase_product`
- `review_product`

This approach reflects the real world more accurately. An "event" is a momentary action, while "entities" like users, products, and marketing campaigns are persistent objects that participate in many events over time. This separation provides immense power. It allows you to analyze the `product` entity across its entire lifecycle, from initial discovery to final purchase, by querying a single, consistent data structure. You are no longer forced to hunt for and coalesce disparate property fields (`viewed_product_sku`, `purchased_product_sku`, etc.) across different event tables.

Furthermore, Snowplow comes with a rich set of [out-of-the-box entities](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#out-of-the-box-entity-tracking) that can be enabled to automatically enrich every event with crucial context, such as the `webPage` entity, the `performanceTiming` entity for site speed, and the `user` entity. This moves the data model from being action-centric to being context-centric, providing a much richer and more interconnected view of behavior from the moment of collection.

### The language of your business: Building composable data structures with self-describing schemas (data contracts)

The technical foundation that makes the event-entity model possible is Snowplow's use of **self-describing schemas**. In the Segment world, developers often start by implementing events, and then data team then retrospectively classifies and governs them via Segment Protocols. While they do provide tracking plan capabilities, these are hard to find and optional.

In the Snowplow ecosystem, the schema registry *is* the single source of truth. Every self-describing event and every custom entity is defined by a formal JSON Schema, which is stored and versioned in a schema registry called **[Iglu](https://docs.snowplow.io/docs/fundamentals/schemas/#iglu)**. Each schema is a machine-readable contract that specifies:

- **Identity**: A unique URI comprising a vendor (`com.acme`), a name (`product`), a format (`jsonschema`), and a version (`1-0-0`)
- **Structure**: The exact properties the event or entity should contain (e.g., `sku`, `name`, `price`)
- **Validation Rules**: The data type for each property (`string`, `number`, `boolean`), as well as constraints like minimum/maximum length, regular expression patterns, or enumerated values

The data payload itself contains a reference to the specific schema and version that defines it, which is why it's called a "self-describing JSON". This creates a powerful, unambiguous, and shared language for data across the entire organization. When a product manager designs a new feature, they collaborate with engineers and analysts to define the schemas for the new events and entities involved. This contract is then stored in Iglu. The engineers implement tracking based on this contract, and the analysts know exactly what data to expect in the warehouse because they can reference the same contract. This is a cultural shift that treats data as a deliberately designed product, not as a byproduct of application code.

### Analytical implications: How the event-entity model unlocks deeper, contextual insights

The architectural advantage of the event-entity model becomes apparent in the data warehouse. In a Segment implementation, each custom event type is loaded into its own table (e.g., `order_completed`, `product_viewed`). While this provides structure, it can lead to a large number of tables in the warehouse, a challenge sometimes referred to as "schema sprawl." A significant amount of analytical work involves discovering the correct tables and then `UNION`-ing them together to reconstruct a user's complete journey.

Snowplow's data model for modern warehouses like Snowflake and BigQuery simplifies this downstream work by using a "one big table" approach. All data is loaded into a single, wide [`atomic.events` table](https://docs.snowplow.io/docs/fundamentals/canonical-event/). Self-describing events and their associated entities are not loaded into separate tables. Instead, they are stored as dedicated, structured columns within that one table—for example, as an `OBJECT` in Snowflake or a `REPEATED RECORD` in BigQuery. This model avoids the schema sprawl of the Segment approach.

For an analyst, this means that to get a complete picture of an `add_to_cart` event and the product involved, they query a single, predictable table. The event and all its contextual entities are present in the same row. This structure can simplify data modeling in tools like dbt and accelerate time-to-insight, as the analytical work shifts from joining many disparate event tables to unnesting or accessing data within the structured columns of a single table. It is important to note that this loading behavior is different for Amazon Redshift, where each entity type does get loaded into its own separate table.

| Segment Concept | Segment Example | Snowplow Equivalent | Snowplow Implementation Detail |
|-----------------|-----------------|---------------------|--------------------------------|
| **Core Action** | `track('Order Completed', {revenue: 99.99, currency: 'USD'})` | **Self-describing event** | `trackSelfDescribingEvent` with a custom `order_completed` schema containing `revenue` (number) and `currency` (string) properties |
| **User Identification** | `identify('user123', {plan: 'pro', created_at: '...'})` | **User entity and `setUserId`** | A call to `setUserId('user123')` to populate the atomic `user_id` field, plus attaching a custom `user` entity with a schema containing properties like `plan` and `created_at` |
| **Page/Screen Context** | `page('Pricing', {category: 'Products'})` | **`trackPageView` and `web_page` entity** | A `trackPageView` call with a `title` of 'Pricing'. This automatically attaches the standard `web_page` entity. The `category` would be a custom property added to a custom `web_page` context or a separate content entity |
| **Reusable Properties** | `properties.product_sku` in multiple `track` calls | **Dedicated `product` entity** | A single, reusable `product` entity schema is defined with a `sku` property. This entity is then attached as context to all relevant events (`product_viewed`, `add_to_cart`, etc.) |

## Architecting your migration: A phased framework

A successful migration requires a well-defined strategy that manages risk and ensures data continuity. This section outlines a high-level project plan, including different strategic scenarios and a plan for handling historical data.

### The three-phase migration roadmap

A migration from Segment to Snowplow can be broken down into three phases:

- **Phase 1: Assess and plan**
  - Audit all existing Segment `track`, `identify`, `page`, and `group` calls
  - Export the complete Segment Tracking Plan via API (if you still have an active account) or infer it from data in a data warehouse
  - Translate the Segment plan into a Snowplow tracking plan, defining event schemas and identifying reusable entities - using the Snowplow CLI MCP Server
  - Deploy the Snowplow pipeline components ([Collector](https://docs.snowplow.io/docs/pipeline-components-and-applications/stream-collector/), [Enrich](https://docs.snowplow.io/docs/pipeline-components-and-applications/enrichment-components/), [Loaders](https://docs.snowplow.io/docs/pipeline-components-and-applications/loaders-storage-targets/)) and the [Iglu Schema Registry](https://docs.snowplow.io/docs/pipeline-components-and-applications/iglu/) in your cloud
- **Phase 2: Implement and validate**
  - Add [Snowplow trackers](https://docs.snowplow.io/docs/collecting-data/) to your applications to run in parallel with existing Segment trackers (dual-tracking)
  - Use tools like [Snowplow Micro](https://docs.snowplow.io/docs/testing-debugging/snowplow-micro/) for local testing and validation before deployment
  - Perform end-to-end data reconciliation in your data warehouse by comparing Segment and Snowplow data to ensure accuracy
- **Phase 3: Cutover and optimize**
  - Update all downstream data consumers (BI dashboards, [dbt models](https://docs.snowplow.io/docs/modeling-data/modeling-your-data/dbt/)) to query the new Snowplow data tables
  - Remove the Segment trackers and SDKs from application codebases
  - Decommission the Segment sources and, eventually, the subscription

### Migration scenario 1: The parallel-run approach

The parallel-run approach is the recommended, lowest-risk strategy. It involves running both systems simultaneously (dual-tracking) to validate data integrity before cutting over. Existing Segment-powered workflows remain operational while you test and reconcile the new Snowplow data in the warehouse. This approach builds confidence and allows you to resolve discrepancies without impacting production systems.

### Migration scenario 2: The full re-architecture

A "rip-and-replace" approach is faster but riskier, involving a direct switch from Segment to Snowplow SDKs. This is best suited for:

- New projects or applications with no legacy system
- Major application refactors where the switch can be part of a larger effort
- Teams with high risk tolerance and robust automated testing frameworks

This strategy requires thorough pre-launch testing in a staging environment to prevent data loss.

### A strategy for historical data

You have two main options for handling historical data from Segment:

- **Option A: Coexistence (Pragmatic)** Leave historical Segment data in its existing tables. For longitudinal analysis, write queries that `UNION` data from both Segment and Snowplow tables, using a transformation layer (e.g., in dbt) to create a compatible structure. This avoids a large backfill project
- **Option B: Unification (Backfill)** For a single, unified dataset, undertake a custom engineering project to transform and backfill historical data. This involves exporting Segment data, writing a script to reshape it into the Snowplow enriched event format, and loading it into the warehouse. This is a significant effort but provides a consistent historical dataset

## The technical playbook: Executing your migration

This section provides a detailed, hands-on playbook for the technical execution of the migration. A central theme of this playbook is the use of the Snowplow CLI and its integrated AI capabilities to accelerate the most challenging part of the migration: designing a new, high-quality tracking plan.

### Step 1: Deconstruct your legacy: Export and analyze the Segment tracking plan

Before building the new data foundation, you must create a complete blueprint of the existing structure. The first practical step is to export your Segment Tracking Plan into a machine-readable format that can serve as the raw material for your redesign.

There are two primary methods for this export:

1. **Manual CSV download**: The Segment UI provides an option to download your Tracking Plan as a CSV file. This is a quick way to get a human-readable inventory of your events and properties. However, it can be less ideal for programmatic analysis and may not capture the full structural detail of your plan
2. **Programmatic API export (recommended)**: The superior method is to use the Segment Public API. The API allows you to programmatically list all Tracking Plans in your workspace and retrieve the full definition of each plan, including its rules, in a structured JSON format. This JSON output is invaluable because it often includes the underlying JSON Schema that Segment uses to validate the `properties` of each event

The result of this step is a definitive, version-controlled artifact (e.g., a `segment_plan.json` file) that represents the ground truth of your current tracking implementation. This file will be the primary input for the next step of the process.

### Step 2: AI-assisted design: Build your Snowplow tracking plan with the CLI and MCP server

Next, you'll need to translate that tracking plan into a Snowplow-appropriate format (Data Products and Data Structures).

The [Snowplow CLI](https://docs.snowplow.io/docs/data-product-studio/snowplow-cli/) is a command-line utility that includes a Model Context Protocol (MCP) server, so you can use an AI agent to generate idiomatic Snowplow tracking. For more information on how to do this, read the [tutorial](https://docs.snowplow.io/tutorials/snowplow-cli-mcp/introduction/).

### Step 3: Re-instrument your codebase: A conceptual guide

With a robust and well-designed tracking plan published to your Iglu registry, the next step is to update your application code to send events to Snowplow. While the specific code will vary by language and platform, the core concepts are consistent. We recommend using [Snowtype](https://docs.snowplow.io/docs/data-product-studio/snowtype/), our Code Generation tool, to automatically generate type-safe tracking code.

#### Migrate client-side tracking: From analytics.js to the Snowplow Browser Tracker

The [Snowplow JavaScript/Browser tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/) introduces a more modern and readable API. The most significant change from Segment's `analytics.js` is the move from function calls with long, ordered parameter lists to calls that accept a single object with named arguments.

- A Segment call like `analytics.track('Event', {prop: 'value'})` becomes a Snowplow call like `snowplow('trackSelfDescribingEvent', {schema: 'iglu:com.acme/event/jsonschema/1-0-0', data: {prop: 'value'}})`
- A Segment `identify` call is replaced by a combination of a `setUserId` call to set the primary user identifier and the attachment of a custom `user` entity to provide the user traits

This object-based approach improves code readability, as the purpose of each value is explicit, and makes the tracking calls more extensible for the future.

#### Migrate server-side and mobile tracking: An overview of Snowplow's polyglot trackers

Snowplow provides a comprehensive suite of [trackers](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/) for virtually every common back-end language and mobile platform, including [Java](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/java-tracker/), [Python](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/python-tracker/), [.NET](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/net-tracker/), [Go](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/go-tracker/), [Ruby](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/ruby-tracker/), [iOS](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/ios-tracker/) (Swift/Objective-C), and [Android](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/android-tracker/) (Kotlin/Java).

While the syntax is idiomatic to each language, the underlying paradigm remains the same across all trackers. The developer will:

1. Initialize the tracker with the endpoint of their [Snowplow collector](https://docs.snowplow.io/docs/pipeline-components-and-applications/stream-collector/)
2. Use builder patterns or helper classes to construct self-describing events and entity objects, referencing the schema URIs from the Iglu registry. For example, the Java tracker uses a `SelfDescribing.builder()` to construct the event payload
3. Use a `track` method to send the fully constructed event to the collector

The consistency of the event-entity model across all trackers ensures that data from every platform will arrive in the warehouse in a unified, coherent structure.

### Step 4: Ensure a smooth transition: Validation, testing, and cutover

The final step is to rigorously validate the new implementation and manage the cutover. A smooth transition is non-negotiable.

#### Local validation with Snowplow Micro

To empower developers and "shift-left" on data quality, customers should incorporate **[Snowplow Micro](https://docs.snowplow.io/docs/testing-debugging/snowplow-micro/)**. Micro is a complete Snowplow pipeline packaged into a single Docker container that can be run on a developer's local machine. Before committing any new tracking code, a developer can point their application's tracker to their local Micro instance. They can then interact with the application and see the events they generate appear in the Micro UI in real-time. Micro performs the same validation against the Iglu registry as the production pipeline, allowing developers to instantly confirm that their events are well-formed and pass schema validation. This catches errors early, reduces the feedback loop from hours to seconds, and prevents bad data from ever reaching the production pipeline.

#### End-to-end data reconciliation strategies

During the parallel-run phase, it is essential to perform end-to-end data reconciliation in the data warehouse. This involves writing a suite of SQL queries to compare the data collected by the two systems. Analysts should compare high-level metrics like daily event counts and unique user counts, as well as the values of specific, critical properties. The goal is not to achieve 100% identical data—the data models are different, which is the point of the migration. The goal is to be able to confidently explain any variances and to prove that the new Snowplow pipeline is capturing all critical business logic correctly.

#### Final cutover: Decommission Segment senders

Once the data has been thoroughly reconciled and all downstream dependencies (e.g., BI dashboards, ML models, marketing automation workflows) have been successfully migrated to use the new, richer Snowplow data tables, the team can proceed with the final cutover. This involves a coordinated deployment to remove the Segment SDKs and all `analytics.track()` calls from the codebases. Following general data migration best practices, the old Segment sources should be left active for a short period as a final fallback before being fully decommissioned.