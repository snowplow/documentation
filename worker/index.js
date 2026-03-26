import { findRedirect } from './redirects.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirect = findRedirect(url.pathname);

    if (redirect) {
      const target = redirect.to.startsWith('http')
        ? redirect.to
        : `${url.origin}${redirect.to}`;
      return Response.redirect(target, redirect.status);
    }

    return env.ASSETS.fetch(request);
  },
};
