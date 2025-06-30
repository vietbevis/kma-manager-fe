import { create } from 'zustand'
import type { BuildingFilters } from '../types'

interface BuildingStore {
  filters: BuildingFilters
  setFilters: (filters: Partial<BuildingFilters>) => void
  resetFilters: () => void
  initializeFromUrl: () => void
}

const initialFilters: BuildingFilters = {
  searchName: ''
}

const parseFiltersFromUrl = (): BuildingFilters => {
  if (typeof window === 'undefined') return initialFilters
  const searchParams = new URLSearchParams(window.location.search)
  return {
    searchName: searchParams.get('searchName') || ''
  }
}

const updateUrlParams = (filters: BuildingFilters) => {
  if (typeof window === 'undefined') return
  const searchParams = new URLSearchParams(window.location.search)

  if (filters.searchName) {
    searchParams.set('searchName', filters.searchName)
  } else {
    searchParams.delete('searchName')
  }

  const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
  window.history.replaceState({}, '', newUrl)
}

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  filters: initialFilters,
  setFilters: (newFilters) => {
    const updated = { ...get().filters, ...newFilters }
    set({ filters: updated })
    updateUrlParams(updated)
  },
  resetFilters: () => {
    set({ filters: initialFilters })
    updateUrlParams(initialFilters)
  },
  initializeFromUrl: () => {
    const urlFilters = parseFiltersFromUrl()
    set({ filters: urlFilters })
  }
}))
