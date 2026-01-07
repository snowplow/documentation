Anonymous tracking is a tracker feature that enables anonymizing various user and session identifiers to support user privacy in case consent for tracking the identifiers is not given.

On mobile, the following user and session identifiers can be anonymized:

* Client-side user identifiers:
   * `userId` in the [Session](https://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) context entity
   * IDFA identifiers (`appleIdfa` and `appleIdfv` for iOS, `androidIdfa` for Android) in the [Platform](https://iglucentral.com/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-2) context entity
   * `userId`, `domainUserId`, `networkUserId`, `ipAddress` if they are set in `Subject`
* Client-side session identifiers: `sessionId` and `previousSessionId` in Session entity.
* Server-side user identifiers: `network_userid` and `user_ipaddress` event properties.
