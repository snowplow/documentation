import React from 'react'
import { SnowplowIcon } from '../SnowplowIcon'
import Admonition from '@theme/Admonition'

export function Accelerator(props) {
  return (
    <Admonition
      icon={SnowplowIcon()}
      title="Unleash the power of your behavioral data"
      type="tip"
    >
      If you're looking for a more guided approach that contains information
      about tracking and modeling your data, check out our{' '}
      <strong>{props.name}</strong> Accelerator!
      <br />
      <a className="snwpl-nav-button" href={props.href} target="_blank">
        👉 Take me there! 👈
      </a>
    </Admonition>
  )
}

export function AllAccelerators(props) {
  return (
    <Admonition
      icon={SnowplowIcon()}
      title="Unleash the power of your behavioral data"
      type="tip"
    >
      If you're looking for more guided approaches that contains information
      about tracking and modeling your data, check out all our{' '}
      <strong>Data Product Accelerators</strong>!
      <br />
      <a
        className="snwpl-nav-button"
        href="https://snowplow.io/data-product-accelerators/"
        target="_blank"
      >
        👉 Take me there! 👈
      </a>
    </Admonition>
  )
}
