import { create } from 'zustand'
import type { DepartmentFilters } from '../types'

interface DepartmentStore {
  filters: DepartmentFilters
  setFilters: (filters: Partial<DepartmentFilters>) => void
  resetFilters: () => void
  initializeFromUrl: () => void
}

const initialFilters: DepartmentFilters = {
  searchName: '',
  searchCode: '',
  facultyId: undefined
}

// Helper function để parse URL params thành filters
const parseFiltersFromUrl = (): DepartmentFilters => {
  if (typeof window === 'undefined') return initialFilters

  const searchParams = new URLSearchParams(window.location.search)
  return {
    searchName: searchParams.get('searchName') || '',
    searchCode: searchParams.get('searchCode') || '',
    facultyId: searchParams.get('facultyId') ? Number(searchParams.get('facultyId')) : undefined
  }
}

// Helper function để update URL params
const updateUrlParams = (filters: DepartmentFilters) => {
  if (typeof window === 'undefined') return

  const searchParams = new URLSearchParams(window.location.search)

  // Update or remove searchName param
  if (filters.searchName) {
    searchParams.set('searchName', filters.searchName)
  } else {
    searchParams.delete('searchName')
  }

  // Update or remove searchCode param
  if (filters.searchCode) {
    searchParams.set('searchCode', filters.searchCode)
  } else {
    searchParams.delete('searchCode')
  }

  // Update or remove facultyId param
  if (filters.facultyId) {
    searchParams.set('facultyId', filters.facultyId.toString())
  } else {
    searchParams.delete('facultyId')
  }

  // Update URL without triggering page reload
  const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
  window.history.replaceState({}, '', newUrl)
}

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
  filters: initialFilters,
  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters }
    set({ filters: updatedFilters })
    updateUrlParams(updatedFilters)
  },
  resetFilters: () => {
    set({ filters: initialFilters })
    updateUrlParams(initialFilters)
  },
  initializeFromUrl: () => {
    const filtersFromUrl = parseFiltersFromUrl()
    set({ filters: filtersFromUrl })
  }
}))
