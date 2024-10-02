import { QueryKey, useInfiniteQuery } from '@tanstack/react-query'
import BaseServices from 'src/services/base/BaseServices'
import { useFilter } from 'src/hooks/useFilter'
import { useChoices } from 'src/services/base/hooks'
import { BaseModel } from 'src/chat/models/Base'
import { useMemo } from 'react'
import { AxiosResponse } from 'axios'

let stagesCounter = {}

interface FetchDataProps {
  pageParam: number
  filters: Record<string, any>
  url: string
}

interface FetchDataResponseProps<ModelType> {
  data: ModelType[]
  nextPage: string
  status: number
  count: number
}

const fetchData = async <ModelType>({
  pageParam: offset = 0,
  filters,
  url,
}: FetchDataProps): Promise<FetchDataResponseProps<ModelType>> => {
  return BaseServices.fetch(url, {
    offset,
    ...filters,
  })
    .then((response: typeof AxiosResponse) => {
      const nextPage = response.data.next ? offset + 10 : undefined
      stagesCounter = response.data.stagesCounter
      return {
        data: response.data.results,
        nextPage,
        status: response.status,
        count: response.data.count,
      }
    })
    .catch((error: any) => {
      console.error(error.response)
      return error.response
    })
}
const getNextPageParam = (
  lastPage: Record<'nextPage', any>
): number | undefined => {
  return lastPage?.nextPage
}

/**
 * Хук для бесконечной подгрузки элементов
 * @param model
 * @param qKeyPrefix - префикс ключа запроса для react query и ключ стора,
 * для рефетча по этому префиксу нужно добавлять Infinity в queryKey ( ${qKeyPrefix}Infinity )
 * (может быть массивом, где первый элемент это queryKey, а второй ключ стора)
 * @param defFilters
 * @param options
 * @param dependOn - дополнительный ключ запросов, от его изменения зависит рефетч
 * @returns - возвращаем все поля useInfiniteQuery
 * и rowData - все загруженные данные одним массивом
 */
export const useInfinityFetchData = <ModelType>(
  model: typeof BaseModel,
  defFilters: object = {},
  options: object = {},
  qKeyPrefix?: string,
  dependOn?: string | number
) => {
  const url = model.url()

  // запрашиваем опции с бека, для прогрузки полей с чойсами
  const qKey = qKeyPrefix || model.modelName
  useChoices(qKey, url)
  const [filters, setFilters] = useFilter({})

  const queryKey = qKeyPrefix
    ? `${qKeyPrefix}Infinity`
    : `${model.modelName}Infinity`

  const infinityData = useInfiniteQuery(
    [queryKey, filters, defFilters, dependOn] as QueryKey,
    ({ pageParam }) =>
      fetchData<ModelType>({
        pageParam,
        filters: { ...defFilters, ...filters },
        url,
      }),
    {
      getNextPageParam,
      refetchOnWindowFocus: false,
      ...options,
    }
  )
  const dataCount = useMemo(
    () => infinityData?.data?.pages?.[0]?.count,
    [infinityData?.data?.pages]
  )
  const rowData: ModelType[] = []
  infinityData.data?.pages?.forEach((page: any) => {
    if (page?.status === 200 && page?.data) {
      rowData.push(...page.data)
    }
  })

  return {
    rowData,
    setFilters,
    ...infinityData,
    stagesCounter,
    dataCount,
  }
}
