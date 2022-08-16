import React, { useEffect } from 'react';

const setupSnowplow = () => {
  var hostname = window.location.hostname;
  var appId;
  if (hostname == "docs.snowplowanalytics.com") { 
    appId = "docs2";
  } else if (hostname == "snowplow-analytics-develop.go-vip.net") {
    appId = "next.docs2";
  } else {
    appId = "test";
  };
  
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://vip-snowplowanalytics-com-preprod.go-vip.net/docs/wp-content/themes/snowplowanalytics/assets/js/XzLhkj3byrnmv5oT.js","snowplow"));

window.snowplow && window.snowplow("newTracker", "snplow5", "collector.snowplowanalytics.com", {    
    appId: appId,
    cookieDomain: ".snowplowanalytics.com",
    cookieName: "_sp5_",
    contexts: {
      webPage: true,
      performanceTiming: true,
      gaCookies: true,
    }
  });
  
window.snowplow && window.snowplow("newTracker", "gtm-eng", "eng-gtm.snowplowanalytics.com", {    
    appId: appId,
    cookieDomain: ".snowplowanalytics.com",
    cookieName: "_sp_gtm_",
    //postPath: "/com.acme/t00",
    contexts: {
      webPage: true,
      performanceTiming: true
    }
  });
  
  window.snowplow("enableLinkClickTracking", true, true, null); 
  
  window.snowplow("enableActivityTracking:snplow5", 10, 10); // precise tracking for the unified log
  
  window.snowplow("trackPageView");
}

// Based on https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
export default function Root({children}) {
  useEffect(setupSnowplow, [])
  return <>
    {children}
  </>;
}