---
title: Visualize with Tableau
position: 6
---

Now that you have modeled data you'll want to see the results in a visual way to be able to easily identify any performance issues with your website.

We have created a Tableau workbook to showcase how you could do that, using csvs that were exported from the derived core web vitals tables (`core_web_vitals`, `core_web_vital_measurements`).

If you would like to see your own modeled data you can simply change the data sources and then you will be able to look at the visualizations to get inspiration of what you can build with your connector of choice (based on the warehouse you have).

## Accessing the sample Tableau workbook

You can download the file [here](https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/Visualization/Snowplow+Core+Web+Vitals+-+demo.twbx).

In case you need the source csvs, you can access them here:
[snowplow_web_vital_measurements sample](https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/Visualization/snowplow_web_vital_measurements_sample.csv) and [snowplow_web_vitals sample](https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/Visualization/snowplow_web_vitals_sample.csv)

Once you have the file locally, you can open it in several ways: with Tableau Public, Tableau Reader (free) or by uploading it to Tableau Online, if you have access.

## Change the dashboard data source

1. Export the `snowplow_web_vitals` and `snowplow_web_vital_measurements` derived tables as csv with your sql editor of choice.

2. In Tableau Public or Tableau Online open the sample twbx file and unhide one of the worksheets (e.g. go to Core Web Vitals dashboard and select LCP by period and device then right click and uncheck the `Hide` box).

3. Go to `Data/ New Data Source` select `text file` and navigate to the downloaded `snowplow_web_vital_measurements.csv`. Go back to the unhidden worksheet. Now you can see the new data source added at the top left corner.

4. Select it and make the following changes:
   - Change the `Time Period` to `Date and Time` by clicking on the `Abc` icon in front of its name
   - Create set by right-clicking on `Device Class` then choose `Create / Set`, tick `all` and tick the box `exclude` to exclude results with `all` in the name, click ok

5. Go to `Data / Replace data source` and select the new `snowplow_web_vital_measurements` file to replace `snowplow_web_vital_measurements_sample` in the `Replacement` section.

6. You can right click and `Close` the original `snowplow_web_vital_measurements_sample` data connection from the upper `Data` section of the page.

7. Add and replace the `snowplow_web_vitals_sample` as well. For that you do not need any changes to the fields. (Step 3, 5, 6 are needed again)

You should have a working dashboard with your own data! Feel free to pick and choose visualizations and dashboards to make your custom one.
