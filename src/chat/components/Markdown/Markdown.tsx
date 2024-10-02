import { Button } from 'antd'
import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import type { FCC } from '../../types'
import { isSafariBrowser } from '../../utils/isSafariBrowser'
import styles from './style.module.scss'

interface MarkdownProps {
  content: string
  className?: string
}
export const Markdown: FCC<MarkdownProps> = ({ content, className }) => {
  const classes = useMemo(() => {
    const cls: string = `${className} prose dark:prose-invert`

    return cls
  }, [className])

  return useMemo(
    () => (
      <div className={classes}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          // @ts-ignore
          rehypePlugins={[rehypeKatex]}
          components={{
            ol({ start, children }) {
              const listItemStart = start || 1
              // для safari ol counterReset: list-item при значении 0 нумерует с 0,
              // а для chrome с 1, поэтому добавлена проверка на браузер
              return (
                <ol
                  start={start ?? 1}
                  style={{
                    counterReset: `list-item ${
                      isSafariBrowser() ? listItemStart : listItemStart - 1
                    }`,
                  }}
                >
                  {children}
                </ol>
              )
            },
            // @ts-ignore
            code({ inline, className: clsName, children, ...props }) {
              const match = /language-(\w+)/.exec(clsName || '')
              const code = String(children)
              return !inline ? (
                <>
                  <div className={styles.code}>
                    <div className={styles.header}>
                      {code.startsWith('<svg') && code.includes('</svg>') && (
                        <Button
                          onClick={() => {
                            const blob = new Blob([code], {
                              type: 'image/svg+xml',
                            })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = 'image.svg'
                            a.click()
                          }}
                        >
                          <i className='fa fa-download' />
                          <span>Download SVG</span>
                        </Button>
                      )}
                    </div>
                    {/*// @ts-ignore*/}
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match?.[1] || 'text'}
                      PreTag='div'
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                  {code.startsWith('<svg') && code.includes('</svg>') && (
                    <div className={styles.imageProview}>
                      <img
                        src={`data:image/svg+xml;base64,${btoa(code)}`}
                        alt='svg'
                      />
                    </div>
                  )}
                </>
              ) : (
                <code className={clsName} {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    ),
    [content, classes]
  )
}

Markdown.displayName = 'Markdown'

export default Markdown
