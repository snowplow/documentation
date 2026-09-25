/**
 * Client module that strips `noreferrer` from all external links.
 * Keeps `noopener` for security. Uses Docusaurus's onRouteDidUpdate
 * lifecycle to run once per page navigation.
 */

function patchLinks() {
  document.querySelectorAll('a[rel~="noreferrer"]').forEach((a) => {
    const updated = a.rel.replace(/\bnoreferrer\b/, '').trim()
    a.rel = updated || null
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
