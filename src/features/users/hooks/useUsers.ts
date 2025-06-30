import { useDebounce } from '@/shared/hooks/useDebounce'
import type { User } from '@/shared/validations/UserSchema'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfiniteUserQuery } from '../api/UserService'
import { useUserStore } from '../stores/userStore'

export const useUsers = () => {
  const { filters, initializeFromUrl } = useUserStore()
  const isInitialMount = useRef(true)
  const previousQueryParams = useRef<any>(null)

  // Debounce search fields to avoid too many API calls
  const debouncedFullName = useDebounce(filters.fullName, 300)
  const debouncedCode = useDebounce(filters.code, 300)

  // Initialize filters from URL on first mount
  useEffect(() => {
    if (isInitialMount.current) {
      initializeFromUrl()
      isInitialMount.current = false
    }
  }, [initializeFromUrl])

  const queryParams = useMemo(() => {
    return {
      fullName: debouncedFullName,
      code: debouncedCode,
      gender: filters.gender,
      academicDegree: filters.academicDegree,
      facultyId: filters.facultyId,
      departmentId: filters.departmentId,
      positionId: filters.positionId,
      teachingStatus: filters.teachingStatus?.toString() as 'true' | 'false' | undefined
    }
  }, [
    debouncedFullName,
    debouncedCode,
    filters.gender,
    filters.academicDegree,
    filters.facultyId,
    filters.departmentId,
    filters.positionId,
    filters.teachingStatus
  ])

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteUserQuery(queryParams)

  // Detect if this is a filter loading (not initial loading)
  const isFilterLoading = useMemo(() => {
    // If it's initial loading or no data yet, return false
    if (isInitialMount.current || !data?.pages?.length) {
      return false
    }

    // Check if query params changed
    const currentParams = JSON.stringify(queryParams)
    const previousParams = JSON.stringify(previousQueryParams.current)

    if (currentParams !== previousParams) {
      previousQueryParams.current = queryParams
      return isFetching
    }

    return false
  }, [queryParams, isFetching, data?.pages?.length])

  const allData = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) =>
      page.items.map(
        (item): User => ({
          id: item.id,
          code: item.code,
          fullName: item.fullName,
          gender: item.gender,
          dateOfBirth: item.dateOfBirth,
          phone: item.phone,
          email: item.email,
          address: item.address,
          citizenId: item.citizenId,
          citizenIdIssueDate: item.citizenIdIssueDate,
          citizenIdIssuePlace: item.citizenIdIssuePlace,
          citizenIdAddress: item.citizenIdAddress,
          currentAddress: item.currentAddress,
          academicDegree: item.academicDegree,
          workplace: item.workplace,
          taxCode: item.taxCode,
          bankAccount: item.bankAccount,
          bankName: item.bankName,
          bankBranch: item.bankBranch,
          salaryCoefficient: item.salaryCoefficient,
          salary: item.salary,
          profileFile: item.profileFile,
          teachingStatus: item.teachingStatus,
          username: item.username,
          faculty: item.faculty,
          department: item.department,
          position: item.position,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })
      )
    )
  }, [data?.pages])

  const totalItems = useMemo(() => {
    return data?.pages?.[0]?.meta?.totalItems || 0
  }, [data?.pages])

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    data: allData,
    isLoading, // Initial loading
    isFilterLoading, // Loading when filters change
    error,
    fetchNextPage: handleFetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalItems
  }
}
