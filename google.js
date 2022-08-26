import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { onPreferencesChanged } from 'cookie-though'
import Cookies from 'js-cookie'
import { DOCS_SITE_URLS, GTM_ID, UA_ID } from './src/constants/config'

// to prevent any possible mess-up with adding the scripts multiple times
const scriptsAttached = [false, false, false]
const isProd = DOCS_SITE_URLS.includes(window.location.hostname)

const attachGTMHeadScript = () => {
  if (scriptsAttached[0]) return

  const headScript = document.createElement('script')

  headScript.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `
  headScript.type='text/javascript'

  document.head.appendChild(headScript)

  scriptsAttached[0] = true
}

const attachGTMBodyScript = () => {
  if (scriptsAttached[1]) return
  const noScript = document.createElement('noscript')
  const iframe = document.createElement('iframe')

  iframe.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`)
  iframe.setAttribute('height', 0)
  iframe.setAttribute('width', 0)
  iframe.setAttribute('style', 'display:none;visibility:hidden;')

  noScript.appendChild(iframe)

  document.body.prepend(noScript)

  scriptsAttached[1] = true
}

const attachGAScripts = () => {
  if (scriptsAttached[2]) return
  const firstScript = document.createElement('script')

  firstScript.setAttribute('async', '')
  firstScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${UA_ID}`)
  firstScript.type='text/javascript'

  firstScript.onload = () => {
    const secondScript = document.createElement('script')

    secondScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${UA_ID}');
    `
    secondScript.type='text/javascript'

    document.body.insertBefore(secondScript, document.body.children[1])
  }

  document.body.prepend(firstScript)

  scriptsAttached[2] = true
}

const setupGoogleTrackers = () => {
  const cookiePreferences = Cookies.get('cookie-preferences')

  if (isProd && cookiePreferences && cookiePreferences.includes('analytics:1')) {
    attachGTMHeadScript()
    attachGTMBodyScript()
    attachGAScripts()
  }
}

if (ExecutionEnvironment.canUseDOM) {
  setupGoogleTrackers()

  onPreferencesChanged((preferences)=> {
    preferences.cookieOptions.forEach(({id, isEnabled}) => {
      if (id === 'analytics' && isEnabled && isProd) {
        attachGTMHeadScript()
        attachGTMBodyScript()
        attachGAScripts()
      }
    })
  })
}