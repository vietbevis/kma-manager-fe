import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  CreatePosition,
  PaginatedPosition,
  PositionQuery,
  PositionResponse,
  PositionsResponse,
  UpdatePosition
} from '@/shared/validations/PositionSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfinitePositionQuery = (query: Partial<PositionQuery>) => {
  return useInfiniteQuery({
    queryKey: ['infinitePositions', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PositionsResponse>(API_ROUTES.POSITIONS, {
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

export const useGetPositionDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['position', id],
    queryFn: () => api.get<PositionResponse>(`${API_ROUTES.POSITIONS}/${id}`)
  })
}

export const useCreatePositionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePosition) => api.post<PositionResponse>(API_ROUTES.POSITIONS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedPosition>>(
        {
          predicate: (query) => query.queryKey.includes('infinitePositions')
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
      toast.success('Tạo chức vụ thành công')
    },
    onError: (error) => {
      toast.error('Tạo chức vụ thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdatePositionMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePosition) => api.put<PositionResponse>(`${API_ROUTES.POSITIONS}/${id}`, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedPosition>>(
        {
          predicate: (query) => query.queryKey.includes('infinitePositions')
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
      toast.success('Cập nhật chức vụ thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật chức vụ thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeletePositionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`${API_ROUTES.POSITIONS}/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<InfiniteData<PaginatedPosition>>(
        {
          predicate: (query) => query.queryKey.includes('infinitePositions')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== deletedId),
              meta: {
                ...page.meta,
                totalItems: page.meta.totalItems - 1
              }
            }))
          }
        }
      )
      toast.success('Xóa chức vụ thành công')
    },
    onError: (error) => {
      toast.error('Xóa chức vụ thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
