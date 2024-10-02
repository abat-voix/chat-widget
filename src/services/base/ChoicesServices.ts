import apiClient from 'src/plugins/apiClient'
import { SomeObject } from 'src/components/types'

export default class ChoicesServices {
  static async getChoices(url: string) {
    try {
      const response = await apiClient.options(`${url}/`)
      const options: SomeObject = response.data.actions.POST
      const result = {} as SomeObject
      for (const [key, value] of Object.entries(options)) {
        if (value?.type === 'choice') {
          result[key] = value
        }
      }
      return result
    } catch (error: any) {
      return error.response
    }
  }
}
