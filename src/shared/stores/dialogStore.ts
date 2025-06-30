import type { FileType } from '@/shared/lib/enum'
import { create } from 'zustand'

interface FileUploadDialogParams {
  acceptedFileTypes?: FileType[]
  maxFiles?: number
  onUploadSuccess: (fileName: string) => void
  currentFileName?: string
}

interface DialogState {
  open: boolean
  type: 'confirm' | 'custom' | 'file-upload' | null
  title?: string
  description?: string
  loading?: boolean
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  content?: React.ReactNode
  data?: any
  fileUploadParams?: FileUploadDialogParams
  openDialog: (
    params: Omit<DialogState, 'open' | 'openDialog' | 'closeDialog'> & { type: 'confirm' | 'custom' }
  ) => void
  openFileUploadDialog?: (params: FileUploadDialogParams & { title?: string; description?: string }) => void
  closeDialog: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  open: false,
  type: null,
  title: '',
  description: '',
  loading: false,
  onConfirm: undefined,
  onCancel: undefined,
  content: undefined,
  data: undefined,
  fileUploadParams: undefined,
  openDialog: (params) => set({ ...params, open: true }),
  openFileUploadDialog: (params) =>
    set({
      type: 'file-upload',
      open: true,
      title: params.title || 'Tải lên file',
      description: params.description || 'Chọn file để tải lên',
      fileUploadParams: params
    }),
  closeDialog: () => set({ open: false, loading: false, fileUploadParams: undefined })
}))
