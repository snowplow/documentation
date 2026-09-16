---
title: "Introducing drafts for data structures"
description: "We have released a new enhancement to the data structure creation workflow in the Snowplow Console: the ability to save drafts."
date: "2025-08-06"
category:
  - "Release notes"
components:
  - "Event Studio"
---
We have released a new enhancement to the data structure creation workflow in the Snowplow Console: the ability to save drafts. This feature allows you to save your progress on a new data structure before it is ready to be published to your development environment, making it easier to design and collaborate on your tracking.

### Key Changes & Benefits

* **Iterate on Your Designs:** Now, you can save a draft, allowing you to iterate on complex structures over multiple sessions without cluttering your version history.
* **Safe Editing Environment:** Drafts are contained entirely within the Console's user interface and are not accessible by your validation pipelines (e.g., Snowplow Mini). This provides a safe sandbox for designing and refining your data structures without any risk of affecting event validation in your development environment.
* **For New Structures Only:** Please note that the drafting functionality is only available for **new** data structures. It is not possible to create a draft for a data structure that has already been published and versioned (e.g., a structure at version `1.0.0`).

This enhancement is now live and available to all users. When creating a new data structure, you will now see the option to 'Save' which will create a draft, alongside the 'Publish' button to push it to your development environment.
