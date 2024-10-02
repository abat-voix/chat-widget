import type { PermissionRulesProps } from '../../services/base/types'

export interface ChatUsersModelProps {
  id: string | number
  username: string
  avatar: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  full_name: string
  middle_name: string
  is_need_add_info: true
  permission_rules: PermissionRulesProps
}

export class ChatUsersModel {
  static modelName = 'user'

  static url() {
    return '/user/users'
  }

  static changePasswordUrl() {
    return `${this.url()}/change-password/`
  }
}
