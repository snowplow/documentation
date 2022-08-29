import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { configure, init } from 'cookie-though'
import Cookies from 'js-cookie'
import { COOKIE_PREF_KEY } from './src/constants/config'

const cookieConfig = {
  "policies": [
    {
      "id": "essential",
      "label": "Essential Cookies",
      "description": "We need to save some technical cookies, for the website to function properly.",
      "category": "essential",
    },
    {
      "id": "analytics",
      "label": "Analytics",
      "category": "analytics",
      "description": "We would like to collect some data about how our visitors use the documentation to improve it.",
    },
  ],
  "permissionLabels": {
    "accept": "Accept",
    "acceptAll": "Accept all",
    "decline": "Decline"
  },
  "cookiePreferenceKey": COOKIE_PREF_KEY,
  "header": {
    "title": "cookie though?",
    "subTitle": "You’re probably fed up with these banners...",
    "description": "We would like to use cookies to understand how you interact with this documentation, so that we can improve the content and the way it’s structured"
  },
  "cookiePolicy": {
    "url":"/cookie-settings",
    "label":"Read our full cookie policy",
  },
  "customizeLabel": "Edit preferences"
}

if(ExecutionEnvironment.canUseDOM) {
  // It's necessary to call this function first before using any of the exported methods from the cookie-though package
  // as each method checks if there's a config object set already and if there isn't they show the popup
  // even when preferences were already set previously. So we can prevent that with this call.
  // The load order of client modules matter because of this as the snowplow / google tracker modules
  // also import and use methods from cookie-though that need the config already set.
  // See: https://github.com/inthepocket/cookie-though/blob/a90d059e0d2e81d612c9bb4afb40f6612bdf02c3/src/lib.ts#L55
  configure(cookieConfig)

  const cookiePreferences = Cookies.get(COOKIE_PREF_KEY)

  if (!cookiePreferences) {
    // this is what displays the cookie preferences popup
    init(cookieConfig)
  }
}
