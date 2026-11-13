import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '@/services/authService'
import type { LoginUser } from '@/types'

// 로그인한 사용자. 새로고침하면 서버 세션(/api/auth/me)에서 다시 읽는다.
interface AuthValue {
  user: LoginUser | null
  checked: boolean
  signIn: (form: { mbId: string; loginId: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    authService
      .me()
      .then((me) => setUser(me ?? null))
      .catch(() => setUser(null))
      .finally(() => setChecked(true))
  }, [])

  const signIn = useCallback(async (form: { mbId: string; loginId: string; password: string }) => {
    setUser(await authService.login(form))
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  return <AuthContext.Provider value={{ user, checked, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('AuthProvider 안에서만 쓸 수 있습니다.')
  }
  return value
}
