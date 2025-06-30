import { create } from 'zustand'
import type { UserFilters } from '../types'

interface UserStore {
  filters: UserFilters
  setFilters: (filters: Partial<UserFilters>) => void
  resetFilters: () => void
  initializeFromUrl: () => void
}

const initialFilters: UserFilters = {
  fullName: '',
  code: '',
  gender: undefined,
  academicDegree: undefined,
  facultyId: undefined,
  departmentId: undefined,
  positionId: undefined,
  teachingStatus: undefined
}

// Helper function để parse URL params thành filters
const parseFiltersFromUrl = (): UserFilters => {
  if (typeof window === 'undefined') return initialFilters

  const searchParams = new URLSearchParams(window.location.search)
  return {
    fullName: searchParams.get('fullName') || '',
    code: searchParams.get('code') || '',
    gender: (searchParams.get('gender') as any) || undefined,
    academicDegree: (searchParams.get('academicDegree') as any) || undefined,
    facultyId: searchParams.get('facultyId') ? Number(searchParams.get('facultyId')) : undefined,
    departmentId: searchParams.get('departmentId') ? Number(searchParams.get('departmentId')) : undefined,
    positionId: searchParams.get('positionId') ? Number(searchParams.get('positionId')) : undefined,
    teachingStatus:
      searchParams.get('teachingStatus') === 'true'
        ? true
        : searchParams.get('teachingStatus') === 'false'
        ? false
        : undefined
  }
}

// Helper function để update URL params
const updateUrlParams = (filters: UserFilters) => {
  if (typeof window === 'undefined') return

  const searchParams = new URLSearchParams(window.location.search)

  // Update or remove fullName param
  if (filters.fullName) {
    searchParams.set('fullName', filters.fullName)
  } else {
    searchParams.delete('fullName')
  }

  // Update or remove code param
  if (filters.code) {
    searchParams.set('code', filters.code)
  } else {
    searchParams.delete('code')
  }

  // Update or remove gender param
  if (filters.gender !== undefined) {
    searchParams.set('gender', filters.gender.toString())
  } else {
    searchParams.delete('gender')
  }

  // Update or remove academicDegree param
  if (filters.academicDegree !== undefined) {
    searchParams.set('academicDegree', filters.academicDegree.toString())
  } else {
    searchParams.delete('academicDegree')
  }

  // Update or remove facultyId param
  if (filters.facultyId !== undefined) {
    searchParams.set('facultyId', filters.facultyId.toString())
  } else {
    searchParams.delete('facultyId')
  }

  // Update or remove departmentId param
  if (filters.departmentId !== undefined) {
    searchParams.set('departmentId', filters.departmentId.toString())
  } else {
    searchParams.delete('departmentId')
  }

  // Update or remove positionId param
  if (filters.positionId !== undefined) {
    searchParams.set('positionId', filters.positionId.toString())
  } else {
    searchParams.delete('positionId')
  }

  // Update or remove teachingStatus param
  if (filters.teachingStatus !== undefined) {
    searchParams.set('teachingStatus', filters.teachingStatus.toString())
  } else {
    searchParams.delete('teachingStatus')
  }

  // Update URL without triggering page reload
  const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
  window.history.replaceState({}, '', newUrl)
}

export const useUserStore = create<UserStore>((set, get) => ({
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
