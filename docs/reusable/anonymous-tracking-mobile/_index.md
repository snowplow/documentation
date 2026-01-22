Anonymous tracking is a feature that enables anonymization of various user and session identifiers, to support user privacy when consent for tracking the identifiers isn't given.

On mobile, the following [user and session identifiers](/docs/events/ootb-data/user-and-session-identification/index.md) can be anonymized:

* Client-side user identifiers:
   * `userId`, a device ID, in the session entity
   * IDFA identifiers (`appleIdfa` and `appleIdfv` for iOS, `androidIdfa` for Android) in the mobile entity
   * Atomic properties `user_id`, `domain_userid`, `network_userid`, and `user_ipaddress` if you set them in `Subject`
* Client-side session identifiers:
  * `sessionId` and `previousSessionId` in the session entity
* Server-side user identifiers:
  * `network_userid` and `user_ipaddress`, set by the [Collector](/docs/pipeline/collector/index.md)
