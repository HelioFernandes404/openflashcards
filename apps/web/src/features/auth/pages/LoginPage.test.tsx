import '@testing-library/jest-dom/vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/mocks/server'
import { sessionStorage } from '@/shared/services/sessionStorage'
import { AuthProvider } from '../hooks/useAuth'
import { LoginPage } from './LoginPage'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  Link: ({
    children,
    to,
    ...rest
  }: { children: React.ReactNode; to: string } & Record<string, unknown>) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))

function createStorageStub() {
  const store = new Map<string, string>()
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }),
    clear: vi.fn(() => {
      store.clear()
    }),
  }
}

function renderLoginPage() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageStub())
    sessionStorage.clearSession()
  })

  afterEach(() => {
    cleanup()
    sessionStorage.clearSession()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('logs in successfully and navigates to the dashboard', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByTestId('login-email-input'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByTestId('login-password-input'), {
      target: { value: 'supersecretpass' },
    })

    const submitButton = screen.getByTestId('login-submit-button')
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/' }))
    expect(screen.queryByTestId('login-error-alert')).not.toBeInTheDocument()
  })

  it('shows an error banner and re-enables the form when credentials are invalid', async () => {
    server.use(
      http.post('*/api/v1/auth/login', () =>
        HttpResponse.json({ code: 'UNAUTHORIZED' }, { status: 401 }),
      ),
    )
    renderLoginPage()

    fireEvent.change(screen.getByTestId('login-email-input'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByTestId('login-password-input'), {
      target: { value: 'wrong-password' },
    })

    const submitButton = screen.getByTestId('login-submit-button')
    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(screen.getByTestId('login-error-alert')).toBeInTheDocument(),
    )
    expect(screen.getByTestId('login-error-alert').textContent).toBeTruthy()
    expect(navigateMock).not.toHaveBeenCalled()
    expect(submitButton).not.toBeDisabled()
  })
})
