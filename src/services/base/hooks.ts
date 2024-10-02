import {
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import BaseServices from 'src/services/base/BaseServices'
import ChoicesServices from 'src/services/base/ChoicesServices'
import { UseMutationOptions } from '@tanstack/react-query/src/types'
import { BaseModel } from 'src/chat/models/Base'

const DEFAULT_RESULTS_KEY = 'results'
/**
 * Хук получения объектов модели
 * @param model
 * @param qKey - ключ сущности из rootReducer и ключ запроса для react-query
 * @param filter
 * @param options - UseQueryOptions
 * @param resultsKey ключ, по которому получаем результаты
 */
export const useFetchItems = <T = any>(
  model: typeof BaseModel,
  filter?: Record<string, any>,
  resultsKey?: string,
  options?: UseQueryOptions,
  qKey?: string | string[]
): { results: T; [key: string]: any } => {
  const queryKey = qKey || model.modelName
  const url = model.url()

  const queryData: Record<string, any> = useQuery(
    [queryKey, filter] as QueryKey,
    () => BaseServices.fetch(url, filter),
    {
      ...options,
    }
  )

  return {
    ...queryData,
    results: queryData?.data?.data?.[resultsKey || DEFAULT_RESULTS_KEY],
  }
}

/**
 * Хук для получения одного объекта модели
 * @param model
 * @param qKey - ключ сущности из rootReducer и ключ запроса для react-query
 * @param id
 * @param options
 */
export const useFetchOneItem = (
  model: typeof BaseModel,
  id: string | number | undefined,
  options?: UseQueryOptions,
  qKey?: string
) => {
  const url = model.url()
  const queryKey = qKey || model.modelName
  useChoices(queryKey, url)

  return useQuery(
    [queryKey, id] as QueryKey,
    () => BaseServices.fetchOne(url, id),
    {
      onError: () => console.error('Ошибка при загрузке данных'),
      ...options,
    }
  )
}

/**
 * Хук создание объекта модели
 * @param model
 * @param qKey - ключ сущности из rootReducer и ключ мутации для react-query
 * @param options - доп параметры передаваемые в axios
 */
export const useCreateItem = (
  model: typeof BaseModel,
  options: object = {},
  qKey?: string
) => {
  const url = model.url()
  return useMutation((item: any) => BaseServices.create(url, item, options), {
    mutationKey: [qKey || model.modelName],
  })
}

/**
 * Хук обновления объекта модели
 * @param model
 * @param qKey - ключ сущности из rootReducer и ключ мутации для react-query
 */
export const useUpdateItem = (model: typeof BaseModel, qKey?: string) => {
  const url = model.url()
  const queryKey = qKey || BaseModel.modelName
  return useMutation(
    ([id, fields]: [string | number | undefined, any]) =>
      BaseServices.update(url, id, fields),
    {
      mutationKey: [queryKey],
    }
  )
}

/**
 * Хук удаления объекта модели
 * @param model
 * @param qKey - ключ сущности из rootReducer и ключ мутации для react-query
 */
export const useDeleteItem = (model: typeof BaseModel, qKey?: string) => {
  const url = model.url()
  const handleDelete = async (id?: string | number) => {
    if (!id) {
      throw new Error('Не указан id')
    }
    try {
      return await BaseServices.delete(url, id)
    } catch (e: any) {
      if (e.response?.status === 403) {
        console.error('Ошибка при удалении объекта', e.response)
      }
      throw e
    }
  }
  return useMutation(handleDelete, {
    mutationKey: [qKey || model.modelName],
  })
}

/**
 * Хук для получения одного объекта модели по экстара экшенам
 * @param qKey - ключ запроса для react-query
 * @param extraUrl
 * @param filter
 * @param options
 */
export const useFetchExtraAction = (
  qKey: string | string[],
  extraUrl: string,
  filter?: Record<string, any>,
  options?: UseQueryOptions
) => {
  return useQuery(
    [qKey, filter] as QueryKey,
    () => BaseServices.fetchExtra(extraUrl, filter),
    {
      ...options,
    }
  )
}

/**
 * Хук для post запросов по экстра экшенам
 * @param qKey - ключ запроса для react-query
 * @param extraUrl
 * @param options
 */
export const usePostExtraActions = <FieldsType = Record<string, any>>(
  qKey: string,
  extraUrl: string,
  options?: UseQueryOptions
) => {
  return useMutation<unknown, unknown, any>({
    ...options,
    mutationFn: (fields: FieldsType) =>
      BaseServices.postExtra(extraUrl, fields),
    mutationKey: [qKey],
  } as unknown as UseMutationOptions)
}

/**
 * Хук для patch запросов по экстра экшенам
 * @param qKey - ключ запроса для react-query
 * @param extraUrl
 * @param options
 */
export const usePatchExtraActions = <FieldsType>(
  qKey: MutationKey,
  extraUrl: string,
  options?: UseQueryOptions
) => {
  return useMutation<any, any, any>({
    mutationFn: (fields: FieldsType) =>
      BaseServices.patchExtra(extraUrl, fields),
    mutationKey: qKey,
    ...options,
  } as unknown as UseMutationOptions)
}

/**
 * Хук для post запросов по экстра экшенам
 * Урл передается в мутации, а не при инициализации
 * @param qKey - ключ запроса для react-query
 * @param options
 */
export const useExtraActionsPost = <FieldsType>(
  qKey: string,
  options?: UseQueryOptions
) => {
  return useMutation<unknown, unknown, any>({
    mutationFn: ({ url, record }: { url: string; record: FieldsType }) =>
      BaseServices.postExtra(url, record),
    mutationKey: qKey,
    ...options,
  } as unknown as UseMutationOptions)
}
/**
 * Хук для patch запросов по экстра экшенам
 * Урл передается в мутации, а не при инициализации
 * @param qKey - ключ запроса для react-query
 * @param options
 */
export const useExtraActionsPatch = (
  qKey: MutationKey,
  options?: UseQueryOptions
) => {
  return useMutation<unknown, unknown, any>({
    ...options,
    mutationFn: ([extraUrl, fields]: [
      extraUrl: string,
      fields: Record<string, any>
    ]) => BaseServices.patchExtra(extraUrl, fields),
    mutationKey: qKey,
  } as unknown as UseMutationOptions)
}
/**
 * Хук для put запросов по экстра экшенам
 * Урл передается в мутации, а не при инициализации
 * @param qKey - ключ запроса для react-query
 * @param options
 */
export const useExtraActionsPut = (qKey: string, options?: UseQueryOptions) => {
  return useMutation({
    mutationKey: qKey,
    ...options,
    mutationFn: ([extraUrl, fields]: [
      extraUrl: string,
      fields: Record<string, any>
    ]) => BaseServices.putExtra(extraUrl, fields),
  } as unknown as UseMutationOptions)
}
/**
 * Хук для get запросов по экстра экшенам
 * Урл передается в мутации, а не при инициализации
 * @param qKey - ключ запроса для react-query
 * @param extraUrl
 * @param options
 */
export const useExtraActionsGet = ({
  qKey,
  extraUrl,
  options,
}: {
  qKey: string
  extraUrl: string
  options?: UseQueryOptions
}) => {
  return useQuery([qKey] as QueryKey, () => BaseServices.fetchExtra(extraUrl), {
    ...options,
  })
}

export const useChoices = (
  qKey: string,
  url: string,
  options?: UseQueryOptions
) => {
  return useQuery(
    [`${qKey}Choices`] as QueryKey,
    () => ChoicesServices.getChoices(url),
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  )
}
