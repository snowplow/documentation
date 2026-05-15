import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import Cookies from 'js-cookie'
import {
  DOCS_SITE_URLS,
  GTM_ID,
  UA_ID,
} from './src/constants/config'
import { reloadOnce } from './src/helpers/reloadOnce'

// to prevent any possible mess-up with adding the scripts multiple times
const scriptsAttached = [false, false, false]

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
  headScript.type = 'text/javascript'

  document.head.appendChild(headScript)

  scriptsAttached[0] = true
}

const attachGTMBodyScript = () => {
  if (scriptsAttached[1]) return
  const noScript = document.createElement('noscript')
  const iframe = document.createElement('iframe')

  iframe.setAttribute(
    'src',
    `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`
  )
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
  firstScript.setAttribute(
    'src',
    `https://www.googletagmanager.com/gtag/js?id=${UA_ID}`
  )
  firstScript.type = 'text/javascript'

  firstScript.onload = () => {
    const secondScript = document.createElement('script')

    secondScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${UA_ID}');
    `
    secondScript.type = 'text/javascript'

    document.body.insertBefore(secondScript, document.body.children[1])
  }

  document.body.prepend(firstScript)

  scriptsAttached[2] = true
}

if (ExecutionEnvironment.canUseDOM) {
  let consentInitialized = false

  window.ketch('on', 'consent', (consent) => {
    const isProd = DOCS_SITE_URLS.includes(window.location.hostname)
    const analyticsEnabled = consent.purposes?.analytics === true

    if (!consentInitialized) {
      consentInitialized = true
      if (isProd && analyticsEnabled) {
        attachGTMHeadScript()
        attachGTMBodyScript()
        attachGAScripts()
      }
      return
    }

    if (isProd) {
      if (analyticsEnabled) {
        attachGTMHeadScript()
        attachGTMBodyScript()
        attachGAScripts()
      } else {
        Cookies.remove('_ga')
        Cookies.remove('_gid')
        Cookies.remove('_gat_gtag_UA_159566509_1')
        reloadOnce()
      }
    }
  })
}
