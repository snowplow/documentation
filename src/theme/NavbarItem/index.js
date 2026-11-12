import React from 'react'
import clsx from 'clsx'
import NavbarItem from '@theme-original/NavbarItem'
import styles from './styles.module.css'

// Every navbar item except search moves into the mobile menu on narrow
// screens (see styles.module.css)
export default function NavbarItemWrapper(props) {
  if (props.type === 'search') return <NavbarItem {...props} />
  return (
    <NavbarItem
      {...props}
      className={clsx(props.className, !props.mobile && styles.customized)}
    />
  )
}
