import React, { ErrorInfo } from 'react'
import styles from './style.module.scss'
import { FCC } from 'src/types'

interface BoundaryComponentProps extends Omit<any, 'errorInfo'> {
  componentStack?: ErrorInfo['componentStack']
}
export const BoundaryComponent: FCC<BoundaryComponentProps> = ({
  componentStack,
  error,
}) => {
  return (
    <div className={styles.containerBoundary}>
      <h2 className={styles.blockTitle}>Упс! Что-то пошло не так...</h2>
      <a href='/'>На главную</a>
      <details className={styles.homeBtn}>
        <code>{error && error.toString()}</code>
        <br />
        <code>{componentStack}</code>
      </details>
    </div>
  )
}

BoundaryComponent.displayName = 'BoundaryComponent'

export default BoundaryComponent
