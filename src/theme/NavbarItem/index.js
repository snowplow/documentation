import React from "react"
import NavbarItem from "@theme-original/NavbarItem"
import styles from "./styles.module.css"

export default function NavbarItemWrapper(props) {
  return (
    <>
      <NavbarItem
        {...props}
        className={`${props.className} ${styles.customized}`}
      />
    </>
  )
}
