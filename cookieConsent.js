import { init } from 'cookie-though'

init({
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
  "cookiePreferenceKey": "cookie-preferences",
  "header": {
      "title": "cookie though?",
      "subTitle": "You're probably fed up with these banners...",
      "description": "Everybody wants to show his best side - and so do we. That’s why we use cookies to guarantee you a better experience."
  },
  "cookiePolicy": {
    "url":"/pages/cookie-settings",
    "label":"Read the full cookie declaration",
  },
  "customizeLabel": "Customize"
})