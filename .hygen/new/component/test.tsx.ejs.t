---
to: <%= absPath %>/__tests__/<%= h.changeCase.pascal(component_name) %>.test.tsx
---
import React from 'react'
import { screen } from '@testing-library/react'
import { render } from 'src/test-utils'
import { <%= h.changeCase.pascal(component_name) %> } from '../'

test('renders component successfully', () => {
  render(<<%= h.changeCase.pascal(component_name) %>  />)
  const element = screen.getByTestId('test-<%= component_name %>')
  expect(element).toBeInTheDocument()
})