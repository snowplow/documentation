Use the following tag to your page to load `sp.js`:

```javascript
<script type="text/javascript" async=1>
;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));
</script>
```

We recommend self hosting `sp.js` by following our [self hosting](/docs/sources/web-trackers/tracker-setup/hosting-the-javascript-tracker/index.md) guides. All tracker versions are available on [GitHub](https://github.com/snowplow/snowplow-javascript-tracker/releases).

We also recommend renaming `sp.js` as this filename is commonly blocked by adblockers. Renaming to a random string will help ensure the JavaScript Tracker is loaded as expected.

As well as loading the JavaScript Tracker, this tag creates a global function called `snowplow` which you use to access the Tracker. The rest of the documentation will assume that the function is called `snowplow`, but you can replace the string with the function name of your choice.

If you're running multiple JavaScript Trackers on the same page, you can avoid conflicts by specifying different function names for each tracker.

:::info Local testing
If you're testing by opening your HTML file directly from your filesystem, e.g. `file:///home/joe/test.html`, protocol-relative URLs like `//cdn.example.com/sp.js` won't load. Use a local server or specify the full URL with `http://` or `https://`.
:::
