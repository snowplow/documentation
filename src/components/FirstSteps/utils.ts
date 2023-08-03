export function prependProtocol(s: string) {
  // if there is at least some sign of a protocol,
  // it’s better to keep it and have an invalid url
  // rather than interfere with the user typing
  if (s.startsWith('http')) return s

  // if there is no protocol at all, let’s add it
  const parts = s.split('://')
  return parts.length < 2 ? 'https://' + s : s
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
    return 'Invalid response from the Collector. Please ensure the URL is correct and the Collector is running'
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
  try {
    const resp = await fetch(url + '/health', { mode: 'no-cors' })
    if (resp.status === 200) {
      return resp.status
    }
  } catch (_e) {}

  try {
    const resp = await fetch(url + '/com.snowplowanalytics.snowplow/i')

    return resp.status
  } catch (_e) {
    return 0
  }
}
