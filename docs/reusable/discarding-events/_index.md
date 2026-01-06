Sometimes you don’t want the event to appear in your data warehouse or lake, e.g. because you suspect it comes from a bot and not a real user.

Starting with Enrich 5.3.0, it is possible to drop an event by calling `event.drop()` in JavaScript enrichment code:

```js
const botPattern = /.*Googlebot.*/;

function process(event) {
  const useragent = event.getUseragent();

  if (useragent !== null && botPattern.test(useragent)) {
    event.drop();
  }
}
```

This mechanism can be used to drop not only good events, but also invalid events. The dropped events will not be sent to any stream or destination, thus lowering the infrastructure costs.

:::warning

There is no way to recover dropped events therefore use it with caution.

:::

Another way to discard events is throwing an exception in your JavaScript code, which will send the event to [failed events](/docs/fundamentals/failed-events/index.md):

```js
const botPattern = /.*Googlebot.*/;

function process(event) {
  const useragent = event.getUseragent();

  if (useragent !== null && botPattern.test(useragent)) {
    throw "Filtered event produced by Googlebot";
  }
}
```

:::warning

This will create an “enrichment failure” failed event, which may be tricky to distinguish from genuine failures in your enrichment code, e.g. due to a mistake.

:::
