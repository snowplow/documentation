---
title: "Managing Data Product using Console"
date: "2024-01-18"
sidebar_label: "Using the UI"
sidebar_position: 1
sidebar_custom_props:
  offerings:
    - enterprise
    - cloud

---

## Creating and editing a new Data Product using Console

To create a new data product, navigate to the "Data products" section from the navigation bar and click the "Create data product" button. 

![Create data product](images/image-1.png)

A form will appear on the page. Enter your data product information and click "Create and continue" to navigate to the event specification page.

![Event specifications](images/image-2.png)

This page allows you to create multiple event specifications. You can click on any row to enter the details on this screen, or you can complete the information later.

When clicking on a event specification row, a page will allow you to enter additional information into separate modals:

- **Event information**; describes information such as which applications the event fires in
- **Event data structure**; determines how your data is structured and define the types of properties of the event
- **Entity data structures**; describes which entities to attach to the event when it is triggered
- **Event triggers**; specify the places and circumstances under which the event is triggered
- **Properties**; specify instructions about how each schema property should be set for this event specification

The breadcrumb navigation allows you to quickly navigate to the data product overview as well as to the list of data products. Alternatively, you can access the list of available data products by clicking `Data products` prominently displayed in the navigation bar on the left.

In the image below, you can see an example of a data product. It not only provides an overview of all the event specifications but also allows you to access three important functionalities.

- **Share**; allow other members of your organization to access the data product 
- **Subscribe**; receive notifications of any changes in the data product
- **Implement tracking**; automatically generate the code for your data product to be included in your application (to learn more visit [Code Generation - automatically generate code for Snowplow tracking SDKs](/docs/collecting-data/code-generation/index.md) 

*Notes: sharing and subscribing is only available for users registered in Snowplow BDP Console.*

![Data product overview](images/image-4.png)

![Event specification details](images/image-3.png)

If you need to edit a data product at any time, simply select it from the data products listing accessible from the main menu.