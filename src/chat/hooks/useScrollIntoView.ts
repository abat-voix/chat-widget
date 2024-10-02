import { useEffect, useRef } from 'react'

/**
 * Хук для скролла вниз при изменении зависимостей
 * @param dependencies
 */
export const useScrollIntoView = (dependencies: any[]) => {
  const ref = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, dependencies)

  return ref
}

/**
 * Хук для скролла вниз при вызове функции
 */
export const useScrollIntoViewOnCall = () => {
  const ref = useRef<null | HTMLDivElement>(null)
  const scroll = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return [ref, scroll] as const
}
