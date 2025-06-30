import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  CreateFacultySchemaType,
  FacultiesResponseSchemaType,
  FacultyResponseSchemaType,
  FacultySchemaType,
  GetFacultiesSchemaType,
  MergeFacultySchemaType,
  PaginatedFacultiesSchemaType,
  UpdateFacultySchemaType
} from '@/shared/validations/FacultySchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfiniteFacultyQuery = (query: Partial<GetFacultiesSchemaType>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteFaculties', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<FacultiesResponseSchemaType>(API_ROUTES.FACULTIES.ROOT, {
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

export const useGetFacultyDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: () => api.get<FacultyResponseSchemaType>(`${API_ROUTES.FACULTIES.ROOT}/${id}`)
  })
}

export const useGetFacultyDetailQueryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['faculty', slug],
    queryFn: () => api.get<FacultyResponseSchemaType>(`${API_ROUTES.FACULTIES.ROOT}/slug/${slug}`)
  })
}

export const useCreateFacultyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFacultySchemaType) => api.post<FacultyResponseSchemaType>(API_ROUTES.FACULTIES.ROOT, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedFacultiesSchemaType>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteFaculties')
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
      toast.success('Tạo khoa thành công')
    },
    onError: (error) => {
      toast.error('Tạo khoa thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateFacultyMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateFacultySchemaType) =>
      api.put<FacultyResponseSchemaType>(`${API_ROUTES.FACULTIES.ROOT}/${id}`, data),
    onSuccess: async (res) => {
      const updatedFaculty = res.data.data

      // Lấy dữ liệu cũ để so sánh isFaculty
      const oldQueries = queryClient.getQueriesData<InfiniteData<PaginatedFacultiesSchemaType>>({
        predicate(query) {
          return query.queryKey.includes('infiniteFaculties')
        }
      })

      // Tìm faculty cũ để kiểm tra xem isFaculty có thay đổi không
      let oldFaculty: FacultySchemaType | null = null

      for (const [, queryData] of oldQueries) {
        if (queryData) {
          for (const page of queryData.pages) {
            const foundItem = page.items.find((item) => item.id === id)
            if (foundItem) {
              oldFaculty = foundItem
              break
            }
          }
          if (oldFaculty) break
        }
      }

      const newIsFaculty = updatedFaculty.isFaculty
      const isFacultyChanged = oldFaculty !== null && oldFaculty.isFaculty !== newIsFaculty

      if (isFacultyChanged) {
        // Nếu isFaculty thay đổi, cần xử lý cả 2 query

        // 1. Xóa khỏi query cũ
        queryClient.setQueriesData<InfiniteData<PaginatedFacultiesSchemaType>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteFaculties') &&
                queryParams &&
                'isFaculty' in queryParams &&
                queryParams.isFaculty === oldFaculty?.isFaculty?.toString()
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
        queryClient.setQueriesData<InfiniteData<PaginatedFacultiesSchemaType>>(
          {
            predicate: (query) => {
              const queryParams = query.queryKey.find((key) => typeof key === 'object' && key !== null) || {}
              return (
                query.queryKey.includes('infiniteFaculties') &&
                queryParams &&
                'isFaculty' in queryParams &&
                queryParams.isFaculty === newIsFaculty.toString()
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
                  items: [updatedFaculty, ...oldData.pages[0].items]
                },
                ...oldData.pages.slice(1)
              ]
            }
          }
        )
      }

      // Cập nhật ở query không có isFaculty
      queryClient.setQueriesData<InfiniteData<PaginatedFacultiesSchemaType>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteFaculties')
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page.items.find((item) => item.id === id)) {
                return {
                  ...page,
                  items: page.items.map((item) => (item.id === id ? updatedFaculty : item))
                }
              }
              return page
            })
          }
        }
      )

      toast.success('Cập nhật khoa thành công')

      const invalidateQueryKeys = ['infiniteAccounts', 'infiniteUsers', 'infiniteDepartments']
      queryClient.cancelQueries({
        predicate: (query) => query.queryKey.some((key) => invalidateQueryKeys.includes(key as string))
      })
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.some((key) => invalidateQueryKeys.includes(key as string))
      })
    },
    onError: (error) => {
      toast.error('Cập nhật khoa thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

const facultiesMergeSet = new Set<number>()
export const useMergeFacultyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MergeFacultySchemaType) => {
      data.mergeFacultyIds.forEach((id) => facultiesMergeSet.add(id))
      return api.post<FacultyResponseSchemaType>(API_ROUTES.FACULTIES.MERGE, data)
    },
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedFacultiesSchemaType>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteFaculties')
        },
        (oldData) => {
          if (!oldData) return oldData

          let newData: InfiniteData<PaginatedFacultiesSchemaType> = oldData

          // Xóa các khoa đã merge
          newData = {
            ...newData,
            pages: newData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => !facultiesMergeSet.has(item.id))
            }))
          }

          // Thêm khoa mới
          return {
            ...newData,
            pages: [
              {
                meta: {
                  ...newData.pages[0].meta,
                  totalItems: newData.pages[0].meta.totalItems + 1
                },
                items: [res.data.data, ...newData.pages[0].items]
              },
              ...newData.pages.slice(1)
            ]
          }
        }
      )
      toast.success('Merge khoa thành công')
    },
    onError: (error) => {
      toast.error('Merge khoa thất bại', {
        description: getErrorMessage(error)
      })
    },
    onSettled() {
      facultiesMergeSet.clear()
    }
  })
}
