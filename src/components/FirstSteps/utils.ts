function isValidUrl(s: string) {
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

export async function getCollectorEndpointError(url: string): Promise<string> {
  if (url === '') {
    return 'Required'
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'Please specify a valid protocol (usually, https://)'
  }
  if (!isValidUrl(url)) {
    return 'Please enter a valid URL'
  }
  const status = await(checkCollectorEndpoint(url))
  if (status !== 200) {
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

async function checkCollectorEndpoint(url: string): Promise<number> {
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
