import React, { ForwardedRef, forwardRef } from 'react'

type SandboxProps = {
  name: string
  collectorUrl: string
  appId: string
  ref: React.Ref<HTMLIFrameElement>
}

// This sandboxed (inside an iframe) tracker is used as the user-configurable tracker. This is to:
// - avoid tracking events to every tracker on the docs site
// - prevent us having to namespace every tracking call to avoid sending them to the user tracker
//
// It is destroyed/recreated when the collector url/app id are updated in the menu
export const SnowplowSandbox = forwardRef(
  (props: SandboxProps, ref: ForwardedRef<HTMLIFrameElement>) => (
    <iframe
      ref={ref}
      style={{ display: 'none' }}
      name={props.name}
      srcDoc={`
      <html>
        <head>
          <script type="text/javascript">
            ;(function (p, l, o, w, i, n, g) {
              if (!p[i]) {
                p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []
                p.GlobalSnowplowNamespace.push(i)
                p[i] = function () {
                  ;(p[i].q = p[i].q || []).push(arguments)
                }
                p[i].q = p[i].q || []
                n = l.createElement(o)
                g = l.getElementsByTagName(o)[0]
                n.async = 1
                n.src = w
                g.parentNode.insertBefore(n, g)
              }
            })(window, document, 'script', '/js/sandboxed-sp.js', 'snowplow')

            const allowedOrigins = [
              /docs.snowplow\.io/,
              /localhost/,
              /deploy-preview-\\d+--snowplow-docs\.netlify\.app/,
            ]
        
            window.snowplow('newTracker', 'sp1', "${props.collectorUrl}", {
              appId: "${props.appId}",
            })
        
            window.addEventListener(
              'message',
              (event) => {
                if (allowedOrigins.some((origin) => origin.test(event.origin))) {
                  eval(event.data)
                }
              },
              false
            )
          </script>
        </head>
      </html>
    `}
    />
  )
)
