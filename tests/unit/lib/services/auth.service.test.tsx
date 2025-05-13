/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuthService } from '../../../../src/modules/auth/useAuth'
import { useAuthStore } from '../../../../src/modules/auth/auth.store'
import { QueryProvider } from '../../../../src/lib/providers/query-provider'

// Create mock for useMutation
vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual('@tanstack/react-query')
	return {
		...actual,
		useMutation: ({ mutationFn }: any) => {
			const mutate = vi.fn((params) => mutationFn(params))
			return {
				mutate,
				isPending: false
			}
		}
	}
})

// Mock the auth store
vi.mock('../../../../src/modules/auth/auth.store', () => ({
	useAuthStore: vi.fn(),
}))

describe('Auth Service', () => {
	const mockStoreLogin = vi.fn()
	const mockStoreRegister = vi.fn()
	const mockStoreLogout = vi.fn()
	const mockStoreClearError = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()

		// Update the mock implementation for useAuthStore
		vi.mocked(useAuthStore).mockReturnValue({
			login: mockStoreLogin,
			register: mockStoreRegister,
			logout: mockStoreLogout,
			clearError: mockStoreClearError,
		})
	})

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryProvider>{children}</QueryProvider>
	)

	it('should provide login mutation', async () => {
		const { result } = renderHook(() => useAuthService(), { wrapper })

		const credentials = { email: 'test@example.com', password: 'password' }
		result.current.login(credentials)

		expect(mockStoreLogin).toHaveBeenCalledWith(credentials)
	})

	it('should provide register mutation', async () => {
		const { result } = renderHook(() => useAuthService(), { wrapper })

		const userData = { email: 'new@example.com', password: 'password', name: 'New User' }
		result.current.register(userData)

		expect(mockStoreRegister).toHaveBeenCalledWith(userData)
	})

	it('should provide logout mutation', async () => {
		const { result } = renderHook(() => useAuthService(), { wrapper })

		result.current.logout()

		expect(mockStoreLogout).toHaveBeenCalled()
	})

	it('should expose mutation status flags', async () => {
		const { result } = renderHook(() => useAuthService(), { wrapper })

		expect(result.current.isLoggingIn).toBe(false)
		expect(result.current.isRegistering).toBe(false)
		expect(result.current.isLoggingOut).toBe(false)
	})

	it('should expose clearError function', async () => {
		const { result } = renderHook(() => useAuthService(), { wrapper })

		result.current.clearError()

		expect(mockStoreClearError).toHaveBeenCalled()
	})
}) 