import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  BuildingQuery,
  BuildingResponse,
  BuildingsResponse,
  CreateBuildingSchemaType as CreateBuilding,
  PaginatedBuildings,
  UpdateBuildingSchemaType as UpdateBuilding
} from '@/shared/validations/BuildingSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfiniteBuildingQuery = (query: Partial<BuildingQuery>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteBuildings', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<BuildingsResponse>(API_ROUTES.BUILDINGS, {
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

export const useGetBuildingDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['building', id],
    queryFn: () => api.get<BuildingResponse>(`${API_ROUTES.BUILDINGS}/${id}`)
  })
}

export const useCreateBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBuilding) => api.post<BuildingResponse>(API_ROUTES.BUILDINGS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedBuildings>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteBuildings')
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
      toast.success('Tạo tòa nhà thành công')
    },
    onError: (error) => {
      toast.error('Tạo tòa nhà thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateBuildingMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateBuilding) => api.put<BuildingResponse>(`${API_ROUTES.BUILDINGS}/${id}`, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedBuildings>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteBuildings')
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
      toast.success('Cập nhật tòa nhà thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật tòa nhà thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeleteBuildingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`${API_ROUTES.BUILDINGS}/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<InfiniteData<PaginatedBuildings>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteBuildings')
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
      toast.success('Xóa tòa nhà thành công')
    },
    onError: (error) => {
      toast.error('Xóa tòa nhà thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
