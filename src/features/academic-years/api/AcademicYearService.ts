import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import type {
  AcademicYearResponseSchemaType,
  AcademicYearsResponseSchemaType,
  CreateAcademicYearSchemaType,
  DeleteAcademicYearSchemaType,
  UpdateAcademicYearSchemaType
} from '@/shared/validations/AcademicYearSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { toast } from 'sonner'

export const useGetAcademicYearsQuery = () => {
  return useQuery({
    queryKey: ['academic-years'],
    queryFn: () => api.get<AcademicYearsResponseSchemaType>(API_ROUTES.ACADEMIC_YEARS)
  })
}

export const useCreateAcademicYearMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAcademicYearSchemaType) =>
      api.post<AcademicYearResponseSchemaType>(API_ROUTES.ACADEMIC_YEARS, data),
    onSuccess: (data) => {
      queryClient.setQueryData<AxiosResponse<AcademicYearsResponseSchemaType>>(['academic-years'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: [data.data.data, ...old.data.data]
          }
        }
      })
      toast.success('Thêm năm học thành công')
    },
    onError: () => {
      toast.error('Thêm năm học thất bại')
    }
  })
}

export const useUpdateAcademicYearMutation = (yearCode: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAcademicYearSchemaType) =>
      api.put<AcademicYearResponseSchemaType>(`${API_ROUTES.ACADEMIC_YEARS}/${yearCode}`, data),
    onSuccess: (data) => {
      queryClient.setQueryData<AxiosResponse<AcademicYearsResponseSchemaType>>(['academic-years'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item) => (item.yearCode === yearCode ? data.data.data : item))
          }
        }
      })
      toast.success('Cập nhật năm học thành công')
    },
    onError: () => {
      toast.error('Cập nhật năm học thất bại')
    }
  })
}

export const useDeleteAcademicYearMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (yearCode: string) =>
      api.delete<DeleteAcademicYearSchemaType>(`${API_ROUTES.ACADEMIC_YEARS}/${yearCode}`),
    onSuccess: (data) => {
      queryClient.setQueryData<AxiosResponse<AcademicYearsResponseSchemaType>>(['academic-years'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((item) => item.yearCode !== data.data.data.yearCode)
          }
        }
      })
      toast.success('Xóa năm học thành công')
    },
    onError: () => {
      toast.error('Xóa năm học thất bại')
    }
  })
}
