import Cookies from 'js-cookie'

/**
 * Whether the reader has granted the analytics purpose in Ketch, the cookie
 * consent manager. Reads the same cookie as snowplow.js, and fails closed: no
 * cookie, a malformed cookie, or no browser all count as no consent.
 */
export function hasAnalyticsConsent() {
  if (typeof document === 'undefined') return false
  try {
    const raw = Cookies.get('_ketch_consent_v1_')
    if (!raw) return false
    const parsed = JSON.parse(atob(decodeURIComponent(raw)))
    return parsed.analytics?.status === 'granted'
  } catch {
    return false
  }
}

/** Open the Ketch preferences dialog, if Ketch has loaded */
export function showCookiePreferences() {
  if (typeof window !== 'undefined' && typeof window.ketch === 'function') {
    window.ketch('showPreferences')
  }
}
