import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  CreateDepartmentSchemaType,
  DepartmentResponseSchemaType,
  DepartmentSchemaType,
  DepartmentsResponseSchemaType,
  GetDepartmentsSchemaType,
  PaginatedDepartmentsSchemaType,
  UpdateDepartmentSchemaType
} from '@/shared/validations/DepartmentSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfiniteDepartmentQuery = (query: Partial<GetDepartmentsSchemaType>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteDepartments', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<DepartmentsResponseSchemaType>(API_ROUTES.DEPARTMENTS, {
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

export const useGetDepartmentDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => api.get<DepartmentResponseSchemaType>(`${API_ROUTES.DEPARTMENTS}/${id}`)
  })
}

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDepartmentSchemaType) =>
      api.post<DepartmentResponseSchemaType>(API_ROUTES.DEPARTMENTS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedDepartmentsSchemaType>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteDepartments')
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
      toast.success('Tạo bộ môn thành công')
    },
    onError: (error) => {
      toast.error('Tạo bộ môn thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateDepartmentMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateDepartmentSchemaType) =>
      api.put<DepartmentResponseSchemaType>(`${API_ROUTES.DEPARTMENTS}/${id}`, data),
    onSuccess: (res) => {
      // Lấy dữ liệu cũ để so sánh facultyId
      const oldQueries = queryClient.getQueriesData<InfiniteData<PaginatedDepartmentsSchemaType>>({
        predicate(query) {
          return query.queryKey.includes('infiniteDepartments')
        }
      })

      // Tìm department cũ để kiểm tra xem facultyId có thay đổi không
      let oldDepartment: DepartmentSchemaType | null = null

      for (const [, queryData] of oldQueries) {
        if (queryData) {
          for (const page of queryData.pages) {
            const foundItem = page.items.find((item) => item.id === id)
            if (foundItem) {
              oldDepartment = foundItem
              break
            }
          }
          if (oldDepartment) break
        }
      }

      const newFacultyId = res.data.data.faculty.id
      const facultyIdChanged = oldDepartment !== null && oldDepartment.faculty.id !== newFacultyId

      if (facultyIdChanged) {
        // Nếu facultyId thay đổi, cần xử lý cả 2 query

        // 1. Xóa khỏi query cũ
        queryClient.setQueriesData<InfiniteData<PaginatedDepartmentsSchemaType>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteDepartments') &&
                queryParams &&
                'facultyId' in queryParams &&
                (queryParams.facultyId === oldDepartment?.faculty.id?.toString() ||
                  queryParams.facultyId === oldDepartment?.faculty.id)
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
        queryClient.setQueriesData<InfiniteData<PaginatedDepartmentsSchemaType>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteDepartments') &&
                queryParams &&
                'facultyId' in queryParams &&
                (queryParams.facultyId === newFacultyId || queryParams.facultyId === newFacultyId.toString())
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

      // Cập nhật ở query không có facultyId
      queryClient.setQueriesData<InfiniteData<PaginatedDepartmentsSchemaType>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteDepartments')
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

      toast.success('Cập nhật bộ môn thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật bộ môn thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`${API_ROUTES.DEPARTMENTS}/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<InfiniteData<PaginatedDepartmentsSchemaType>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteDepartments')
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
      toast.success('Xóa bộ môn thành công')
    },
    onError: (error) => {
      toast.error('Xóa bộ môn thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
