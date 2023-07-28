import { v4 as uuidv4 } from 'uuid'
import { newTracker } from '@snowplow/browser-tracker'

/*
 * Set the global namespace for snowplow so typescript doesn't complain
 */
declare global {
  interface Window {
    snowplow: any
  }
}

export const LIVE_SNIPPET_TRACKER_PREFIX = 'snowplowDocs-'
/*
 * The fields that are stored in localStorage for the live snippet tracker
 * APP_ID and COLLECTOR_URL are self-explanatory, but the ID is a random UUID
 * that is generated when the user changes/sets the Collector URL or App ID
 * in the live snippet tracker settings.
 *
 * This allows the user to edit the Collector endpoint and App ID
 * as many times as they want, as we have to create a new tracker
 * every time they do so
 */
export enum DocsTrackerField {
  ID = 'trackerId',
  APP_ID = 'appId',
  COLLECTOR_ENDPOINT = 'collectorEndpoint',
}

/*
 * Returns the tracker ID in localStorage for the live snippet tracker
 */
export function getDocsTrackerTrackerId(): string | null {
  return window.localStorage.getItem(DocsTrackerField.ID)
}

/*
 * Returns the app ID in localStorage for the live snippet tracker
 */
export function getDocsTrackerAppId(): string | null {
  return window.localStorage.getItem(DocsTrackerField.APP_ID)
}

/*
 * Returns the collector URL in localStorage for the live snippet tracker
 */
export function getDocsTrackerCollectorUrl(): string | null {
  return window.localStorage.getItem(DocsTrackerField.COLLECTOR_ENDPOINT)
}

/*
 * Sets the required fields in localStorage for the live snippet tracker
 */
export function setDocsTrackerFields({
  trackerId,
  appId,
  collectorEndpoint,
}: {
  trackerId: string
  appId: string
  collectorEndpoint: string
}) {
  window.localStorage.setItem(DocsTrackerField.ID, trackerId)
  window.localStorage.setItem(DocsTrackerField.APP_ID, appId)
  window.localStorage.setItem(
    DocsTrackerField.COLLECTOR_ENDPOINT,
    collectorEndpoint
  )
}

/*
 * Returns true if all the required fields are set in localStorage
 */
export function docsTrackerFieldsSet(): boolean {
  return Boolean(
    getDocsTrackerTrackerId() &&
      getDocsTrackerAppId() &&
      getDocsTrackerCollectorUrl()
  )
}

/*
 * Returns the namespace for the live snippet tracker
 */
export function getDocsTrackerNamespace(): string {
  return LIVE_SNIPPET_TRACKER_PREFIX + getDocsTrackerTrackerId()
}

/*
 * Creates a new tracker ID and stores it in localStorage
 * @returns the new tracker ID
 */
export function createDocsTrackerTrackerNamespace(uuid): string {
  window.localStorage.setItem(DocsTrackerField.ID, uuid)
  return LIVE_SNIPPET_TRACKER_PREFIX + uuid
}

/*
 * Creates a new tracker with the fields in localStorage
 */
export function newDocsTrackerFromLocalStorage() {
  if (!docsTrackerFieldsSet()) {
    console.warn('Docs tracker fields not set in localStorage')
  } else {
    newTracker(getDocsTrackerNamespace(), getDocsTrackerCollectorUrl()!!, {
      appId: getDocsTrackerAppId()!!,
      bufferSize: 1,
    })
  }
}

/*
 * Creates a new tracker with the given app ID and collector URL
 * Sets APP_ID, COLLECTOR_URL and ID in localStorage
 */
export function newDocsTrackerFromAppIdAndCollectorUrl(
  appId: string,
  collectorEndpoint: string
) {
  const trackerId: string = uuidv4()
  setDocsTrackerFields({ appId, collectorEndpoint, trackerId })
  newTracker(createDocsTrackerTrackerNamespace(trackerId), collectorEndpoint, {
    appId,
    bufferSize: 1,
  })
}

export function isValidUrl(s: string) {
  // new URL will error if empty string
  if (s === '') {
    return true
  }

  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

export function getCollectorEndpointError(url: string, status: number): string {
  if (url === '') {
    return 'Required'
  }

  if (!isValidUrl(url)) {
    return 'Please enter a valid URL'
  } else if (status !== 200) {
    return 'Invalid response from collector - please ensure the URL is correct and the collector is running'
  } else {
    return ''
  }
}

export function getAppIdError(appId: string): string {
  if (appId === '') {
    return 'Required'
  } else {
    return ''
  }
}

export async function checkCollectorEndpoint(url: string): Promise<number> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url
  }

  url = url + '/com.snowplowanalytics.snowplow/i'

  try {
    const resp = await fetch(url, {
      method: 'GET',
    })

    return resp.status
  } catch (e) {
    console.log(e)
    return 0
  }
}
