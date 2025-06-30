import { create } from 'zustand'
import type { FacultyFilters } from '../types'

interface FacultyStore {
  filters: FacultyFilters
  setFilters: (filters: Partial<FacultyFilters>) => void
  resetFilters: () => void
  initializeFromUrl: () => void
}

const initialFilters: FacultyFilters = {
  searchName: '',
  searchCode: '',
  isFaculty: undefined
}

// Helper function để parse URL params thành filters
const parseFiltersFromUrl = (): FacultyFilters => {
  if (typeof window === 'undefined') return initialFilters

  const searchParams = new URLSearchParams(window.location.search)
  return {
    searchName: searchParams.get('searchName') || '',
    searchCode: searchParams.get('searchCode') || '',
    isFaculty:
      searchParams.get('isFaculty') === 'true' ? true : searchParams.get('isFaculty') === 'false' ? false : undefined
  }
}

// Helper function để update URL params
const updateUrlParams = (filters: FacultyFilters) => {
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

  // Update or remove isFaculty param
  if (filters.isFaculty !== undefined) {
    searchParams.set('isFaculty', filters.isFaculty.toString())
  } else {
    searchParams.delete('isFaculty')
  }

  // Update URL without triggering page reload
  const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
  window.history.replaceState({}, '', newUrl)
}

export const useFacultyStore = create<FacultyStore>((set, get) => ({
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
