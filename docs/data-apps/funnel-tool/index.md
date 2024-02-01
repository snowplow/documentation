---
title: "Funnel Builder"
sidebar_position: 2
sidebar_label: "Funnel Builder (Coming Soon)"
---

# Introduction

Funnels are an essential tool for understanding user journeys on your app or website. They help to visualize how many users complete each event along a journey such as signing up or making a purchase, so you can understand which stages are leading to the most dropoff and make changes to improve conversion rates. 

This data application provides an intuitive UI for building a funnel analysis and visualizing the results. You can specify any number of conditions and steps, and will receive the following outputs when you run the analysis: 
- User Counts by Funnel Step Chart
- Conversion Rates Chart
- Abandonment Rates Chart
- Summary Statistics Table

 It works on any table that Snowplow’s Data Modelling User has access to, including atomic.events and derived tables. It comes with some pre-built funnels based on out-of-the-box Snowplow events such as page_views and link_clicks, and you can save your own custom funnels to share with teammates. 

Note that this Data Application is currently in Public Preview and features may changes without notice. 


## Requirements

- Access to the table(s) you wish to run the tool on granted to the role used when setting up the data app (by default we will use the data modelling )

# Usage


## Accessing the Application

You can find the Funnel Builder in the Applications tab in the left sidebar of your Snowplow Console. If the status is not Live, you can click on the tile and request access. A Snowplow Customer Success Manager will then get in contact with you to discuss the Snowplow Digital Analytics package. 

Once the application is installed, clicking on the tile will launch the application in a separare browser tab. By default, anyone in your Console organization will be able to access data applications. 

If you wish to invite others to use data applications but not have access to the rest of Console, you can go to the [Create New Users](https://console.snowplowanalytics.com/users/new) page and add a user with the `Data applications user` role. That user will then only see the Data Applications tab within Console. 

## Building a funnel

We suggest you get started by viewing an example funnel, and we have included several out-of-the-box funnels based on standard Snowplow tracking on the `Welcome` tab. Selecting a saved funnel or creating a new funnel will take you to the `Define and View your Funnel` tab, which has the following options: 


**Schema and Table**: Here you can select which warehouse schema and table you want to run the analysis on. If you select `atomic.events`, we have included some additional functionality allowing you to reference properties inside nested columns, otherwise you can only reference flat columns. 

**Prefilter**: This applies a filter to all funnel events. To minimize query costs, we recommend including a filter on the partition key of your table. For `atomic.events`, this is usually `load_tstamp`.  


**Funnel Steps** - Here you can define an unlimited number of steps. Each step requires a name and one or more rules, which can be combined together using conditional logic. 

## Additional Settings

You can customize your funnel by changing the following values: 
- **Order events by -** This must be a timestamp column. If you have added a daterange prefilter, make sure that it is the same field as this one. 
- **Group funnels by -** Choose a field to group the funnels by - we recommend user or session identifiers. 
- **Additional columns to group by -** Use this to visualize additional dimensions in your funnel analysis e.g. experiment groups. 
- **Max days since funnel start** - Maximum days since the funnel's start for an event to still be considered part of that funnel. Set to 0 for unlimited.
- **Intra step time (hours)** - Maximum hours since an event for the next to be included in the same funnel. Set to 0 for unlimited.
- **Funnel count strategy** - First Funnel: Each user only has their first funnel considered even if a later one makes more progress. Unique Funnel: multiple funnels can be counted if they exist.


## Outputs
Clicking `Build Funnel Charts` will generate several interactive charts and tables. You can also download the generated SQL to edit or rerun in your own environment. 

If you would like to visualize these funnels in a different tool, the `Next Steps` tab contains instructions on how to run the generated SQL and recreate the analysis in the following tools: 
- Looker
- PowerBI
- Tableau
- Preset
- Streamlit



