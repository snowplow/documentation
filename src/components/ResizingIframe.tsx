import React, { useEffect, useRef, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

interface Props {
  src: string
  title: string
  initialHeight?: number
}

function ResizingIframeInner({ src, title, initialHeight = 800 }: Props) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(initialHeight)

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return
      if (e.data?.type === 'sp-demo-resize' && typeof e.data.height === 'number') {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      scrolling="no"
      style={{ width: '100%', height: `${height}px`, border: 0, display: 'block' }}
      loading="lazy"
    />
  )
}

export default function ResizingIframe(props: Props) {
  return (
    <BrowserOnly fallback={<div style={{ height: props.initialHeight ?? 800 }} />}>
      {() => <ResizingIframeInner {...props} />}
    </BrowserOnly>
  )
}
