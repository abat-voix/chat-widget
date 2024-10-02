import type { Dayjs } from 'dayjs'
import type { FC, PropsWithChildren, SyntheticEvent } from 'react'

export type FCC<P = {}> = FC<PropsWithChildren<P>>
export type Nullable<T> = T | null
export type HTMLElementEvent<T extends HTMLElement> = SyntheticEvent & {
  target: T
}
export type RangeValue = [Dayjs | null, Dayjs | null] | null

export type OwnerType = 'user' | 'assistant'
export enum WhoOwnerType {
  USER = 'Вы',
  ASSISTANT = 'Помощник',
}
