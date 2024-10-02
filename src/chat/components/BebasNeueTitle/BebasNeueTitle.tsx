import { Typography } from 'antd'
import type { TitleProps } from 'antd/es/typography/Title'
import React from 'react'

import type { FCC } from '../../types'
import styles from './BebasNeueTitle.module.scss'

const { Title } = Typography
interface BebasNeueTitleProps extends TitleProps {
  title: string
  style?: React.CSSProperties
}

const BebasNeueTitle: FCC<BebasNeueTitleProps> = ({
  title,
  style,
  ...rest
}) => {
  return (
    <Title
      {...rest}
      style={{ marginBottom: 0, ...style }}
      className={styles.titleStyle}
    >
      {title}
    </Title>
  )
}

BebasNeueTitle.displayName = 'BebasNeueTitle'

export default BebasNeueTitle
