import type { PermissionRulesProps } from '../../services/base/types'
import type { OwnerType } from '../types'
import { BaseModel } from './Base'

export enum OwnerTypeEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface NewMessageModelProps {
  owner_type: OwnerType
  selection_request: string
  text: string
  parent?: number
}

export interface MessageModelProps {
  id: number | string
  owner_type: string
  selection_request?: number
  text: string
  parent?: number
  permission_rules?: string
  created_at?: string
  updated_at?: string
  bot_filter?: BotResponseFilterProps
}

export const EntityKeyEnum = {
  service_support: 'service_support',
  category_problem: 'category_problem',
  investment_object: 'investment_object',
}
export const EntityTypeEnum = {
  [EntityKeyEnum.service_support]: 'Посмотреть меры поддержки',
  [EntityKeyEnum.category_problem]: 'Посмотреть ответы на вопросы',
  [EntityKeyEnum.investment_object]: 'Посмотреть объекты инвестирования',
}

export type BotResponseFilterProps = {
  [key in keyof typeof EntityKeyEnum]?: string
}

export interface MessageModelFilters {
  id: string | number
  created_at?: string
  updated_at?: string
  permissionRules?: PermissionRulesProps
  contentType?: string | number
  user?: string
  user_email?: string
  user_username?: string
  user_first_name?: string
  user_last_name?: string
  user_middle_name?: string
  selection_request?: string
  owner_type: OwnerTypeEnum
  text: string
  created_at_date?: string
  updated_at_date?: string
  ordering?: string
  search?: string
  limit?: number
  offset?: number
}

export class MessageModel extends BaseModel {
  static modelName = 'message'

  static url() {
    return '/personal-cabinet/messages/'
  }
}
