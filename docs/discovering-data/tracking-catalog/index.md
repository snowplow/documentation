---
title: "Tracking catalog"
date: "2022-10-26"
sidebar_position: 0
description: "The Tracking Catalog will provide your team with easy and self serve access to the events you’re tracking, creating greater transparency and autonomy. This can help improve the data culture in your organisation and foster a more collaborative approach to create Data Products."
---

:::note

 Please note that the Tracking Catalog is available only for BDP Customers on selected Tiers. If you're unsure about your eligibility, please get in touch with your Customer Success Manager.

:::

## Introduction

Discovery and understanding of the data your organisation is tracking through Snowplow is essential to enable teams to unlock real value from that data.
We know that in many cases, Data Analysts, Data Scientists and Product Managers struggle to find out what is being tracked, and what the data means. They normally have to rely on tribal knowledge and source this information directly with the front end developers who instrumented the tracking, or raise a request to the Data Team.

However, through the Tracking Catalog, all users can have a holistic view of all their tracking in an always up-to-date and easy to consume view.

### What can you achieve with the Tracking Catalog?
* Check which events and entities you are tracking.
* See what entities are tracked with each event.
* See what events a certain entity is tracked with.
* See what properties are tracked for each event and entity.
* Discover if you are tracking a particular event through searching by name, property or value.

* * *

## Understanding what data is tracked

Once logged in Snowplow Console, you will see a link on the left hand side navigation, called Tracking Catalog. 

![Screenshot of the BDP Console sidebar with the Tracking catalogue menu item highlighted](images/Tracking-Catalog-Nav.png)

Once you navigate to it, you will be presented with a view showing all the Events and Entities that have been tracked your Snowplow production pipelines in the past 90 days.

![Screenshot of the BDP Console Tracking catalog page showing the search bar and search results list](images/TC-Landing-page.png)

If you select a particular [Event](/docs/understanding-tracking-design/understanding-events-entities/index.md), you can see the details of the Event, what properties are tracked for this event, described in plain English therefore easily consumable by a non-technical audience. You can also see any validation criteria associated with this Event.

![Screenshot of the BDP Console in the event properties view](images/event-details.png)

The catalog will also display all [canonical properties](/docs/understanding-your-pipeline/canonical-event/index.md#understanding-the-individual-fields) which are also tracked out of the box, when you use Snowplow trackers.

![Screenshot of a BDP Console modal displaying the canonical properties table](images/canonical-properties.png)

If you scroll down the page, you will see an Event map. 
This map displays what entities are being tracked with the event. This information is really valuable to understand the connections between the data.
It also helps data consumers to make sense of how data is structured in the data warehouse and makes it easier for them to understand how to query it.

![Screenshot of the BDP Console showing the event entities diagram](images/event-map.png)

Similarly, you can navigate to an Entity by selecting one from the map or the list view. This shows you how it’s structured and what Events include it.

For both Events and Entities, the Tracking Catalog also displays a log of version changes to help users understand how the data is evolving through time.

![Screenshot of the BDP Console in the event verions view](images/versions.png)

* * *

## Discovery through the Tracking Catalog

Often, data consumers only have high level information to guide their data discovery process, and are not aware of the exact name of the Data Structure used for tracking certain data.

When you search through the Tracking Catalog, it will look for matches in the Data Structure names, descriptions and property names. In addition, for properties with a fixed set of allowed values (e.g. a `stage` property with values `checkout` and `payment`) Tracking Catalog will look for matches in the values.
You can find the reason behind the match on the right.

![Screenshot of the BDP Console Tracking catalog page showing the results of executing a search](images/search.png)

The Tracking Catalog will provide your team with easy and self serve access to this data, creating greater transparency and autonomy. 
Ultimately this can help improve the data culture in your organisation and foster a more collaborative approach to create Data Products.



