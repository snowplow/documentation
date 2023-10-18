```mdx-code-block
import CodeBlock from '@theme/CodeBlock';
```

## The enableFocalMeterIntegration function

The `enableFocalMeterIntegration` function takes the form:

<>{(props.tracker == 'js-tag') && (<CodeBlock language="javascript">
{`window.snowplow('enableFocalMeterIntegration', { kantarEndpoint, useLocalStorage? });`}
</CodeBlock>)}</>

<>{(props.tracker == 'js-browser') && (<CodeBlock language="javascript">
{`enableFocalMeterIntegration({ kantarEndpoint, useLocalStorage? });`}
</CodeBlock>)}</>

| Parameter | Type | Default | Description | Required |
|---|---|---|---|---|
| `kantarEndpoint` | `string` | \- | URL of the Kantar endpoint to send the requests to (including protocol) | Yes |
| `processUserId` | `(userId: string) => string`   | \- | Callback to process user ID before sending it in a request. This may be used to apply hashing to the value. | Yes |
| `useLocalStorage` | `boolean` | `false` | Whether to store information about the last submitted user ID in local storage to prevent sending it again on next load (defaults not to use local storage) | No |

### Processing the user ID sent in requests to Kantar

By default, the plugin sends the domain user ID as a GET parameter in requests to Kantar without modifying it.
In case you want to apply some transformation on the value, such as hashing, you can provide the `processUserId` callback in the `enableFocalMeterIntegration` call:

<>{(props.tracker == 'js-tag') && (<CodeBlock language="javascript">
{`window.snowplow('enableFocalMeterIntegration', {
    kantarEndpoint: "https://kantar.example.com",
    processUserId: (userId) => md5(userId).toString(), // apply the custom hashing here
});`}
</CodeBlock>)}</>

<>{(props.tracker == 'js-browser') && (<CodeBlock language="javascript">
{`import md5 from 'crypto-js/md5';
enableFocalMeterIntegration({
    kantarEndpoint: "https://kantar.example.com",
    processUserId: (userId) => md5(userId).toString(), // apply the custom hashing here
});`}
</CodeBlock>)}</>

## How does it work?

The plugin inspects the domain user ID property in tracked events.
Whenever it changes from the previously recorded value, it makes an HTTP GET requested to the `kantarEndpoint` URL with the ID as a query parameter.

Optionally, the tracker may store the last published domain user ID value in local storage in order to prevent it from making the same request on the next page load.
If local storage is not used, the request is made on each page load.
