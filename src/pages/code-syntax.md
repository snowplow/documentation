---
title: Code syntax
---

# Code syntax examples

Uses Prism by default - see <https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/vendor/prism/includeLangs.js> for what languages can be marked up. They have their own styling.

```bash
#bash
wget https://github.com/snowplow-incubator/igluctl/releases/download/0.10.0/igluctl_0.10.0.zip
unzip igluctl_0.10.0.zip
```

```javascript
// Javascipt
<script type="text/javascript" async=1>
;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));
</script>
```

```python
# Python
def setNewInstanceCount(self, new_instance_count):
    self._new_instance_count = new_instance_count
```
