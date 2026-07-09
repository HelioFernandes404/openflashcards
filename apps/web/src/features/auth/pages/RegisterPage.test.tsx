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
import { RegisterPage } from './RegisterPage'

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

function renderRegisterPage() {
  return render(
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>,
  )
}

function fillForm() {
  fireEvent.change(screen.getByTestId('register-nickname-input'), {
    target: { value: 'newuser' },
  })
  fireEvent.change(screen.getByTestId('register-email-input'), {
    target: { value: 'new-user@example.com' },
  })
  fireEvent.change(screen.getByTestId('register-password-input'), {
    target: { value: 'supersecretpass' },
  })
}

describe('RegisterPage', () => {
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

  it('registers successfully and navigates to the dashboard', async () => {
    renderRegisterPage()
    fillForm()

    const submitButton = screen.getByTestId('register-submit-button')
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/' }))
    expect(screen.queryByTestId('register-error-alert')).not.toBeInTheDocument()
  })

  it('shows an error banner and re-enables the form when the email is already used', async () => {
    server.use(
      http.post('*/api/v1/auth/register', () =>
        HttpResponse.json(
          { error: 'Email already registered' },
          { status: 409 },
        ),
      ),
    )
    renderRegisterPage()
    fillForm()

    const submitButton = screen.getByTestId('register-submit-button')
    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(screen.getByTestId('register-error-alert')).toBeInTheDocument(),
    )
    expect(navigateMock).not.toHaveBeenCalled()
    expect(submitButton).not.toBeDisabled()
  })
})
