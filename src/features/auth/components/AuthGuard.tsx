import LoadingSpinner from '@/shared/components/LoadingSpinner'
import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { decodeToken } from '@/shared/lib/jwt'
import ROUTES from '@/shared/lib/routes'
import type { RefreshTokenResponse } from '@/shared/validations/AuthSchema'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import useAuthStore from '../stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { token, login, logout } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = token?.accessToken
        const refreshToken = token?.refreshToken

        // Không có access token - nhân viên chưa đăng nhập
        if (!accessToken) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Giải mã access token
        const decodedAccess = decodeToken(accessToken)
        if (!decodedAccess) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Kiểm tra xem access token có hợp lệ không
        const isAccessTokenExpired = decodedAccess.exp * 1000 < Date.now()

        if (!isAccessTokenExpired) {
          // Access token vẫn hợp lệ
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // Access token hết hạn, thử làm mới
        if (!refreshToken) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Kiểm tra tính hợp lệ của refresh token
        const decodedRefresh = decodeToken(refreshToken)
        if (!decodedRefresh || decodedRefresh.exp * 1000 < Date.now()) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Thử làm mới token
        try {
          const { data } = await api.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, { refreshToken })
          login(data)
          setIsAuthenticated(true)
          setIsLoading(false)
        } catch (error) {
          logout()
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      } catch (error) {
        logout()
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [token, login, logout])

  // Hiển thị spinner khi kiểm tra xem nhân viên có đăng nhập không
  if (isLoading) {
    return <LoadingSpinner isLoading={true} />
  }

  // Chuyển hướng đến trang đăng nhập nếu nhân viên chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />
  }

  // nhân viên đã đăng nhập, hiển thị children
  return <>{children}</>
}

export default AuthGuard
