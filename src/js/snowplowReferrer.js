/**
 * Client module that strips `noreferrer` from external links pointing to
 * Snowplow-owned domains. Keeps `noopener` for security. Runs after each
 * page render via a MutationObserver so it catches links added by React.
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

function patchLink(a) {
  if (!a.rel || !a.href) return
  try {
    const { hostname } = new URL(a.href)
    if (!isSnowplowDomain(hostname)) return
    const updated = a.rel.replace(/\bnoreferrer\b/, '').trim()
    a.rel = updated || null
  } catch {
    // ignore malformed URLs
  }
}

function patchAll(root = document) {
  root.querySelectorAll('a[rel~="noreferrer"]').forEach(patchLink)
}

if (typeof window !== 'undefined') {
  // Patch links on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => patchAll())
  } else {
    patchAll()
  }

  // Patch links added by React on client-side navigation
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue
        if (node.tagName === 'A') patchLink(node)
        if (node.querySelectorAll) {
          node.querySelectorAll('a[rel~="noreferrer"]').forEach(patchLink)
        }
      }
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}
