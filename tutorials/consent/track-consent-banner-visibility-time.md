---
title: Track consent banner visibility time
position: 4
---

Consent management platform banners are an important part of a website's first impression and performance. Snowplow provides a way to track what we call `cmp visible time`, which is the timestamp of the banner becoming visible on the user's screen.

Tracking `cmp visible time` will allow you to detect issues and opportunities in user experience, web performance and consent preference selection and answer:

- Does the time it takes for the consent banner to load affect the consent preference selection?
- Do we observe higher bounce rates when the consent banner takes too long to load?
- Do we get penalized in Core Web Vitals measurements when the consent banner is loaded too early behind the main content?
- What is the average interaction time of our users with the consent banner?

## Track consent banner visibility

Below we'll showcase how you can track banner visibility using the Cookiebot event `CookiebotOnDialogDisplay` signifying the banner has been shown to the visitor's screen. Other CMPs might have similar events or you can use a custom implementation using browser APIs such as [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

### Browser API

```js
window.addEventListener(
  "CookiebotOnDialogDisplay",
  function () {
    /* Using the performance.now API to retrieve the elapsed time from the page navigation. */
    trackCmpVisible({ elapsedTime: performance.now() });
  },
  false
);
```

### JavaScript API

```js
window.addEventListener(
  "CookiebotOnDialogDisplay",
  function () {
    /* Using the performance.now API to retrieve the elapsed time from the page navigation. */
    window.snowplow("trackCmpVisible:{trackerName}", {
      elapsedTime: performance.now(),
    });
  },
  false
);
```
