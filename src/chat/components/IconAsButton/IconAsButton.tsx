import React from 'react'

import type { FCC } from '../../types'
import styles from './style.module.scss'

interface IconAsButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: any
}
export const IconAsButton: FCC<IconAsButtonProps> = ({
  icon: Icon,
  ...rest
}) => {
  return <Icon className={styles.icon} {...rest} />
}

IconAsButton.displayName = 'IconAsButton'

export default IconAsButton
