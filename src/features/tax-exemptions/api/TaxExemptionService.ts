import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { getErrorMessage, normalizeObject } from '@/shared/lib/utils'
import type {
  CreateTaxExemption,
  PaginatedTaxExemption,
  TaxExemptionQuery,
  TaxExemptionResponse,
  TaxExemptionsResponse,
  UpdateTaxExemption
} from '@/shared/validations/TaxExemptionSchema'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useInfiniteTaxExemptionQuery = (query: Partial<TaxExemptionQuery>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteTaxExemptions', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<TaxExemptionsResponse>(API_ROUTES.TAX_EXEMPTIONS, {
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

export const useGetTaxExemptionDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['taxExemption', id],
    queryFn: () => api.get<TaxExemptionResponse>(`${API_ROUTES.TAX_EXEMPTIONS}/${id}`)
  })
}

export const useCreateTaxExemptionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaxExemption) => api.post<TaxExemptionResponse>(API_ROUTES.TAX_EXEMPTIONS, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedTaxExemption>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteTaxExemptions')
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
      toast.success('Tạo miễn giảm thành công')
    },
    onError: (error) => {
      toast.error('Tạo miễn giảm thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useUpdateTaxExemptionMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTaxExemption) => api.put<TaxExemptionResponse>(`${API_ROUTES.TAX_EXEMPTIONS}/${id}`, data),
    onSuccess: (res) => {
      queryClient.setQueriesData<InfiniteData<PaginatedTaxExemption>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteTaxExemptions')
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
      toast.success('Cập nhật miễn giảm thành công')
    },
    onError: (error) => {
      toast.error('Cập nhật miễn giảm thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}

export const useDeleteTaxExemptionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`${API_ROUTES.TAX_EXEMPTIONS}/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<InfiniteData<PaginatedTaxExemption>>(
        {
          predicate: (query) => query.queryKey.includes('infiniteTaxExemptions')
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
      toast.success('Xóa miễn giảm thành công')
    },
    onError: (error) => {
      toast.error('Xóa miễn giảm thất bại', {
        description: getErrorMessage(error)
      })
    }
  })
}
