# Deployment Notification Policy

## 1. Purpose

This policy defines the circumstances under which Snowplow will provide advance notice to customers regarding platform deployments, upgrades, configuration changes, or infrastructure modifications across:

- **Snowplow Cloud** environments (hosted in Snowplow-owned cloud accounts), and
- **Privately Managed Cloud (PMC)** environments (hosted in customer-owned cloud accounts and managed by Snowplow).

Snowplow operates a continuously evolving SaaS platform and must retain the ability to deploy changes in order to maintain platform security, performance, reliability, and functionality. As such, Snowplow will not provide advance notification for all deployments.

---

## 2. General operating principle

Snowplow performs deployments using rolling, blue/green, or other zero-downtime deployment strategies designed to:

- Avoid customer-facing service interruption; and
- Maintain service availability in accordance with applicable Service Level Agreements (SLAs).

As a general principle, deployments are engineered **not to incur downtime or degrade platform availability outside of SLA commitments**.

Snowplow reserves the right to deploy changes at any time without prior customer notification, provided that such deployments are not reasonably expected to:

- Require customer action;
- Materially impact customer data structures or interfaces;
- Introduce changes to customer-controlled infrastructure dependencies; or
- Result in a material cost impact.

This applies to both **Snowplow Cloud** and **PMC** environments.

Unless explicitly stated in Section 3, customers should assume that deployments may occur without advance notice and that Snowplow is not obligated to seek approval prior to implementation.

---

## 3. Changes that will trigger customer notification

Snowplow will provide advance notification when a deployment is reasonably expected to require customer awareness or action, or materially impact the customer’s use of the platform.

Notification will generally be provided in advance where practicable for the following categories of change:

### 3.1 Customer action required

Changes that require the customer to:

- Modify configurations
- Update infrastructure policies
- Adjust IAM or networking permissions
- Take operational steps to maintain continuity of service
- Update integrations or downstream systems

---

### 3.2 Data structure or contract changes

Changes that may impact:

- Event data formats
- Enriched event structure
- Entity or schema definitions
- Data delivery formats or interfaces
- Data contracts relied upon by downstream systems

Examples include:

- Introduction or modification of Iglu Central event and entity schemas
- Removal or deprecation of fields
- Changes to serialization formats
- Pipeline behavior affecting emitted data

---

### 3.3 Infrastructure changes affecting customer environments (PMC only)

Material changes to the infrastructure model that may impact:

- Observability tooling
- Logging or monitoring integrations
- Networking topology
- Security controls
- Resource policies
- Cloud service dependencies
- Compliance posture or audit assumptions

Examples include:

- Adoption of new managed cloud services
- Changes to compute or storage backends
- Introduction or removal of infrastructure components
- Changes affecting access patterns or service endpoints

---

### 3.4 Significant cost impact (PMC only)

Changes reasonably expected to materially increase or decrease customer cloud spend within **PMC environments**, including:

- Compute utilization
- Storage consumption
- Network egress
- Managed service usage
- Autoscaling behavior
- Retention policies

This applies solely to **PMC environments** where customers incur direct infrastructure costs within their own cloud accounts.

---

## 4. Changes that will not typically trigger notification

The following categories of change will generally **not** result in advance notification:

- Internal platform optimizations
- Routine dependency upgrades
- Performance tuning
- Scaling parameter adjustments
- Changes limited to Snowplow-managed operational tooling
- Failover or resiliency improvements
- Security hardening measures
- Non-breaking API or schema extensions
- Replacement of infrastructure components with functionally equivalent alternatives where no material customer impact is expected

Snowplow will determine, acting reasonably and in good faith, whether a given deployment falls within these categories.

---

## 5. Emergency deployments

Snowplow may deploy changes without prior notification in emergency situations, including but not limited to:

- Security vulnerabilities
- Service instability
- Data integrity risks
- Compliance obligations
- Incidents or active outages

Such deployments may occur notwithstanding the General Operating Principle set out in Section 2.

Snowplow may provide retrospective notice where appropriate following such deployments.

---

## 6. Notification method

Where notification is provided, Snowplow will use commercially reasonable efforts to communicate via:

- Support channels
- Account management contacts
- Email distribution lists
- Customer communication portals

For non-urgent changes, Snowplow will make a reasonable effort to provide at least 24 hours of advance notice. Notice periods may otherwise vary depending on the nature and urgency of the change.