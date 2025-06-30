import { create } from 'zustand'
import type { AccountFilters } from '../types'

interface AccountStore {
  filters: AccountFilters
  setFilters: (filters: Partial<AccountFilters>) => void
  resetFilters: () => void
  initializeFromUrl: () => void
}

const initialFilters: AccountFilters = {
  searchUsername: '',
  searchFullName: ''
}

const parseFiltersFromUrl = (): AccountFilters => {
  if (typeof window === 'undefined') return initialFilters
  const params = new URLSearchParams(window.location.search)
  return {
    searchUsername: params.get('searchUsername') || '',
    searchFullName: params.get('searchFullName') || ''
  }
}

const updateUrlParams = (filters: AccountFilters) => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (filters.searchUsername) params.set('searchUsername', filters.searchUsername)
  else params.delete('searchUsername')
  if (filters.searchFullName) params.set('searchFullName', filters.searchFullName)
  else params.delete('searchFullName')
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
  window.history.replaceState({}, '', newUrl)
}

export const useAccountStore = create<AccountStore>((set, get) => ({
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
