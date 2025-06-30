import { create } from 'zustand'
import type { AcademicYearFilters } from '../types'

interface AcademicYearStore {
  filters: AcademicYearFilters
  setFilters: (filters: Partial<AcademicYearFilters>) => void
  resetFilters: () => void
}

const initialFilters: AcademicYearFilters = {
  search: ''
}

export const useAcademicYearStore = create<AcademicYearStore>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),
  resetFilters: () => set({ filters: initialFilters })
}))
