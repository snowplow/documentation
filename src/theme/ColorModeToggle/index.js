import React from 'react';
import ColorModeToggle from '@theme-original/ColorModeToggle';
import styles from './styles.module.css';

export default function ColorModeToggleWrapper(props) {
  return (
    <>
      <ColorModeToggle {...props} className={styles.extraSpace}/>
    </>
  );
}
