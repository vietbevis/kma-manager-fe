import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import type {
  GetAttachmentsType,
  PaginateAttachmentResponse,
  UploadAttachmentResponseType
} from '@/shared/validations/AttachmentSchema'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useUploadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      return api.post<UploadAttachmentResponseType>(`${API_ROUTES.ATTACHMENTS}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    onError: (error) => {
      console.log('🚀 ~ useUploadImageMutation ~ error:', error)
      toast.dismiss()
      toast.error('Tải lên thất bại. Vui lòng thử lại.')
    },
    onMutate: () => {
      toast.loading('Đang tải file lên...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Tải file lên thành công.')
      queryClient.invalidateQueries({ queryKey: ['infiniteAttachments'] })
      queryClient.invalidateQueries({ queryKey: ['infiniteAttachmentsForMe'] })
    }
  })
}

export const useGetAttachments = (query: Partial<GetAttachmentsType>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteAttachments', query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PaginateAttachmentResponse>(API_ROUTES.ATTACHMENTS, {
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

export const useGetAttachmentsForMe = (query: Partial<GetAttachmentsType>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteAttachmentsForMe', query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PaginateAttachmentResponse>(`${API_ROUTES.ATTACHMENTS}/me`, {
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

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (filenames: string[]) => api.delete(API_ROUTES.ATTACHMENTS, { data: { filenames } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infiniteAttachments'] })
      toast.success('Xóa tệp thành công')
    },
    onError: () => {
      toast.error('Xóa tệp thất bại')
    }
  })
}
