---
title: "Managing tracking scenarios in the console"
sidebar_label: "🆕 Managing tracking scenarios in the console"
sidebar_position: 95
---

With Tracking Scenarios, you and your team can create a shared understanding of what events should be tracked, in which cases, and with what entities.

:::info
Tracking scenario management from console is only available for BDP Cloud customers.

 For BDP Enterprise, see [Managing tracking scenarios with API] <!-- TODO: add link when https://github.com/snowplow/documentation/pull/441 is merged -->
:::

## Creating a New Tracking Scenario draft

To create a new Tracking Scenario, first navigate to **Data Structures** in the menu. From there, select a data structure from the list.

:::info
Tracking Scenarios can only be created from Data Structures that have been set as **Event**.
:::

After selecting a data structure, click on the **Tracking Scenarios** tab as shown in the image.

![](images/ts-1.png)

Next, click the **'Add new scenario'** button. A new dialog box will appear with fields for basic information that can be defined during creation, as shown.

![](images/ts-2.png)

Be aware of the **version** of the data structure against which the Tracking Scenario will be created. This means that the tracking will be compatible with this specific Data Structure version but may not be compatible against other versions or future versions if they evolve.

The fields available to fill at this stage are:

- A text field with the **Scenario name**. 
- A tag field to indicate which applications this scenario is designed to track. This will allow to create or reuse existing tags from other defined tracking scenarios.
- A free text field for a **description** of the tracking scenario.

![](images/ts-3.png)

Clicking the **'Save'** button will create the tracking scenario. If you want to create multiple scenarios at once, for example, different scenarios for mobile and web tracking, click the **'Save & add another'** button instead. You can cancel the creation process by clicking **'Cancel'** button.

When you're done creating your first tracking scenario, you will see a list of tracking scenarios on the page.

![](images/ts-4.png)

:::info
By default, a newly created tracking scenario will have its status set as **Draft**. We'll explain how this can be changed and its purpose later.
:::

* * *

## Editing a Tracking Scenario

To edit an existing tracking scenario, start at the Data Structure and **Tracking scenarios** tab that contains the tracking scenario you want to edit. Click on the name of the tracking scenario you wish to edit.

A new page will display the details of the tracking scenario. 

![](images/ts-5.png)

You can edit the following fields in this page.

### Scenario Information

Click the **'Edit information'** button in the **Scenario Information** section or the **pencil icon** at the right side of the tracking scenario name to open a dialog box view similar to the creation one, but with the current information already filled in.

You will be able to modify all of the fields set previously, during the creation stage.

To confirm the changes, click **'Save and update scenario'**. To cancel, click the **'Cancel'** button, both at the bottom of the dialog box.

### Triggers

Triggers describe situations in which tracking will be performed, such as button clicks, page views, app launches, in-app purchases, user interactions, login attempts, system events and more. These triggers are essential for developers when implementing tracking.

Add multiple triggers by clicking the **'+ Add trigger'** button on the **Scenario Triggers** section. A new dialog box view will appear with a text field where you can specificy information about when, where and how the scenario will be triggered.

![](images/ts-6.png)

Once completed, you can confirm the changes by clicking the **'Save and update scenario'** button or cancel the changes by clicking the **'Cancel'** button.

You will be able to edit the scenario after adding a trigger.

### Implementation rules

With implementation rules, you can define constraints and conditions on basic fields, based on the underlying schema properties of a particular tracking event. This way, you can ensure that once the events flows downstream through the pipeline, they will comply with the underlying schema.

Add multiple implementation rules by clicking the **'+ Add implementation rules'** button in the **Implmentation rules** section. A new dialog box view will appear.

This dialog box displays a list of rules for specific properties that you can set. This list of possible rules is populated based on the Data Structure properties from the specific version that the Tracking Scenario was created from. You can use the search bar to find rules by name.

![](images/ts-7.png)

You can click on any of the properties that are shown in the list. A new view inside the dialog box will show where you'll be able to configure the rule's **Type of condition**, **Value** and **Comments** properties. 

![](images/ts-8.png)

