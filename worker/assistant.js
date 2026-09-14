const ASSISTANT_PATH = '/api/assistant/chat'
const AGENT_PATH = '/api/agent/docs/chat'
const MAX_BODY_BYTES = 128 * 1024
const RATE_LIMIT_RETRY_AFTER_SECONDS = 60

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify({ ...body, status }), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  })
}

async function isRateLimited(env, request) {
  if (!env.ASSISTANT_RATE_LIMITER) {
    console.warn('assistant: rate limiter binding missing, skipping rate limit')
    return false
  }
  const key = request.headers.get('cf-connecting-ip') || 'unknown'
  const { success } = await env.ASSISTANT_RATE_LIMITER.limit({ key })
  return !success
}

export async function handleAssistantRequest(request, env, url) {
  if (url.pathname !== ASSISTANT_PATH) {
    return json({ error: 'Not found' }, 404)
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, { allow: 'POST' })
  }

  const contentLength = Number(request.headers.get('content-length'))
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    return json({ error: 'Request body too large' }, 413)
  }

  if (!env.DOCS_ASSISTANT_AGENT_URL || !env.DOCS_ASSISTANT_SHARED_SECRET) {
    console.error(
      'assistant: DOCS_ASSISTANT_AGENT_URL or DOCS_ASSISTANT_SHARED_SECRET is not configured'
    )
    return json({ error: 'The assistant is not configured' }, 503)
  }

  if (await isRateLimited(env, request)) {
    return json(
      {
        error: 'Too many requests. Please wait a minute and try again.',
        retryAfter: RATE_LIMIT_RETRY_AFTER_SECONDS,
      },
      429,
      { 'retry-after': String(RATE_LIMIT_RETRY_AFTER_SECONDS) }
    )
  }

  const upstream = await fetch(`${env.DOCS_ASSISTANT_AGENT_URL}${AGENT_PATH}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-docs-assistant-secret': env.DOCS_ASSISTANT_SHARED_SECRET,
    },
    body: request.body,
    signal: request.signal,
  })

  const headers = {
    'content-type': upstream.headers.get('content-type') || 'text/event-stream',
    'cache-control': 'no-cache, no-transform',
    'x-accel-buffering': 'no',
  }
  const streamHeader = upstream.headers.get('x-vercel-ai-ui-message-stream')
  if (streamHeader) headers['x-vercel-ai-ui-message-stream'] = streamHeader

  return new Response(upstream.body, { status: upstream.status, headers })
}
