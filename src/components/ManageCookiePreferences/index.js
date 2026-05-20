import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import styles from './styles.module.css'

const getConsentState = () => {
  try {
    const raw = Cookies.get('_ketch_consent_v1_')
    if (!raw) return null
    const parsed = JSON.parse(atob(decodeURIComponent(raw)))
    return {
      analytics: parsed.analytics?.status === 'granted',
      advertising: parsed.targeted_advertising?.status === 'granted',
    }
  } catch {
    return null
  }
}

const consentLabel = (consent) => {
  if (!consent) return 'You currently have no cookies enabled'

  const enabled = ['Essential Services']
  if (consent.analytics) enabled.push('Data Analytics')
  if (consent.advertising)
    enabled.push('Targeted Advertising and Personalization')

  if (enabled.length === 1)
    return `You currently have only ${enabled[0]} cookies enabled`
  return `You currently have ${enabled.slice(0, -1).join(', ')} and ${
    enabled[enabled.length - 1]
  } cookies enabled`
}

export default function ManageCookiePreferences() {
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    setConsent(getConsentState())

    const handler = () => setConsent(getConsentState())
    window.ketch('on', 'consent', handler)
    return () => window.ketch('off', 'consent', handler)
  }, [])

  return (
    <p>
      <span>{consentLabel(consent)}</span>
      <button
        type="button"
        className={styles.manageButton}
        onClick={() => window.ketch('showPreferences')}
      >
        Preferences
      </button>
    </p>
  )
}
