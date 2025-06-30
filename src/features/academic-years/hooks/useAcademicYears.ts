import type { AcademicYearSchemaType } from '@/shared/validations/AcademicYearSchema'
import { useMemo } from 'react'
import { useGetAcademicYearsQuery } from '../api/AcademicYearService'
import { useAcademicYearStore } from '../stores/academicYearStore'

export const useAcademicYears = () => {
  const { filters } = useAcademicYearStore()
  const { data, isLoading, error } = useGetAcademicYearsQuery()

  const filteredData = useMemo(() => {
    if (!data?.data?.data) return []

    let filtered = data.data.data

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((item: any) => item.yearCode.toLowerCase().includes(searchLower))
    }

    return filtered.map(
      (item: any): AcademicYearSchemaType => ({
        id: item.id,
        yearCode: item.yearCode,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
    )
  }, [data?.data?.data, filters])

  return {
    data: filteredData,
    isLoading,
    error,
    totalItems: filteredData.length
  }
}
