---
title: "Introducing unified tracking design"
description: "We're pleased to announce the release of Unified Tracking Design, a new workflow enhancement in the Snowplow Console that streamlines how you create and manage your tracking."
date: "2025-10-30"
update_type:
  - "Release notes"
components:
  - "Event Studio"
---
We're pleased to announce the release of Unified Tracking Design, a new workflow enhancement in the Snowplow Console that streamlines how you create and manage your tracking.

You can now create and attach new data structures directly from within a data product's event specification. This eliminates the need to navigate back and forth between the Data Products and Data Structures sections, enabling a more intuitive, top-down approach to tracking design. Now, you can build out your entire tracking plan for a specific use case, like a new checkout flow or new mobile platform, within a single, uninterrupted workflow.

**Key Changes**

* **In-Context Data Structure Creation:** A new "Create data structure" button is available within the "Add data structure" modal in your data products. This allows you to define, configure, and add new schemas on the fly without leaving your current view.
* **Integrated Publishing Workflow:** You can publish newly created data structures from draft to development directly within the event specification view, keeping you in the flow of your work.
* **Support for Events and Entities:** The new creation flow is available for both Event and Entity data structures, ensuring a consistent experience across all aspects of your tracking design.

**Key Benefits**

* **Accelerate Tracking Design:** Streamline your workflow by designing and implementing tracking in a single, uninterrupted process, significantly reducing setup time.
* **Improve Design Intuition:** Encourages a top-down, use-case-driven approach, allowing you to build out tracking for features without context switching.
* **Reduce Navigation:** Minimizes the clicks and page loads required to build comprehensive data products, keeping you focused on the design task at hand.

**Getting Started**

The Unified Tracking Design workflow is now available for all Snowplow Console users with Data Product Studio.

To use the new feature:

1. Navigate to any data product and open an event specification.
2. Click "Add data structure" (for an event) or "Add entity data structure."
3. Click the new **+ Create data structure** button in the bottom right of the modal.
4. Define, save, and publish your new data structure. It will be automatically attached to the event specification.
