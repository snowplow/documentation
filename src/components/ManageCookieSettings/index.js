import React, { useEffect, useState } from 'react'
import { onPreferencesChanged, show } from 'cookie-though'
import Cookies from 'js-cookie'
import { COOKIE_PREF_KEY } from '../../constants/config'
import styles from './styles.module.css'

export default function ManageCookieSettings() {
  const [consentState, setConsentState] = useState('You currently have no cookies enabled')

  useEffect(() => {
    onPreferencesChanged((preferences) => {
      preferences.cookieOptions.forEach(({id, isEnabled}) => {
        if (id === 'analytics') {
          if (isEnabled) {
            setConsentState('You currently have Necessary and Analytics cookies enabled')
          } else {
            setConsentState('You currently have only the Necessary cookies enabled')
          }
        }
      })
    })

    const cookiePreferences = Cookies.get(COOKIE_PREF_KEY)
    if (cookiePreferences) {
      if (cookiePreferences.includes('analytics:1')) {
        setConsentState('You currently have Necessary and Analytics cookies enabled')
      } else {
        setConsentState('You currently have only the Necessary cookies enabled')
      }
    }

  }, [])

  return (
    <p>
      <span>{consentState}</span>
      <button type='button' className={styles.manageButton} onClick={show}>Settings</button>
    </p>
  );
}