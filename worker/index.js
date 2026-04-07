import { findForcedRedirect, findFallbackRedirect } from './redirects.js';

function toResponse(redirect, url) {
  if (!redirect) return null;
  const target = redirect.to.startsWith('http')
    ? redirect.to
    : `${url.origin}${redirect.to}`;
  return Response.redirect(target, redirect.status);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const forced = toResponse(findForcedRedirect(url.pathname), url);
    if (forced) return forced;

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const fallback = toResponse(findFallbackRedirect(url.pathname), url);
    if (fallback) return fallback;

    return response;
  },
};
