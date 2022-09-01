import React from "react"
import Content from "@theme-original/DocSidebar/Desktop/Content"
import styles from "./styles.module.css"

export default function ContentWrapper(props) {
  return (
    <>
      <Content {...props} className={styles.extraPadding} />
    </>
  )
}
