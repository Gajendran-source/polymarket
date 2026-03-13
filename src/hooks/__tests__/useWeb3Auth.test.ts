import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useWeb3Auth } from '../useWeb3Auth'
import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { useAppDispatch } from '@/lib/redux/hooks'
import axios from 'axios'

// Mock dependencies
vi.mock('wagmi')
vi.mock('@/lib/redux/hooks')
vi.mock('axios')

describe('useWeb3Auth', () => {
  const mockDispatch = vi.fn()
  const mockDisconnect = vi.fn()
  const mockSignMessageAsync = vi.fn()
  const mockAddress = '0x1234567890123456789012345678901234567890'

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppDispatch as any).mockReturnValue(mockDispatch)
    ;(useDisconnect as any).mockReturnValue({ disconnect: mockDisconnect })
    ;(useSignMessage as any).mockReturnValue({ signMessageAsync: mockSignMessageAsync })
    ;(useAccount as any).mockReturnValue({ address: mockAddress, isConnected: true })

    // Mock localStorage
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {}
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString()
        }),
        removeItem: vi.fn((key) => {
          delete store[key]
        }),
        clear: vi.fn(() => {
          store = {}
        }),
      }
    })()
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useWeb3Auth())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.address).toBe(mockAddress)
    expect(result.current.isConnected).toBe(true)
  })

  it('should handle successful login flow', async () => {
    const mockMessage = 'Hello world'
    const mockSignature = '0xsignature'
    const mockLoginRes = {
      success: true,
      result: {
        token: 'mock-token',
        proxyWallet: '0xproxy',
        proxyStatus: 'active'
      }
    }

    ;(axios.post as any).mockResolvedValueOnce({ data: { success: true, result: mockMessage } })
    mockSignMessageAsync.mockResolvedValueOnce(mockSignature)
    ;(axios.post as any).mockResolvedValueOnce({ data: mockLoginRes })

    const { result } = renderHook(() => useWeb3Auth())

    await act(async () => {
      await result.current.signAndLogin()
    })

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/get-message'), {
      wallet: mockAddress.toLowerCase()
    })
    expect(mockSignMessageAsync).toHaveBeenCalledWith({ message: mockMessage })
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/verify-login'), {
      wallet: mockAddress.toLowerCase(),
      signature: mockSignature,
      message: mockMessage
    })

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'auth/login',
      payload: expect.objectContaining({
        token: 'mock-token',
        wallet: mockAddress.toLowerCase()
      })
    }))

    expect(window.localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-token')
  })

  it('should handle login failure', async () => {
    const mockErrorMessage = 'Invalid wallet'
    ;(axios.post as any).mockResolvedValueOnce({ data: { success: false, message: mockErrorMessage } })

    const { result } = renderHook(() => useWeb3Auth())

    await act(async () => {
      await result.current.signAndLogin()
    })

    expect(result.current.error).toBe(mockErrorMessage)
    expect(mockDisconnect).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout', payload: undefined })
  })

  it('should handle session refresh', async () => {
    ;(window.localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === 'auth_token') return 'existing-token'
      if (key === 'auth_wallet') return mockAddress.toLowerCase()
      return null
    })

    const mockProxyInfo = {
      success: true,
      result: {
        proxyWallet: '0xproxy',
        proxyStatus: 'active'
      }
    }

    ;(axios.get as any).mockResolvedValueOnce({ data: mockProxyInfo })

    const { result } = renderHook(() => useWeb3Auth())

    await act(async () => {
      // simulate useEffect or direct call
      // result.current.refreshSession()
    })

    // Note: useEffect runs automatically in renderHook
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/auth/proxy-info'), expect.any(Object))
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'auth/login'
    }))
  })

  it('should handle logout', () => {
    const { result } = renderHook(() => useWeb3Auth())

    act(() => {
      result.current.handleLogout()
    })

    expect(mockDisconnect).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout', payload: undefined })
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token')
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_wallet')
  })
})
