---
position: 3
title: Create a Base Data Product
description: "Create base data products for foundational behavioral data collection and schema management."
schema: "HowTo"
keywords: ["Base Data Product", "Product Creation", "Data Product", "Base Analytics", "Product Foundation", "Core DP"]
---

After creating a Source Application, the recommended way to keep track of what we consider base events for a tracking setup is through the Base Data Product templates. For this application you can use the [Base Web](https://docs.snowplow.io/docs/understanding-tracking-design/defining-the-data-to-collect-with-data-products/data-product-templates/#base-web).

To create a Base Web Data Product for your application, navigate to the Data Products section and after clicking the `Templates` button, select the Base Web template.
![](./images/create-dp.png)

By default, a Base Data Product is not connected to a Source Application and will show all the Base Event application IDs, so for this you need to edit the Data Product and set the Source Application to `Todo Web Application`.
![](./images/create-base-dp-inputs.png)

The Base Web (_or Mobile_) data product will monitor and count base events as they are sent for the selected Source Application app IDs, as we will see later on. There is no need for additional implementation. 
