Anonymous tracking is a tracker feature that enables anonymising various user and session identifiers to support user privacy in case consent for tracking the identifiers is not given.

The affected user and session identifiers are stored in two context entities: [Session](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) and [Platform context](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-2). The Session context entity contains user and session identifiers, while the Platform context entity contains user identifiers. Concretely, the following user and session identifiers can be anonymised:

* Client-side user identifiers: the `userId` in Session context entity and the IDFA identifiers (`appleIdfa`, and `appleIdfv`) in the Platform context entity.
* Client-side session identifiers: `sessionId` in Session context.
* Server-side user identifiers: `network_userid` and `user_ipaddress` event properties.

There are several levels to the anonymisation depending on which of the three categories are affected:
