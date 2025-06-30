import { create } from 'zustand'
import type { ClassroomFilters } from '../types'

interface ClassroomStore {
  filters: ClassroomFilters
  setFilters: (filters: Partial<ClassroomFilters>) => void
  resetFilters: () => void
  initializeFromUrl: () => void
}

const initialFilters: ClassroomFilters = {
  searchName: '',
  buildingId: undefined
}

const parseFiltersFromUrl = (): ClassroomFilters => {
  if (typeof window === 'undefined') return initialFilters
  const params = new URLSearchParams(window.location.search)
  return {
    searchName: params.get('searchName') || '',
    buildingId: params.get('buildingId') ? Number(params.get('buildingId')) : undefined
  }
}

const updateUrlParams = (filters: ClassroomFilters) => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (filters.searchName) params.set('searchName', filters.searchName)
  else params.delete('searchName')
  if (filters.buildingId) params.set('buildingId', filters.buildingId.toString())
  else params.delete('buildingId')
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
  window.history.replaceState({}, '', newUrl)
}

export const useClassroomStore = create<ClassroomStore>((set, get) => ({
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
    set({ filters: parseFiltersFromUrl() })
  }
}))
