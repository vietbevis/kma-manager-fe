import { useAuthStore } from '@/features/auth'
import envConfig from '@/shared/config/envConfig'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { RefreshTokenResponse } from '../validations/AuthSchema'
import API_ROUTES from './api-routes'
import ROUTES from './routes'

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: envConfig.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().token?.accessToken

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    if (originalRequest?.url?.includes(API_ROUTES.AUTH.REFRESH_TOKEN)) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = useAuthStore.getState().token?.refreshToken

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await api.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, {
          refreshToken
        })

        useAuthStore.getState().login(response.data)

        const newToken = response.data.data.accessToken
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        processQueue(null, newToken)

        isRefreshing = false

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)

        isRefreshing = false

        useAuthStore.getState().logout()
        window.location.href = ROUTES.AUTH.LOGIN

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
