---
title: "Amplitude Tag Configuration"
date: "2021-11-24"
sidebar_position: 100
---

## Amplitude API Key (Required)

Set this to the API of your Amplitude HTTP API Data Source.

## Snowplow Event Mapping Options

### Include Self Describing event

Indicates if a Snowplow Self Describing event should be in the `eventProperties` object.

### Snowplow Event Context Rules

This section describes how the Amplitude tag will use the context Entities attached to a Snowplow Event.

#### Extract entity from Array if single element

Snowplow Entities are always in Arrays, as multiple of the same entity can be attached to an event. This option will pick the single element from the array if the array only contains a single element.

#### Include all Entities in event\_properties

Leaving this option enabled ensures that all Entities on an event will be included within the Event Properties of the Amplitude event.

If disabling this, individual entities can be selected for inclusion. These entities can also be remapped to have different names in the Amplitude event, and can be included in either event properties or user properties. The entity can be specified in two different formats:

- Major version match: `x-sp-contexts_com_snowplowanalytics_snowplow_webPage_1` where `com_snowplowanalytics_snowplow` is the event vendor, `webPage` is the schema name and `1` is the Major version number. `x-sp-` can also be omitted from this if desired
- Full schema match: `iglu:com.snowplowanalytics.snowplow/webPage/jsonschema/1-0-0`

#### Include unmapped entities in event\_properties

If remapping or moving some entities to User Properties with the above customization, you may wish to ensure all unmapped entities are still included in the event. Enabling this option will ensure that all entities are mapped into the Amplitude event.

### Additional Event Mapping Options

If you wish to map other properties from a Client event into an Amplitude event they can be specified in this section.

#### Event Property Rules

##### Include common event properties

Enabling this ensures properties from the [Common Event](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) are automatically mapped to the Amplitude Event Properties.

##### Additional Event Property Mapping Rules

Specify the Property Key from the Client Event, and then the key you could like to map it to or leave the mapped key blank to keep the same name. You can use Key Path notation here (e.g. `x-sp-tp2.p` for a Snowplow events platform or `x-sp-contexts.com_snowplowanalytics_snowplow_web_page_1.0.id` for a Snowplow events page view id (in array index 0) or pick non-Snowplow properties if using an alternative Client. These keys will populate the Amplitude `eventProperties` object.

#### User Property Rules

##### Include common user properties

Enabling this ensures user\_data properties from the [Common Event](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) are automatically mapped to the Amplitude Event Properties.

##### Additional User Property Mapping Rules

Specify the Property Key from the Client Event, and then the key you could like to map it to or leave the mapped key blank to keep the same name. You can use Key Path notation here (e.g. `x-sp-tp2.p` for a Snowplow events platform or `x-sp-contexts.com_snowplowanalytics_snowplow_web_page_1.0.id` for a Snowplow events page view id (in array index 0) or pick non-Snowplow properties if using an alternative Client. These keys will populate the Amplitude `eventProperties` object.

## Advanced Event Settings

### Forward User IP address

Enabling this will forward the IP Address to Amplitude, otherwise Amplitude will not receive the users IP Address.

### Fallback platform identifier

If there is no Platform property on the Client event, this is the value which the Tag will forward to Amplitude.
