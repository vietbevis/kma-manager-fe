import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import type { LoginResponse } from '@/shared/validations/AuthSchema'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface AuthState {
  isAuth: boolean
  userId: string | null
  token: LoginResponse['data'] | null
  role: string | null
  login: (token: LoginResponse) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist<AuthState>(
      (set) => ({
        isAuth: false,
        userId: null,
        token: null,
        role: null,
        login: async (token: LoginResponse) => {
          const decodedToken = decodeToken(token.data.accessToken)
          if (!decodedToken) {
            window.location.href = ROUTES.AUTH.LOGIN
            return
          }
          set({
            isAuth: true,
            token: token.data,
            role: decodedToken.payload.role,
            userId: decodedToken.payload.userId
          })
        },
        logout: () => set({ isAuth: false, token: null, role: null, userId: null })
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
)

export default useAuthStore
