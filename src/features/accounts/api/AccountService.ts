import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  AccountQuery,
  AccountResponse,
  AccountsResponse,
  CreateAccount,
  PaginatedAccount,
  UpdateAccount
} from '@/shared/validations/AccountSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfiniteAccountQuery = (query: Partial<AccountQuery>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteAccounts', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<AccountsResponse>(API_ROUTES.ACCOUNTS, {
        params: {
          ...query,
          page: pageParam
        }
      })
      return response.data.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, hasNextPage } = lastPage.meta
      return hasNextPage ? currentPage + 1 : undefined
    }
  })
}

export const useGetAccountDetailQuery = (userId: string) => {
  return useQuery({
    queryKey: ['account', userId],
    queryFn: () => api.get<AccountResponse>(`${API_ROUTES.ACCOUNTS}/${userId}`)
  })
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAccount) => api.post<AccountResponse>(API_ROUTES.ACCOUNTS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedAccount>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteAccounts')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: [
              {
                meta: {
                  ...oldData.pages[0].meta,
                  totalItems: oldData.pages[0].meta.totalItems + 1
                },
                items: [res.data.data, ...oldData.pages[0].items]
              },
              ...oldData.pages.slice(1)
            ]
          }
        }
      )
      toast.success('Tạo tài khoản thành công')
    },
    onError: (error) => {
      toast.error('Tạo tài khoản thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateAccountMutation = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAccount) => api.put<AccountResponse>(`${API_ROUTES.ACCOUNTS}/${userId}`, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedAccount>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteAccounts')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page.items.find((item) => item.user.id === userId)) {
                return {
                  ...page,
                  items: page.items.map((item) => (item.user.id === userId ? res.data.data : item))
                }
              }
              return page
            })
          }
        }
      )
      toast.success('Cập nhật tài khoản thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật tài khoản thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => api.delete(`${API_ROUTES.ACCOUNTS}/${userId}`),
    onSuccess: (_, deletedUserId) => {
      queryClient.setQueriesData<InfiniteData<PaginatedAccount>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteAccounts')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.user.id !== deletedUserId),
              meta: {
                ...page.meta,
                totalItems: page.meta.totalItems - 1
              }
            }))
          }
        }
      )
      toast.success('Xóa tài khoản thành công')
    },
    onError: (error) => {
      toast.error('Xóa tài khoản thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
