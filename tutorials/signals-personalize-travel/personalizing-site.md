---
title: "Personalize site content"
position: 5
description: "Use Snowplow Signals attributes to customize website content including images, descriptions, and layout based on user behavior."
keywords: ["personalization", "content customization", "Signals SDK", "user experience", "behavioral data"]
date: "2025-01-21"
---

```mdx-code-block
import Mermaid from '@theme/Mermaid';
```

You'll now use your behavioral attributes to personalize the website experience in real-time. The travel website uses micro-segmentation based on behavioral data to customize various elements of the user experience.

The personalization system uses five different attributes that represent micro-segments based on user behavior patterns.

## How personalization works

The system personalizes content using these micro-segments:

* `culinary_tourist`: users interested in food and culinary experiences
* `cultural_explorer`: users interested in cultural experiences
* `family_fun`: users interested in family-friendly experiences and destinations
* `modern_urbanite`: users interested in urban experiences like architecture, nightlife, and shopping
* `tranquil_seeker`: users interested in relaxing experiences like beaches, spas, and nature

To determine the most appropriate micro-segment for a user, the system looks at the value for each of these attributes (which are counters) and uses the highest value.

## Data flow

Here's how the personalization works on the destinations page:

<Mermaid value={`
sequenceDiagram
    React Frontend->>+Signals SDK (Node): domain_sessionid
    Signals SDK (Node)->>Signals API: domain_sessionid, service_name
    Signals API->>+Signals SDK (Node): Attribute values
    Signals SDK (Node)->>+React Frontend: Save to LocalStorage
  `}/>

The system uses the Typescript Signals SDK to fetch attribute values from the Signals API and store them in local storage in the browser. It then uses these values to personalize the content on the destinations page.

## What gets personalized

The destinations page customizes:

1. Images relevant to the user's segment
2. Descriptions of locations based on the segment
3. Ordering of star ratings for different destination attributes

The system selects the appropriate content from a predefined JSON structure that includes different images and descriptions for each micro-segment.

## Test the personalization

You can test the personalization by performing different actions across the website to increase the counter for a given micro-segment. Go back to your Jupyter notebook and examine the attribute definitions to see what actions trigger each segment.

Once you've performed 4 or more actions that align with a specific segment, refresh the destinations page. It should now be customized to your segment.

Here's what the page looks like before and after personalization:

![Before personalization](images/no-pers.jpg "Before personalization")

![After personalization (culinary explorer segment)](images/with-pers.jpg "After personalization (culinary explorer segment)")

You can see how the same destination is presented differently based on the user's demonstrated interests and behaviors.
