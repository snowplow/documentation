When initialising a tracker, you can use the returned `tracker` instance to access various properties from this tracker instance.

```javascript
// Configure a tracker instance named "sp"
const sp = newTracker('sp', '{{COLLECTOR_URL}', {
 appId: 'snowplowExampleApp'
});

// Access the tracker properties
const domainUserId = sp.getDomainUserId();
```
