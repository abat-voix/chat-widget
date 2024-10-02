import { Button, Col, Flex, Row, Space, Spin } from 'antd'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import React, { useMemo } from 'react'
import { Markdown } from 'src/chat/components/Markdown'
import { useDateTimePrettyStr } from 'src/chat/hooks/useDateTimePrettyStr'
import type { MessageModelProps } from 'src/chat/models/Message'
import { EntityTypeEnum, OwnerTypeEnum } from 'src/chat/models/Message'
import { WhoOwnerType } from 'src/chat/types'
import type { FCC } from 'src/types'

import styles from './style.module.scss'

interface MessageProps extends MessageModelProps {
  isLoading?: boolean
  onApplyFilter?: (
    key: keyof typeof EntityTypeEnum,
    filters: Record<string, any>
  ) => void
}

const who: Record<string, string> = {
  [OwnerTypeEnum.ASSISTANT]: WhoOwnerType.ASSISTANT,
  [OwnerTypeEnum.USER]: WhoOwnerType.USER,
}

export const Message: FCC<MessageProps> = ({
  text,
  created_at,
  owner_type,
  isLoading,
  onApplyFilter,
  bot_filter,
}) => {
  const { dateFormatter } = useDateTimePrettyStr()
  const currentJustify = useMemo(
    () => (owner_type === OwnerTypeEnum.USER ? 'end' : 'start'),
    [owner_type]
  )

  return (
    <Row className={styles.row}>
      <Col span={24}>
        <Row justify={currentJustify}>
          <Col
            className={clsx(
              styles.container,
              owner_type === OwnerTypeEnum.USER && styles.user,
              owner_type === OwnerTypeEnum.ASSISTANT && styles.bot
            )}
          >
            <Flex vertical>
              <Space direction='horizontal' align='baseline'>
                {isLoading ? <Spin size='small' /> : null}
                <Markdown content={text} />
              </Space>
              {!isEmpty(bot_filter) ? (
                <Space direction='vertical'>
                  {Object.entries(bot_filter).map(([key, filterValue]: any) => (
                    <Button
                      key={key}
                      danger
                      onClick={() => onApplyFilter?.(key, filterValue)}
                    >
                      {EntityTypeEnum[key as keyof typeof EntityTypeEnum]}
                    </Button>
                  ))}
                </Space>
              ) : null}
            </Flex>
          </Col>
          <Col span={24}>
            <Row justify={currentJustify}>
              <h5 className={styles.whoAndDate}>
                {who[owner_type]}
                {created_at ? `, ${dateFormatter({ date: created_at })}` : null}
              </h5>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

Message.displayName = 'Message'

export default Message
