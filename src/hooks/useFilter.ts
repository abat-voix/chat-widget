import { useState } from 'react'
import { isEmpty } from 'lodash'

/**
 * Хук для сбора query params в один объект
 * @param initValue
 */
export const useFilter = (initValue: any = {}) => {
  const [value, setValue] = useState(initValue)

  const handleFilter = (filter: Record<string, any>) => {
    const filterFieldsWithValue = {} as Record<string, any>

    setValue((prevState: Record<string, any>) => {
      if (isEmpty(filter)) {
        return {}
      } else {
        for (const [key, val] of Object.entries(filter)) {
          if (val) {
            filterFieldsWithValue[key] = val
          } else {
            delete prevState[key]
          }
        }
        return { ...prevState, ...filterFieldsWithValue }
      }
    })
  }

  return [value, handleFilter]
}
