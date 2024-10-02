import React from 'react'
import './index.css'
import { App } from './containers'
import reportWebVitals from './reportWebVitals'
import ReactDOM from 'react-dom/client'
import './i18n/i18n'
import { ConfigProvider } from 'antd'
import { themeCustom } from 'src/theme/theme'
import './theme/index.scss'
import 'antd/dist/reset.css'
import ruRu from 'antd/locale/ru_RU'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import { getQueriesStaleTimeMinutes } from 'src/utils/getConfig'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const qClientConfig = {
  defaultOptions: { queries: { staleTime: getQueriesStaleTimeMinutes() } },
}

const queryClient = new QueryClient(qClientConfig)

const containerId = 'root-invest-plugin'
const rootElement = document.getElementById(containerId)

if (rootElement) {
  const root: any = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={themeCustom} locale={ruRu}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
} else {
  console.error(`Failed to find the root element with id ${containerId}`)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
