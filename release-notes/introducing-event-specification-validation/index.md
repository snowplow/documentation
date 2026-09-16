---
title: "Introducing event specification validation"
description: "Event Specification Validation is now available in Event Studio."
date: "2026-05-06"
category:
  - "Product news"
components:
  - "Event Studio"
  - "Developer tools"
---
Event Specification Validation is now available in Event Studio. It checks whether your incoming events conform to the rules defined in your published event specifications, and has been one of our most requested features since Event Studio launched. Validation results land in your warehouse so you can see which events are correct and which aren't.

## Key benefits

**Ensure data completeness.** Verify that your events have the right entity contexts so you can trust your data for downstream analysis and activation.

**Tracking plans to data quality.** Snowtype, our code generation tool, helps developers reduce errors at implementation time. Event Specification Validation now gives tracking designers visibility into the implementation quality of your tracking plans.

**From observability to data quality control.** You see whether events meet your defined standards, not just whether they're arriving. Validation results are available in your data warehouse for analysis, alerting, and remediation.

## Key capabilities

**Automatic pipeline validation.** Every event that has been implemented using the latest version of Snowtype is validated against the rules defined in that specification version. The validation result, including fail status and details of any rule violations, is attached as a context entity on the event.

**Rule coverage.** Validation checks event and entity property rules as well as entity cardinality rules defined in your published event specifications.

**Warehouse querying.** Validation results are available in your data warehouse immediately. You can query the validation context entity to identify non-conforming events and calculate failure rates by event specification.

**Event specification version history.** The Snowplow Console now shows the history of your event specifications, including what changed and why.

## What's in this release

This release focuses on validation where results are available in the warehouse. When an event fails validation, a new `event_specification_validation` entity is attached containing the reason for the failure.

In upcoming releases, we are planning to introduce:

* Testing tools for Event Specification Validation integrated into Snowplow Micro
* Console-based visibility of Event Specification Validation outcomes
* The ability to route events that fail validation to the bad stream or good stream

## Getting started

1. Define rules on your event specifications in Event Studio, including event and entity property rules and entity cardinality rules
2. Implement tracking using Snowtype (=0.17.0)
3. Publish your event specification or tracking plan
4. Validation activates automatically when you publish — there's nothing else to turn on
5. Query the validation context entity in your data warehouse to review outcomes

_Already implemented using a previous version of Snowtype?_ Read our documentation that contains a guide on how to enable Event Specification Validation.

## Documentation

* [Event Specification Validation](/docs/event-studio/tracking-plans/event-specification-validation/)
