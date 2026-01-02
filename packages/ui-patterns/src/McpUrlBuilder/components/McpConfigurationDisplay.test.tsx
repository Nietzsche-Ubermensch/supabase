import React from 'react'
import { render, screen } from '@testing-library/react'
import { stringify as stringifyToml } from '@iarna/toml'
import { describe, expect, it, vi } from 'vitest'
import type { McpClientConfig } from '../types'
import { McpConfigurationDisplay } from './McpConfigurationDisplay'

vi.mock('ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  cn: (...values: string[]) => values.filter(Boolean).join(' '),
}))

vi.mock('ui/src/components/CodeBlock', () => ({
  CodeBlock: ({ value, language, ...props }: any) => (
    <div data-testid="code-block" data-language={language ?? ''} {...props}>
      {value}
    </div>
  ),
}))

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt = '', ...props }: any) => <img alt={alt} {...props} />,
}))

describe('McpConfigurationDisplay', () => {
  it('renders TOML configuration when the config file extension is toml', () => {
    const clientConfig: McpClientConfig = {
      mcpServers: {
        supabase: {
          url: 'https://example.com',
        },
      },
    }

    render(
      <McpConfigurationDisplay
        selectedClient={{ key: 'test', label: 'Test', configFile: 'supabase.toml' }}
        clientConfig={clientConfig}
        basePath=""
        onCopyCallback={() => {}}
      />
    )

    const codeBlock = screen.getByTestId('code-block')
    expect(codeBlock.textContent).toBe(stringifyToml(clientConfig as Record<string, any>).trim())
    expect(codeBlock.getAttribute('data-language')).toBe('')
  })
})
