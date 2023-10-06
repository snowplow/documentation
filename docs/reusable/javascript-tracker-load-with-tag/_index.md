Use the following tag to your page to load `sp.js`:

```javascript
<script type="text/javascript" async=1>
;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));
</script>
```

**Note:** We recommend self hosting `sp.js` by following our Self hosting snowplow JS guides [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md). The latest versions are currently available at [GitHub](https://github.com/snowplow/snowplow-javascript-tracker/releases).

We also recommend renaming `sp.js` as this file name is commonly blocked by adblockers. Renaming to a random string will help ensure the JavaScript Tracker is loaded as expected.

_Important note regarding testing:_ If the URL to sp.js is protocol-relative i.e. beginning with // when fetching `sp.js`. It will work if the your web page is using the “http” or “https” protocol. But if you are testing locally and loading your page from your filesystem using the “file” protocol (so its URI looks something like “file:///home/joe/snowplow_test.html”), the protocol-relative URL will also use that protocol, preventing the script from loading. To avoid this, change the URL to `"http://.../sp.js"` when testing locally.

As well as loading the JavaScript Tracker, this tag creates a global function called “snowplow” which you use to access the Tracker. You can replace the string “snowplow” with the function name of your choice. This is encouraged: if there are two JavaScript trackers on the same page, there won’t be any conflict between them as long as they have chosen different function names. 

:::note
The rest of the documentation will assume that the function is called “snowplow”.
:::
