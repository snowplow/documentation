---
position: 3
title: Create a base data product from the web template in Console
sidebar_label: Create a base data product
description: "Set up a Base Web data product template to monitor page views, page pings, and link clicks for your source application."
keywords: ["base web data product", "data product templates"]
---

After creating a Source Application, the recommended way to keep track of what we consider base events for a tracking setup is through the Base Data Product templates. For this application you can use the [Base Web](/docs/data-product-studio/data-products/data-product-templates/#base-web).

To create a Base Web Data Product for your application, navigate to the Data Products section and after clicking the `Templates` button, select the Base Web template.
![](./images/create-dp.png)

By default, a Base Data Product is not connected to a Source Application and will show all the Base Event application IDs, so for this you need to edit the Data Product and set the Source Application to `Todo Web Application`.
![](./images/create-base-dp-inputs.png)

The Base Web (_or Mobile_) data product will monitor and count base events as they are sent for the selected Source Application app IDs, as we will see later on. There is no need for additional implementation.
