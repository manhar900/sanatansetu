'use client'

import * as React from 'react'

type AdminContextValue = {
  isAdmin: boolean
  token: string | null
  login: (password: string) => Promise<boolean>
  logout: () => void
  authedFetch: (url: string, init?: RequestInit) => Promise<Response>
}

const AdminContext = React.createContext<AdminContextValue | null>(null)

const STORAGE_KEY = 'sanatan-setu-admin-token'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null)
  const [isAdmin, setIsAdmin] = React.useState(false)

  // On mount: load token from localStorage and verify with the server.
  React.useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (!stored) return
    setToken(stored)
    fetch('/api/admin/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => setIsAdmin(res.ok))
      .catch(() => setIsAdmin(false))
  }, [])

  const login = React.useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      const newToken: string | undefined = data?.token
      if (!newToken) return false
      setToken(newToken)
      setIsAdmin(true)
      try {
        window.localStorage.setItem(STORAGE_KEY, newToken)
      } catch {
        // ignore storage failures
      }
      return true
    } catch {
      return false
    }
  }, [])

  const logout = React.useCallback(() => {
    setToken(null)
    setIsAdmin(false)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const authedFetch = React.useCallback(
    (url: string, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers)
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return fetch(url, { ...init, headers })
    },
    [token]
  )

  const value = React.useMemo<AdminContextValue>(
    () => ({ isAdmin, token, login, logout, authedFetch }),
    [isAdmin, token, login, logout, authedFetch]
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminContextValue {
  const ctx = React.useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return ctx
}
