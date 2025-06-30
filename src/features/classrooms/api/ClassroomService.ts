import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  ClassroomQuery,
  ClassroomResponse,
  ClassroomsResponse,
  CreateClassroomSchemaType as CreateClassroom,
  PaginatedClassrooms,
  UpdateClassroomSchemaType as UpdateClassroom
} from '@/shared/validations/ClassroomSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfiniteClassroomQuery = (query: Partial<ClassroomQuery>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteClassrooms', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ClassroomsResponse>(API_ROUTES.CLASSROOMS, {
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

export const useGetClassroomDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['classroom', id],
    queryFn: () => api.get<ClassroomResponse>(`${API_ROUTES.CLASSROOMS}/${id}`)
  })
}

export const useCreateClassroomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateClassroom) => api.post<ClassroomResponse>(API_ROUTES.CLASSROOMS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedClassrooms>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteClassrooms')
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
      toast.success('Tạo phòng học thành công')
    },
    onError: (error) => {
      toast.error('Tạo phòng học thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateClassroomMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateClassroom) => api.put<ClassroomResponse>(`${API_ROUTES.CLASSROOMS}/${id}`, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedClassrooms>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteClassrooms')
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
      toast.success('Cập nhật phòng học thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật phòng học thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeleteClassroomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`${API_ROUTES.CLASSROOMS}/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<InfiniteData<PaginatedClassrooms>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteClassrooms')
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
      toast.success('Xóa phòng học thành công')
    },
    onError: (error) => {
      toast.error('Xóa phòng học thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
