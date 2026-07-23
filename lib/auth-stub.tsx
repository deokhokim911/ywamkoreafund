'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type DemoRole = 'guest' | 'donor' | 'missionary' | 'admin'

type AuthStubValue = {
  role: DemoRole
  setRole: (role: DemoRole) => void
  isLoggedIn: boolean
}

const AuthStubContext = createContext<AuthStubValue | null>(null)

export const AuthStubProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<DemoRole>('guest')
  const value = useMemo(
    () => ({
      role,
      setRole,
      isLoggedIn: role !== 'guest',
    }),
    [role],
  )

  return (
    <AuthStubContext.Provider value={value}>{children}</AuthStubContext.Provider>
  )
}

export const useAuthStub = (): AuthStubValue => {
  const ctx = useContext(AuthStubContext)
  if (!ctx) {
    return {
      role: 'guest',
      setRole: () => undefined,
      isLoggedIn: false,
    }
  }
  return ctx
}
