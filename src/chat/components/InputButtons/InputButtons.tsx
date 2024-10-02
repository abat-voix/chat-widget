import {
  FilePdfFilled,
  MenuOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Dropdown,
  Form,
  type MenuProps,
  Row,
  Space,
  Tooltip,
} from 'antd'
import React, { useMemo } from 'react'

import type { FCC } from '../../types'
import { BebasNeueTitle } from '../BebasNeueTitle'
import styles from './InputButtons.module.scss'

interface InputButtonsProps {
  isLoadingPdf?: boolean
  isAuthUser?: boolean
  isSaving?: boolean
  onSaveRequest?: () => void
  onNewChat?: () => void
  onDownloadPdf?: () => void
}

const InputButtons: FCC<InputButtonsProps> = ({
  isAuthUser,
  isSaving,
  onSaveRequest,
  onNewChat,
  onDownloadPdf,
  isLoadingPdf,
}) => {
  const items: MenuProps['items'] = useMemo(
    () => [
      {
        label: (
          <Button type='link'>
            <BebasNeueTitle level={5} title='Сохранить запрос и начать новый' />
          </Button>
        ),
        key: 'save',
        onClick: onSaveRequest,
      },
      {
        label: (
          <Button type='link'>
            <BebasNeueTitle level={5} title='Скачать PDF файл' />
          </Button>
        ),
        key: 'load_pdf',
        onClick: onDownloadPdf,
      },
    ],
    []
  )

  return (
    <Row align='middle'>
      {isAuthUser ? (
        <>
          <Col xs={0} md={24}>
            <Space>
              <Form.Item name='save'>
                <Tooltip
                  title='Сохранить запрос и начать новый'
                  placement='top'
                >
                  <Button
                    loading={isSaving}
                    type='text'
                    size='large'
                    icon={<SaveOutlined className={styles.btnIcon} />}
                    onClick={onSaveRequest}
                  />
                </Tooltip>
              </Form.Item>
              <Form.Item name='load_pdf'>
                <Tooltip title='Скачать PDF файл' placement='top'>
                  <Button
                    loading={isLoadingPdf}
                    type='text'
                    size='large'
                    icon={<FilePdfFilled className={styles.btnIcon} />}
                    onClick={onDownloadPdf}
                  />
                </Tooltip>
              </Form.Item>
            </Space>
          </Col>
          <Col xs={24} md={0}>
            <Form.Item name='burger_actions'>
              <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement='topRight'
              >
                <Button
                  loading={isSaving || isLoadingPdf}
                  shape='circle'
                  type='text'
                  icon={<MenuOutlined />}
                  onClick={(e) => e.preventDefault()}
                />
              </Dropdown>
            </Form.Item>
          </Col>
        </>
      ) : (
        <Form.Item name='new_chat'>
          <Tooltip title='Начать новый чат' placement='top'>
            <Button
              loading={isSaving}
              type='text'
              size='large'
              icon={<PlusOutlined className={styles.btnIcon} />}
              onClick={onNewChat}
            />
          </Tooltip>
        </Form.Item>
      )}
    </Row>
  )
}

InputButtons.displayName = 'InputButtons'

export default InputButtons
