/**
 * Client module that strips `noreferrer` from external links pointing to
 * Snowplow-owned domains. Keeps `noopener` for security. Uses Docusaurus's
 * onRouteDidUpdate lifecycle to run once per page navigation.
 */

const SNOWPLOW_DOMAINS = [
  'snowplow.io',
  'snowplowanalytics.com',
  'iglucentral.com',
]

function isSnowplowDomain(hostname) {
  return SNOWPLOW_DOMAINS.some(
    (d) => hostname === d || hostname.endsWith('.' + d)
  )
}

function patchLinks() {
  document.querySelectorAll('a[rel~="noreferrer"]').forEach((a) => {
    try {
      const { hostname } = new URL(a.href)
      if (!isSnowplowDomain(hostname)) return
      const updated = a.rel.replace(/\bnoreferrer\b/, '').trim()
      a.rel = updated || null
    } catch {
      // ignore malformed URLs
    }
  })
}

const module = {
  onRouteDidUpdate({ location, previousLocation }) {
    if (location.pathname !== previousLocation?.pathname) {
      patchLinks()
    }
  },
}

export default module
