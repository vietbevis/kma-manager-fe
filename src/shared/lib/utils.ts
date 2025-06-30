import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: any, defaultMessage = 'Lỗi không xác định.') {
  return (error as any).response?.data.message || defaultMessage
}

export function normalizeObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '' && value !== 'null'
    )
  )
}
