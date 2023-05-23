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

| Parameter         | Type       | Default             | Description                                                                                                                                                 | Required |
|-------------------|------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `kantarEndpoint`  | `string`   | \-                  | URL of the Kantar endpoint to send the requests to (including protocol)                                                                                     | Yes      |
| `useLocalStorage` | `boolean`  | `false`             | Whether to store information about the last submitted user ID in local storage to prevent sending it again on next load (defaults not to use local storage) | No       |

## How does it work?

The plugin inspects the domain user ID property in tracked events.
Whenever it changes from the previously recorded value, it makes an HTTP GET requested to the `kantarEndpoint` URL with the ID as a query parameter.

Optionally, the tracker may store the last published domain user ID value in local storage in order to prevent it from making the same request on the next page load.
If local storage is not used, the request is made on each page load.
