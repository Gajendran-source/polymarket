'use client'

import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { useAppDispatch } from '@/lib/redux/hooks'
import { login, logout } from '@/lib/redux/features/auth/authSlice'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'

/**
 * Hook to handle Web3 Authentication with the backend.
 * Handles signing messages, verifying logins, and managing sessions.
 */
export function useWeb3Auth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = useCallback(() => {
    disconnect()
    dispatch(logout())
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_wallet')
  }, [disconnect, dispatch])

  const signAndLogin = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      // 1. Get message from backend
      const { data: messageRes } = await axios.post(`${API_URL}/auth/get-message`, {
        wallet: address.toLowerCase()
      })

      if (!messageRes.success) throw new Error(messageRes.message)

      const messageToSign = messageRes.result

      // 2. Sign message using the wallet
      const signature = await signMessageAsync({ message: messageToSign })

      // 3. Verify on backend
      const { data: loginRes } = await axios.post(`${API_URL}/auth/verify-login`, {
        wallet: address.toLowerCase(),
        signature,
        message: messageToSign
      })

      if (loginRes.success) {
        const { token, proxyWallet, proxyStatus } = loginRes.result

        // 4. Fetch full user profile so returning users skip onboarding
        let username: string | undefined
        let email: string | undefined
        let isTradingEnabled: boolean | undefined
        let isUSDCapproved: boolean | undefined
        try {
          const { data: profileRes } = await axios.get(`${API_URL}/auth/proxy-info`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (profileRes.success) {
            username = profileRes.result.username
            email = profileRes.result.email
            isTradingEnabled = profileRes.result.isTradingEnabled
            isUSDCapproved = profileRes.result.isUSDCapproved
          }
        } catch (e) {
          // non-fatal — onboarding will just trigger for this session
          console.warn('Could not fetch profile after login:', e)
        }

        // 5. Update Redux state with full user data
        dispatch(login({
          token,
          wallet: address.toLowerCase(),
          proxyWallet,
          proxyStatus,
          username,
          email,
          isTradingEnabled,
          isUSDCapproved,
        }))

        // Store in localStorage for persistence
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_wallet', address.toLowerCase())
      } else {
        throw new Error(loginRes.message || 'Login verification failed')
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Login failed'
      console.error('Login failed:', errorMessage)
      setError(errorMessage)
      handleLogout()
    } finally {
      setIsLoading(false)
    }
  }, [address, signMessageAsync, dispatch, handleLogout])

  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    const storedWallet = localStorage.getItem('auth_wallet')

    if (!token || !storedWallet) return

    setIsLoading(true)
    try {
      const { data: res } = await axios.get(`${API_URL}/auth/proxy-info`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.success) {
        dispatch(login({
          token,
          wallet: storedWallet,
          proxyWallet: res.result.proxyWallet,
          proxyStatus: res.result.proxyStatus,
          username: res.result.username,
          email: res.result.email,
          isTradingEnabled: res.result.isTradingEnabled
        }))
      } else {
        handleLogout()
      }
    } catch (err) {
      console.error('Session refresh failed:', err)
      handleLogout()
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, handleLogout])

  // Auto-refresh session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token && isConnected) {
      refreshSession()
    }
  }, [isConnected, refreshSession])

  return {
    isConnected,
    address,
    isLoading,
    error,
    signAndLogin,
    handleLogout
  }
}
