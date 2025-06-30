import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  CreateUser,
  PaginatedUser,
  UpdateUser,
  User,
  UserQuery,
  UserResponse,
  UsersResponse
} from '@/shared/validations/UserSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { toast } from 'sonner'

export const useInfiniteUserQuery = (query: Partial<UserQuery>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteUsers', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<UsersResponse>(API_ROUTES.USERS, {
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

export const useGetUserDetailQuery = (id: number | undefined) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get<UserResponse>(`${API_ROUTES.USERS}/${id}`),
    enabled: !!id
  })
}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUser) => api.post<UserResponse>(API_ROUTES.USERS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteUsers')
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
      toast.success('Tạo nhân viên thành công')
    },
    onError: (error) => {
      toast.error('Tạo nhân viên thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateUserMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUser) => api.put<UserResponse>(`${API_ROUTES.USERS}/${id}`, data),
    onSuccess: (res) => {
      // Cập nhật ở chi tiết
      queryClient.setQueryData<AxiosResponse<UserResponse>>(['user', id], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: res.data.data
          }
        }
      })

      const oldQueries = queryClient.getQueriesData<InfiniteData<PaginatedUser>>({
        predicate(query) {
          return query.queryKey.includes('infiniteUsers')
        }
      })

      // Kiểm tra sự thay đổi của queryKey là ['teachingStatus', 'academicDegree']
      // Tìm user cũ để kiểm tra xem teachingStatus, academicDegree có thay đổi không
      let oldUser: User | null = null

      for (const [, queryData] of oldQueries) {
        if (queryData) {
          for (const page of queryData.pages) {
            const foundItem = page.items.find((item) => item.id === id)
            if (foundItem) {
              oldUser = foundItem
              break
            }
          }
          if (oldUser) break
        }
      }

      const newTeachingStatus = res.data.data.teachingStatus
      const newAcademicDegree = res.data.data.academicDegree
      const teachingStatusChanged = oldUser !== null && oldUser.teachingStatus !== newTeachingStatus
      const academicDegreeChanged = oldUser !== null && oldUser.academicDegree !== newAcademicDegree

      if (teachingStatusChanged) {
        queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteUsers') &&
                queryParams &&
                'teachingStatus' in queryParams &&
                queryParams.teachingStatus === oldUser?.teachingStatus?.toString()
              )
            }
          },
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== id),
                meta: {
                  ...page.meta,
                  totalItems: Math.max(0, page.meta.totalItems - 1)
                }
              }))
            }
          }
        )

        // 2. Thêm vào query mới (thêm vào đầu page đầu tiên)
        queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteUsers') &&
                queryParams &&
                'teachingStatus' in queryParams &&
                queryParams.teachingStatus === newTeachingStatus.toString()
              )
            }
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
      }

      if (academicDegreeChanged) {
        queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteUsers') &&
                queryParams &&
                'academicDegree' in queryParams &&
                queryParams.academicDegree === oldUser?.academicDegree?.toString()
              )
            }
          },
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== id),
                meta: {
                  ...page.meta,
                  totalItems: Math.max(0, page.meta.totalItems - 1)
                }
              }))
            }
          }
        )

        // 2. Thêm vào query mới (thêm vào đầu page đầu tiên)
        queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteUsers') &&
                queryParams &&
                'academicDegree' in queryParams &&
                queryParams.academicDegree === newAcademicDegree?.toString()
              )
            }
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
      }

      // Cập nhật ở danh sách
      queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteUsers')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page.items.find((item) => item.id === id)) {
                return {
                  ...page,
                  items: page.items.map((item) => (item.id === id ? res.data.data : item))
                }
              }
              return page
            })
          }
        }
      )

      toast.success('Cập nhật nhân viên thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật nhân viên thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`${API_ROUTES.USERS}/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueriesData<InfiniteData<PaginatedUser>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteUsers')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== id),
              meta: {
                ...page.meta,
                totalItems: page.meta.totalItems - 1
              }
            }))
          }
        }
      )
      toast.success('Xóa nhân viên thành công')
    },
    onError: (error) => {
      toast.error('Xóa nhân viên thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
