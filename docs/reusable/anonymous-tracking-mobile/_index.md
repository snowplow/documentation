Anonymous tracking is a tracker feature that enables anonymising various user and session identifiers to support user privacy in case consent for tracking the identifiers is not given.

On mobile, the following user and session identifiers can be anonymised:

* Client-side user identifiers: the `userId` in the [Session](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) context entity and the IDFA identifiers (`appleIdfa` and `appleIdfv` for iOS, `androidIdfa` for Android) in the [Platform](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-2) context entity.
* Client-side session identifiers: `sessionId` in Session entity.
* Server-side user identifiers: `network_userid` and `user_ipaddress` event properties.
