import * as React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { themeCustom } from 'src/theme/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'

const queryClient = new QueryClient()

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ConfigProvider theme={themeCustom}>
    <QueryClientProvider client={queryClient}>
      <ProSidebarProvider>
        <Router>{children}</Router>
      </ProSidebarProvider>
    </QueryClientProvider>
  </ConfigProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }

AllProviders.displayName = 'AllProviders'
