import { SendOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd'
import { Button, Col, Form, Input, Row } from 'antd'
import React, { useEffect } from 'react'

import type { FCC } from '../../types'
import InputButtons from '../InputButtons/InputButtons'

const { TextArea } = Input

const formStyle = { margin: '8px 24px 0' }

interface InputMessageContainerProps {
  message?: string
  isAuthUser?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  isLoadingPdf?: boolean
  isSaving?: boolean
  form: FormInstance
  onSend: (message: string) => void
  onSaveRequest?: () => void
  onNewChat?: () => void
  onDownloadPdf?: () => void
}
export const InputMessageContainer: FCC<InputMessageContainerProps> = ({
  onSend,
  isAuthUser,
  isDisabled,
  form,
  isLoading,
  isSaving,
  onSaveRequest,
  onNewChat,
  onDownloadPdf,
  isLoadingPdf,
  message,
}) => {
  const inputRef = React.useRef<any>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus() // Устанавливаем фокус на поле ввода
    }
  }, [isDisabled])

  const handleSendClick = () => {
    form.validateFields().then((values) => {
      onSend(values.message)
    })
  }

  return (
    <Form
      form={form}
      layout='horizontal'
      wrapperCol={{ span: 24 }}
      initialValues={{ message }}
      disabled={isDisabled}
      onFinish={handleSendClick}
    >
      <Row align='middle' justify='space-between' style={formStyle}>
        <Col>
          <InputButtons
            isAuthUser={isAuthUser}
            isSaving={isSaving}
            isLoadingPdf={isLoadingPdf}
            onSaveRequest={onSaveRequest}
            onNewChat={onNewChat}
            onDownloadPdf={onDownloadPdf}
          />
        </Col>
        <Col span={17}>
          <Form.Item name='message' required>
            <TextArea
              ref={inputRef}
              autoSize={{ minRows: 1, maxRows: 3 }}
              autoFocus
              placeholder='Введите сообщение'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  // Если нажата клавиша Enter с Cmd
                  e.preventDefault() // Предотвращаем отправку формы
                  const { value, selectionStart, selectionEnd } =
                    e.target as HTMLTextAreaElement
                  const newValue = `${value.substring(
                    0,
                    selectionStart
                  )}\n${value.substring(selectionEnd)}`
                  form.setFieldsValue({ message: newValue }) // Устанавливаем новое значение с символом новой строки
                  setTimeout(() => {
                    ;(e.target as HTMLTextAreaElement).selectionStart =
                      selectionStart + 1 // Перемещаем курсор на новую строку
                    ;(e.target as HTMLTextAreaElement).selectionEnd =
                      selectionStart + 1
                  }, 0)
                } else if (e.key === 'Enter' && !e.metaKey) {
                  // Если нажата клавиша Enter без Cmd
                  e.preventDefault() // Предотвращаем переход на новую строку
                  handleSendClick() // Отправляем сообщение
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                loading={isLoading}
                type='text'
                size='large'
                disabled={!form.getFieldValue('message') || isDisabled}
                htmlType='submit'
                icon={
                  <SendOutlined
                    style={{
                      fontSize: '26px',
                    }}
                  />
                }
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default InputMessageContainer
