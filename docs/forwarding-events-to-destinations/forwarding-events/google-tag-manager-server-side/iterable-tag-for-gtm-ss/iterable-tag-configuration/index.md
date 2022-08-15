---
title: "Iterable Tag Configuration"
date: "2021-11-24"
sidebar_position: 100
---

## Iterable API Key (Required)

Set this to the API of your Iterable HTTP API Data Source.

Iterable provides four different types of API keys, each of which can access a different subset of Iterable's API endpoints. For the endpoints currently in use (`events/track` and `users/update`) the Javascript type key has enough permissions. The Mobile and Standard key types have more permissions than the Javascript type, so can also be used.

## Identity Settings

Iterable requires users to be identified to work best. The options in this section configure how you wish to identify users to Iterable based on your Snowplow events.

### Use client\_id for anonymous users

Specify whether client\_id is used to create a placeholder email for anonymous users. This is useful for implementations where there is no identifiers for a user besides device identifiers (such as Browser Cookies).

### Use email\_address from common user data

Use email\_address from common user data. For Snowplow Tracking, the common user data can be populated by using the `iglu:com.google.tag-manager.server-side/user_data/jsonschema/1-0-0` context entity. This schema is available on [Iglu Central](https://github.com/snowplow/iglu-central/blob/853357452300b172ebc113d1d75d1997f595142a/schemas/com.google.tag-manager.server-side/user_data/jsonschema/1-0-0).

Deselecting this option allows for any other properties of the event to be selected for the e-mail\_address property on the Iterable event.

### User user\_id from common user data

Iterable can also accept a User Id, rather than the preferred e-mail address. Enabling this property will use the user\_id property from the server-side common event as the userId identifier of the user.

## Identify Event

Iterable allows for user information to be updated once a user has identified themselves. For example, to update their placeholder email to their real email address.

### Use the default `identify` event

To Identify a user to Iterable, you can send a Self Describing `Identify` event. This schema is available on Iglu Central.

For example, using the JavaScript Tracker v3, this would look like:

```
window.snowplow('trackSelfDescribingEvent', {
  schema: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0',
  data: {
    id: '2c5ba856-ee07-47b5-a3a6-63100026ed63',
    email: 'john.doe@example.com'
  }
})
```

If you would like to specify your own event, disabling this option allows you to select your own event name and properties which can used to fire identity updates to Iterable.

In general, "identity events" are the event names which will make the Iterable Tag call the `/users/update` [API endpoint](https://api.iterable.com/api/docs#users_updateUser) (create or update a user), using the identifiers and the user\_data specified by the tag configuration. These events might be different than the default Snowplow Identify schema, for example sign\_up, login etc, from your own custom event schemas.

## Snowplow Event Mapping Options

### Include Self Describing event

Indicates if a Snowplow Self Describing event should be in the `dataFields` object.

### Snowplow Event Context Rules

This section describes how the Iterable tag will use the context Entities attached to a Snowplow Event.

#### Extract entity from Array if single element

Snowplow Entities are always in Arrays, as multiple of the same entity can be attached to an event. This option will pick the single element from the array if the array only contains a single element.

#### Include all Entities in event\_properties

Leaving this option enabled ensures that all Entities on an event will be included within the Event Data of the Iterable event.

If disabling this, individual entities can be selected for inclusion. These entities can also be remapped to have different names in the Iterable event, and can be included in either event data or user data. The entity can be specified in two different formats:

- Major version match: `x-sp-contexts_com_snowplowanalytics_snowplow_webPage_1` where `com_snowplowanalytics_snowplow` is the event vendor, `webPage` is the schema name and `1` is the Major version number. `x-sp-` can also be omitted from this if desired
- Full schema match: `iglu:com.snowplowanalytics.snowplow/webPage/jsonschema/1-0-0`

#### Include unmapped entities in event\_properties

If remapping or moving some entities to User Data with the above customization, you may wish to ensure all unmapped entities are still included in the event. Enabling this option will ensure that all entities are mapped into the Iterable event.

### Additional Event Mapping Options

If you wish to map other properties from a Client event into an Iterable event they can be specified in this section.

#### Event Property Rules

##### Include common event properties

Enabling this ensures properties from the [Common Event](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) are automatically mapped to the Iterable Event Data.

##### Additional Event Property Mapping Rules

Specify the Property Key from the Client Event, and then the key you could like to map it to or leave the mapped key blank to keep the same name. You can use Key Path notation here (e.g. `x-sp-tp2.p` for a Snowplow events platform or `x-sp-contexts.com_snowplowanalytics_snowplow_web_page_1.0.id` for a Snowplow events page view id (in array index 0) or pick non-Snowplow properties if using an alternative Client.

#### User Property Rules

##### Include common user properties

Enabling this ensures user\_data properties from the [Common Event](https://developers.google.com/tag-platform/tag-manager/server-side/common-event-data) are automatically mapped to the Iterable Event Properties.

##### Additional User Property Mapping Rules

Specify the Property Key from the Client Event, and then the key you could like to map it to or leave the mapped key blank to keep the same name. You can use Key Path notation here (e.g. `x-sp-tp2.p` for a Snowplow events platform or `x-sp-contexts.com_snowplowanalytics_snowplow_web_page_1.0.id` for a Snowplow events page view id (in array index 0) or pick non-Snowplow properties if using an alternative Client.

## Advanced Event Settings

### Merge user dataFields

Enabling this option will merge the user dataFields when updating an Iterable user, instead of replacing with the new user data, which is the default behavior.
