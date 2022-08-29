import React, { useEffect, useState } from 'react'
import { onPreferencesChanged, show } from 'cookie-though'
import Cookies from 'js-cookie'
import { COOKIE_PREF_KEY } from '../../constants/config'
import styles from './styles.module.css'

export default function ManageCookieSettings() {
  const [consentState, setConsentState] = useState('No consent given')

  useEffect(() => {
    onPreferencesChanged((preferences) => {
      preferences.cookieOptions.forEach(({id, isEnabled}) => {
        if (id === 'analytics') {
          if (isEnabled) {
            setConsentState('Necessary and Analytics cookies enabled')
          } else {
            setConsentState('Only the Necessary cookies are enabled')
          }
        }
      })
    })

    const cookiePreferences = Cookies.get(COOKIE_PREF_KEY)
    if (cookiePreferences) {
      if (cookiePreferences.includes('analytics:1')) {
        setConsentState('Necessary and Analytics cookies enabled')
      } else {
        setConsentState('Only the Necessary cookies are enabled')
      }
    }

  }, [])

  return (
    <p>
      <span className={styles.consentDesc}>Your cookie consent state:</span>
      <span className={styles.consentState}>{consentState}</span>
      <button type='button' className={styles.manageButton} onClick={show}>Manage your consent</button>
    </p>
  );
}