Click **'Add rule'** to add rules or **'Cancel'** button to discard changes.

Once you've configured the rules, click the **'Save and update event'** to confirm the changes or **'Close'** to discard them.

You will see a list of rules in the tracking detail view where you can edit or remove them.

![](images/ts-9.png)

### Entities

[Entities](/docs/understanding-tracking-design/understanding-events-entities/index.md) can be defined as part of the context for a tracking scenario, providing additional information about specific events such as clicks, conversions, impressions, payment info, and more. By including these entities, you can enrich the tracked data and gain deeper insights into user behavior.

Add multiple entites by clicking the **'Add entities'** button. A new dialog box view for configuring entites will appear.

![](images/ts-10.png)

Similar to the **Add implementation rules** dialog box, you will be able to add multiple entities from the list of entites displayed. You can pick your own custom entities (defined in the **Data Structures** section of the Console), or ones available on [Iglu Central](https://iglucentral.com/) repository.

For each of the entities, you can view detailed information about the properties of the entity by clicking **'View properties'**. You can use the search bar to find an entity by name.

Once you've selected the entities you want to add to the tracking scenario, click the **'Select entities'** button to confirm or the **'Cancel'** button to discard your selections. On the next screen, you can configure the cardinality, i.e. how many instances of each entity should be attached to the event.

![](images/ts-11.png)

Click **'Save entities'** or **'Back'** to save or discard your changes respectively.

Once the entities are saved, you will see a list of entities in the tracking detail view where you can edit, add or remove them.

![](images/ts-12.png)

## Publishing a Tracking Scenario

When you've configured a tracking scenario and you are ready to publish it, go to the **Tracking scenario** tab view, select the scenario by clicking on its name, and then click the **'Publish scenario'** button at the right side of the scenario name from the detailed view.

![](images/ts-13.png)

Once the scenario is published, it will no longer appear with the status **Draft** but instead with the status **Published** in the list view. When a scenario is published, you won't be able to edit it anymore, unless you create a new **Draft** version. To do this, click on the scenario name from the list of tracking scenarios, and in the detailed view, instead of the previous **'Publish scenario'** button, you will see a **'Create a draft & edit'** button.

![](images/ts-14.png)

## Scharing a Tracking Scenario

You may want to share a tracking scenario, whether it is published or still a draft. To do this from the **Tracking scenario** tab, click on the tracking scenario name you want to share, and then from the detailed view, click the **'Share scenario'** button near to the publish button.

![](images/ts-15.png)

Then a dialog box view with a link with a **'Copy'** button will appear.

![](images/ts-16.png)

## Deleting Drafted Tracking Scenarios

You can delete a tracking scenario, but this is only possible for *Draft* versions. To delete a Draft tracking scenario, got to the **Tracking scenarios** tab and click the **'Delete'** button.

A confirmation dialog box will appear.

![](images/ts-17.png)

:::warning
This opeartion can't be reverted.
:::

## Deprecating Published Tracking Scenarios

Deprecating a tracking scenario is a signal to developers that this scenario is no longer in use and should not be tracked anymore. However, it's important to note that deprecating a tracking scenario does not automatically prevent new events from being tracked under this scenario. Developers will need to manually stop tracking events for the deprecated scenario.

You can deprecate a tracking scenario, but this is only possible for *Published* versions. To deprecate a Published tracking scenario, go to the **Tracking scenarios** tab and click the **'Deprecate'** button.

A confirmation dialog box will appear where you can add some comments. 

![](images/ts-18.png)

Once you deprecate a Published scenario you will see the new **Deprecated** status.

![](images/ts-19.png)

:::info
You can undo this action by clicking on the scenario and on the detail view you will be shown a **'Change status to draft'** button.

![](images/ts-20.png)
:::

:::info
You can perform some of these actions, **'Publish'**, **'Share'**, **'Delete'**, **'Create a draft & edit'** and **'Deprecate'** on a tracking scenario clicking the triple-dot menu button **'...'** from the **Tracking scenario** tab view.

![](images/ts-21.png)
![](images/ts-22.png)
:::
