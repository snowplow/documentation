<details>
<summary>Telemetry notice</summary>

<p>By default, Snowplow collects telemetry data for {props.name}{props.since && ` (since version ${props.since})`}. Telemetry allows us to understand how our applications are used and helps us build a better product for our users (including you!).</p>

This data is anonymous and minimal, and since our code is open source, you can inspect [what’s collected](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.oss/oss_context/jsonschema/1-0-1).

<p>{props.idSetting && (<>If you wish to help us further, you can optionally provide your email (or just a UUID) in the <code>{props.idSetting}</code> {props.settingWord || "configuration setting"}.</>)}</p>

<p>{(props.disableSetting || props.enableSetting) && (<>If you wish to disable telemetry, you can do so by setting <code>{props.disableSetting || props.enableSetting}</code> to <code>{props.enableSetting ? "false" : "true"}</code>.</>)}</p>

<div>{props.children}</div>

See our [telemetry principles](/docs/get-started/self-hosted/telemetry/index.md) for more information.

</details>