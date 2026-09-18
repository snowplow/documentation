/**
 * Dev-only proxy for the Snowplow Assistant widget.
 *
 * In production the Cloudflare Worker serves `/api/assistant/*` on the same
 * origin as the site. `docusaurus start` has no Worker, so when
 * `ASSISTANT_PROXY_TARGET` is set (for example `http://localhost:8787` from
 * `wrangler dev`) the dev server forwards `/api/assistant` requests there.
 * Without the variable the plugin does nothing.
 */
module.exports = function assistantDevProxyPlugin() {
  return {
    name: 'docusaurus-plugin-assistant-dev-proxy',
    configureWebpack() {
      const target = process.env.ASSISTANT_PROXY_TARGET
      if (!target) {
        return {}
      }
      return {
        devServer: {
          proxy: [
            {
              context: ['/api/assistant'],
              target,
              changeOrigin: true,
              secure: false,
            },
          ],
        },
      }
    },
  }
}
