import { useDebounce } from '@/shared/hooks/useDebounce'
import type { FacultySchemaType } from '@/shared/validations/FacultySchema'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfiniteFacultyQuery } from '../api/FacultyService'
import { useFacultyStore } from '../stores/facultyStore'

export const useFaculties = () => {
  const { filters, initializeFromUrl } = useFacultyStore()
  const isInitialMount = useRef(true)
  const previousQueryParams = useRef<any>(null)

  // Debounce both search fields to avoid too many API calls
  const debouncedSearchName = useDebounce(filters.searchName, 300)
  const debouncedSearchCode = useDebounce(filters.searchCode, 300)

  // Initialize filters from URL on first mount
  useEffect(() => {
    if (isInitialMount.current) {
      initializeFromUrl()
      isInitialMount.current = false
    }
  }, [initializeFromUrl])

  const queryParams = useMemo(() => {
    return {
      name: debouncedSearchName,
      facultyCode: debouncedSearchCode,
      isFaculty: filters.isFaculty?.toString() as 'true' | 'false' | undefined
    }
  }, [debouncedSearchName, debouncedSearchCode, filters.isFaculty])

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteFacultyQuery(queryParams)

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
        (item): FacultySchemaType => ({
          id: item.id,
          name: item.name,
          facultyCode: item.facultyCode,
          isFaculty: item.isFaculty,
          description: item.description,
          headOfFaculty: item.headOfFaculty,
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
