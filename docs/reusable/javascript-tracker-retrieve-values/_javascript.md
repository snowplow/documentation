If you call `snowplow` with a function as the argument, the function will be executed when `sp.js` loads:

```javascript
snowplow(function () {
  console.log("sp.js has loaded");
});
```

Or equivalently:

```javascript
snowplow(function (x) {
  console.log(x);
}, "sp.js has loaded");
```

The callback you provide is executed as a method on the internal `trackerDictionary` object. You can access the `trackerDictionary` using `this`.

```javascript
// Configure a tracker instance named "sp"
snowplow('newTracker', 'sp', '{{COLLECTOR_URL}', {
 appId: 'snowplowExampleApp'
});

// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var domainUserId = sp.getDomainUserId();
 console.log(domainUserId);
})
```

The callback function shouldn't be a method:

```javascript
// TypeError: Illegal invocation
snowplow(console.log, "sp.js has loaded");
```

This won't work because the value of `this` in the `console.log` function will be the `trackerDictionary`, rather than `console`.

You can get around this problem using `Function.prototoype.bind` as follows:

```javascript
snowplow(console.log.bind(console), "sp.js has loaded");
```

For more on execution context in JavaScript, see the [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).
