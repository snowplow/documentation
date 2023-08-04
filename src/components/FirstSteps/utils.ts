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

type CollectorEndpointError = {
  collectorUrlError: string
  statusCode: number
}

export async function getCollectorEndpointError(
  url: string,
  appId: string
): Promise<CollectorEndpointError> {
  if (url === '') {
    return { collectorUrlError: 'Required', statusCode: 0 }
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return {
      collectorUrlError: 'Please specify a valid protocol (usually, https://)',
      statusCode: 0,
    }
  }
  if (!isValidUrl(url)) {
    return { collectorUrlError: 'Please enter a valid URL', statusCode: 0 }
  }
  const status = await checkCollectorEndpoint(url, appId)
  if (status !== 200) {
    return {
      collectorUrlError:
        'Invalid response from the Collector. Please ensure the URL is correct and the Collector is running',
      statusCode: status,
    }
  } else {
    return { collectorUrlError: '', statusCode: 200 }
  }
}

export function getAppIdError(appId: string): string {
  if (appId === '') {
    return 'Required'
  } else {
    return ''
  }
}

async function checkCollectorEndpoint(
  url: string,
  appId: string
): Promise<number> {
  const timeout = 1000
  let timeoutId
  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), timeout)

    const resp = await fetch(url + '/health', {
      signal: controller.signal,
      mode: 'no-cors',
    })

    clearTimeout(timeoutId)
    if (resp.status === 200) {
      return resp.status
    }
  } catch (_e) {
    clearTimeout(timeoutId)
  }

  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), timeout)

    const resp = await fetch(`${url}/i?e=pv&aid=${appId}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    return resp.status
  } catch (_e) {
    clearTimeout(timeoutId)
    return 0
  }
}
