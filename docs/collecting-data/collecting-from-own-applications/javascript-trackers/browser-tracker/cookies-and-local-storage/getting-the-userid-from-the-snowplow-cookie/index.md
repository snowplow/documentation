---
title: "Getting the domain user information from the Snowplow Cookie"
date: "2020-03-03"
sidebar_position: 500
---

You can use the following function to extract the Domain User Information from the ID cookie:

```javascript
/*
* Function to extract the Snowplow Domain User Information from the first-party cookie set by the Snowplow JavaScript Tracker
*
* @param string cookieName (optional) The value used for "cookieName" in the tracker constructor argmap
* (leave blank if you did not set a custom cookie name)
*
* @return string or bool The ID string if the cookie exists or false if the cookie has not been set yet
*/
function getSnowplowDuid(cookieName) {
  var cookieName = cookieName || '_sp_';
  var matcher = new RegExp(cookieName + 'id\\.[a-f0-9]+=([^;]+);?');
  var match = document.cookie.match(matcher);
  var split = match[1].split('.');
  if (match && match[1]) {
    return { 
      'domain_userid': split[0], 
      'domain_sessionidx': split[2], 
      'domain_sessionid': split[5]
    }
  } else {
    return false;
  }
}
```

If you set a custom `cookieName` field in the argmap, pass that name into the function; otherwise call the function without arguments. Note that if the function is called before the cookie exists (i.e. when the user is visiting the page for the first time and sp.js has not yet loaded) if will return `false`.
