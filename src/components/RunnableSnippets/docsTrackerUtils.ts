export enum DocsTrackerField {
  APP_ID = 'appId',
  COLLECTOR_URL = 'collectorUrl',
}

export enum DocsTrackerEvent {
  TRACKER_SANDBOX_CHANGE = 'docsTrackerSandboxChange',
  OPEN_DRAWER = 'docsTrackerDrawerOpen',
}

/** Returns the app ID in localStorage for the docs tracker */
export function getDocsTrackerAppId(): string | null {
  return window.localStorage.getItem(DocsTrackerField.APP_ID)
}

/** Returns the collector URL in localStorage for the docs tracker */
export function getDocsTrackerCollectorUrl(): string | null {
  return window.localStorage.getItem(DocsTrackerField.COLLECTOR_URL)
}

/** Returns the app ID and collector URL in localStorage for the docs tracker */
export function getDocsTrackerFields(): {
  appId: DocsTrackerField.APP_ID | null
  collectorUrl: DocsTrackerField.COLLECTOR_URL | null
} {
  return {
    appId: getDocsTrackerAppId() as DocsTrackerField.APP_ID | null,
    collectorUrl:
      getDocsTrackerCollectorUrl() as DocsTrackerField.COLLECTOR_URL | null,
  }
}

// Custom event that contains the new iframe element of the tracker sandbox
export type TrackerSandboxChangeEvent = CustomEventInit<{
  iframe: HTMLIFrameElement
}>

/** Dispatches an event to change the tracker sandbox iframe */
export function dispatchTrackerSandboxChangeEvent(iframe: HTMLIFrameElement) {
  window.dispatchEvent(
    new CustomEvent(DocsTrackerEvent.TRACKER_SANDBOX_CHANGE, {
      detail: {
        iframe,
      },
    } as TrackerSandboxChangeEvent)
  )
}

/** Dispatches an event to open the docs tracker drawer */
export const dispatchOpenDrawerEvent = () => {
  window.dispatchEvent(new CustomEvent(DocsTrackerEvent.OPEN_DRAWER))
}

/** Sets the app ID in localStorage for the docs tracker */
export function setDocsTrackerFields(
  appId: string,
  collectorUrl: string
): void {
  window.localStorage.setItem(DocsTrackerField.APP_ID, appId)
  window.localStorage.setItem(DocsTrackerField.COLLECTOR_URL, collectorUrl)
}

/** Returns true, if all the required fields are set in localStorage */
export function docsTrackerEnabled(): boolean {
  return Boolean(getDocsTrackerAppId() && getDocsTrackerCollectorUrl())
}

/*
 * Returns true if the given metastring contains the word "runnable"
 * Used to determine whether to show the "Run" button on a code snippet
 */
const runnableRegex = /runnable/
export function parseRunnable(metastring?: string): boolean {
  if (!metastring) {
    return false
  }
  return runnableRegex.test(metastring)
}

/*
 * Returns the hostname of the current environment
 * For use with postMessage, as we need to specify the origin when sending a message
 * to the sandboxed tracker iframe
 */
export function getHost(): string {
  const { protocol, hostname, port } = window.location
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`
}
