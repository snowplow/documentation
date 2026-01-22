Anonymous tracking is a feature that enables anonymization of various user and session identifiers, to support user privacy when consent for tracking the identifiers isn't given.

On mobile, the following [user and session identifiers](/docs/events/ootb-data/user-and-session-identification/index.md) can be anonymized:

* Client-side user identifiers:
   * `user_id`, `domain_userid`, `network_userid`, and `user_ipaddress`, set by you in `Subject`
   * `userId`, a device ID, set automatically in the [session](/docs/sources/web-trackers/tracking-events/session/index.md) entity
   * IDFA identifiers (`appleIdfa` and `appleIdfv` for iOS, `androidIdfa` for Android) in the mobile entity
* Client-side session identifiers:
  * `previousSessionId` in the session entity, set automatically by the tracker
* Server-side user identifiers:
  * `network_userid` and `user_ipaddress`, set by the [Collector](/docs/pipeline/collector/index.md)

:::note IP address
The Collector captures the IP address from the request HTTP headers, and updates the `user_ipaddress` event property. However, if you set the `user_ipaddress` property in the `Subject`, that value has priority.
:::
