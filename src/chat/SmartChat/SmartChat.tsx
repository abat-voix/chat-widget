import { Card, Form, notification, Spin } from 'antd'
import { isEmpty } from 'lodash'
import React from 'react'

import { useFileDownload } from '../hooks/useFileDownload'

import {
  useCreateItem,
  useExtraActionsGet,
  usePostExtraActions,
} from '../../services/base/hooks'
import type { FCC } from '../../types'
import { BebasNeueTitle } from '../components/BebasNeueTitle'
import { InputMessageContainer } from '../components/InputMessageContainer'
import { Message } from '../components/Message'
import { useScrollIntoView } from '../hooks/useScrollIntoView'
import useSessionId from '../hooks/useUniqUserIdentifier'
import type {
  EntityTypeEnum,
  MessageModelProps,
  NewMessageModelProps,
} from '../models/Message'
import { MessageModel, OwnerTypeEnum } from '../models/Message'
import type { SelectionRequestActualProps } from '../models/SelectionRequest'
import { SelectionRequestModel } from '../models/SelectionRequest'
import styles from './style.module.scss'

const bodyStyle = {
  padding: 8,
  height: '100%',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
} as React.CSSProperties

const headStyle = { backgroundColor: '#3A3A3A' } as React.CSSProperties

const selectionRequestModel = SelectionRequestModel
const messageModel = MessageModel

interface SmartChatProps {
  withoutBotFilters?: boolean
  currentUser?: Record<string, any>
  startUserMessage?: string
  onApplyFilter: (
    key: keyof typeof EntityTypeEnum,
    filter?: Record<string, any>
  ) => void
}
export const SmartChat: FCC<SmartChatProps> = ({
  onApplyFilter,
  withoutBotFilters,
  startUserMessage,
  currentUser,
}) => {
  useSessionId()
  const { fileDownload, isLoading } = useFileDownload()
  const [inputMessageForm] = Form.useForm()
  const {
    data: selectionRequestData,
    isLoading: isLoadingActual,
    refetch: refetchActual,
  }: {
    data: Record<'data', SelectionRequestActualProps> | any
    isLoading: boolean
    refetch: () => void
  } = useExtraActionsGet({
    qKey: 'SelectionRequestActual',
    extraUrl: selectionRequestModel.actualUrl(),
  })

  const { mutate: createMessage, isLoading: isLoadingCreateNewMessage } =
    useCreateItem(messageModel)

  const handleCreateMessage = (text: string) => {
    selectionRequestData?.data?.messages?.push({
      text,
      owner_type: OwnerTypeEnum.USER,
      created_at: new Date().toISOString(),
      id: new Date().toISOString(),
    })
    const msg: NewMessageModelProps = {
      text,
      owner_type: OwnerTypeEnum.USER,
      selection_request: selectionRequestData?.data?.id,
    }
    createMessage(msg, {
      onSuccess: () => {
        refetchActual()
        inputMessageForm.resetFields()
      },
      onError: (error: any) => {
        const defaultErrorText = 'Попробуйте отправить запрос повторно'
        const errorText = error?.detail || error?.message || defaultErrorText

        alert(errorText)
        notification.error({
          message: 'Ошибка при отправке сообщения',
          description: errorText,
          duration: 10,
          closable: true,
        })
        refetchActual()
        console.error('error', error)
      },
    })
  }

  const { mutate: completeChat, isLoading: isLoadingCompleChat } =
    usePostExtraActions(
      'selectionRequestCompleted',
      selectionRequestModel.completedUrl()
    )

  const handleCompleteChat = (type: 'new' | 'save') => {
    completeChat(
      {},
      {
        onSuccess: () => {
          if (type === 'save') {
            notification.success({
              message: 'Запрос успешно сохранен',
              description:
                'Вы можете посмотреть историю запросов в профиле, в разделе "Запросы"',
              duration: 10,
              closable: true,
            })
          }
          refetchActual()
        },
        onError: (error: any) => {
          console.error('error', error)
        },
      }
    )
  }

  const handleDownloadFile = (id: string | number) => {
    fileDownload({
      url: selectionRequestModel.downloadReportUrl(id),
      name: 'Заявка на подбор',
    })
      .then(() => {
        notification.success({
          message: 'Файл успешно скачан',
        })
      })
      .catch(() => {
        notification.error({
          message: 'Ошибка при скачивании файла',
        })
      })
  }
  const messagesEndRef = useScrollIntoView([
    selectionRequestData,
    isLoadingCreateNewMessage,
  ])

  return (
    <Card
      bordered={false}
      title={
        <BebasNeueTitle
          title='Умный помощник'
          level={3}
          style={{
            color: 'white',
          }}
        />
      }
      className={styles.container}
      styles={{
        header: headStyle,
        body: bodyStyle,
      }}
      actions={[
        <div key='infoMsg' className={styles.cardFooter}>
          <InputMessageContainer
            message={startUserMessage}
            form={inputMessageForm}
            isAuthUser={!isEmpty(currentUser)}
            isSaving={isLoadingCompleChat}
            isLoading={isLoadingCreateNewMessage}
            isLoadingPdf={isLoading}
            isDisabled={isLoadingCreateNewMessage}
            onSend={handleCreateMessage}
            onSaveRequest={() => handleCompleteChat('save')}
            onNewChat={() => handleCompleteChat('new')}
            onDownloadPdf={() =>
              handleDownloadFile(selectionRequestData?.data?.id)
            }
          />
        </div>,
      ]}
    >
      <div>
        <Spin spinning={isLoadingActual} />
        <Message
          key={new Date().toISOString()}
          id={new Date().toISOString()}
          text='Привет! Чем могу помочь?'
          created_at={new Date().toISOString()}
          owner_type={OwnerTypeEnum.ASSISTANT}
        />
        {selectionRequestData?.data?.messages?.map(
          (item: MessageModelProps) => (
            <Message
              key={item.id}
              id={item.id}
              text={item.text}
              bot_filter={!withoutBotFilters ? item.bot_filter : undefined}
              created_at={item.created_at}
              owner_type={item.owner_type}
              onApplyFilter={(key, filters) => {
                onApplyFilter(key, filters)
              }}
            />
          )
        )}
        {isLoadingCreateNewMessage ? (
          <Message
            isLoading
            id='loading-id'
            text='Подготавливаю ответ...'
            owner_type={OwnerTypeEnum.ASSISTANT}
          />
        ) : null}
        <div ref={messagesEndRef} />
      </div>
    </Card>
  )
}

SmartChat.displayName = 'SmartChat'

export default SmartChat
