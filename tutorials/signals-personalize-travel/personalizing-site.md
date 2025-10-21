---
title: "Personalize content with behavioral data"
position: 5
description: "Use Snowplow Signals attributes to customize website content, including images, descriptions, and layout based on user behavior."
keywords: ["personalization", "content customization", "Signals SDK", "user experience", "behavioral data"]
date: "2025-01-21"
---

```mdx-code-block
import Mermaid from '@theme/Mermaid';
```

Now that your behavioral attributes are collecting data, you can use this information to personalize the website experience in real-time. Effective personalization goes beyond simply showing different content; it involves understanding user preferences and adapting the entire experience to match their interests.

The travel website will use micro-segmentation based on behavioral data to customize various elements of the user experience. This approach allows for dynamic personalization that evolves as users interact with different types of content.

## Identify user micro-segments

The personalization system uses five different attributes that represent micro-segments based on user behavior patterns:

These are:
- `culinary_tourist`: users who appear to be interested in food and culinary experiences
- `cultural_explorer`: users who appear to be interested in cultural experiences
- `family_fun`: users who appear to be interested in more family friendly based experiences and destinations
- `modern_urbanite`: users who appear to be interested in more modern and urban based experiences and destinations like architecture, nightlife and shopping
- `tranquil_seeker`: users who appear to be interested in more tranquil and relaxing experiences and destinations like beaches, spas and nature

To determine the most appropriate micro-segment for a user, you'll look at the value for each of these attributes (that are counters) and take the highest value and use that.

## Data flow

Let's have a look at what the data flow will look like in order to achieve this personalization on the destinations page.

<Mermaid value={`
sequenceDiagram
    React Frontend->>+Signals SDK (Node): domain_sessionid
    Signals SDK (Node)->>Signals API: domain_sessionid, service_name
    Signals API->>+Signals SDK (Node): Attribute values
    Signals SDK (Node)->>+React Frontend: Save to LocalStorage
  `}/>

To achieve this personalization we will use the [Typescript Signals SDK](https://github.com/snowplow-incubator/snowplow-signals-typescript-sdk) to fetch the attribute values from the Signals API (which requires authentication) and store these in local storage in the browser. We can then use these values to personalize the content on the destinations page.

## Customizing the page

Within our travel site we have a 'Destinations' home page which will customise by:
1. Selecting images relevant to the segment
2. Modifying the copy (description) of the location based on the segment
3. Re-ordering (if relevant) the star ratings of different destination attributes

We implement this in a reasonably straightforward way by selecting the appropriate fields from a predefined JSON structure similar to the following.

```
[
  {
    "name": "Bangkok",
    "country": "Thailand",
    "image": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1950&ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "images_category": {
      "cultural_explorer": "https://images.unsplash.com/photo-1690299490301-2eb3865bee58?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "family_fun": "https://images.unsplash.com/photo-1733150632166-8d8752da4ff6?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "modern_urbanite": "https://images.unsplash.com/photo-1593103499244-6c882f0163cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "tranquil_seeker": "https://images.unsplash.com/photo-1591233244269-d8c4bcbbf1dd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "culinary_tourist": "https://images.unsplash.com/photo-1506781961370-37a89d6b3095?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "description": "Vibrant capital with street food, temples, and bustling markets",
    "descriptions": {
      "cultural_explorer": "Grand palaces, ancient temples, and rich history await. Discover the soul of Thailand's capital.",
      "family_fun": "Kids love the tuk-tuks, canal tours, and vibrant markets. A city of endless family adventures.",
      "culinary_tourist": "A street food paradise with an explosion of flavours. Authentic Thai cuisine at every turn.",
      "tranquil_seeker": "Find peace in serene temples, tranquil gardens, and riverside long-tail boat journeys.",
      "modern_urbanite": "A vibrant, non-stop metropolis with world-class nightlife, shopping, and cutting-edge art."
    }
    }
]
```

For simplicity these values are hardcoded but it is also possible to have them generated using generative AI - resulting in more unique (but somewhat more randomized) results.

## Testing the customization

There are several different actions you can perform across the website to increase the counter for a given microsegment. Go back to the Jupyter notebook and find a given segment and read the attribute definition to see if you can figure out what some of these are.

Once you've performed 4 or more of these actions refresh the destinations page and it should be customized to your segment!

Before Signals personalization

![Before personalization](screenshots/no-pers.jpg "Before personalization")

After Signals personalization (culinary explorer microsegment)

![After personalization](screenshots/with-pers.jpg "After personalization (culinary explorer segment)")
