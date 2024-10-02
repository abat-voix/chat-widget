import axios from 'axios'
import Cookie from 'js-cookie'
import Qs from 'qs'
const paramsSerializer = (params: any) => {
  return Qs.stringify(params, { indices: false })
}
const config = {
  baseURL: 'https://example.com/api',
  timeout: 60000,
  withCredentials: true,
  paramsSerializer,
}
const apiClient = () => {
  const instance = axios.create({
    ...config,
  })
  instance.interceptors.request.use((request: any) => {
    request.headers['X-CSRFToken'] = Cookie.get('csrftoken')

    // для расширения идентификатор пользователя хранится в localStorage
    // так как нет доступа к родительским кукам
    request.headers['Generated-User-Id'] =
      localStorage.getItem('GENERATE_USER_ID')
    return request
  })

  instance.interceptors.response.use(
    (response: any) => {
      return response
    },
    (error: any) => {
      throw error
    }
  )
  return instance
}
export default apiClient()
