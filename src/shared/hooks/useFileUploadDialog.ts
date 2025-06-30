import { FileType, FileTypeGroups } from '@/shared/lib/enum'
import { useDialogStore } from '../stores/dialogStore'

interface UseFileUploadDialogParams {
  acceptedFileTypes?: FileType[]
  maxFiles?: number
  title?: string
  description?: string
}

export const useFileUploadDialog = (params?: UseFileUploadDialogParams) => {
  const { openFileUploadDialog } = useDialogStore()
  const openUploadDialog = (onUploadSuccess: (fileName: string) => void, currentFileName?: string) => {
    openFileUploadDialog?.({
      acceptedFileTypes: params?.acceptedFileTypes || FileTypeGroups.PROFILE_FILES,
      maxFiles: params?.maxFiles || 1,
      title: params?.title || 'Tải lên file',
      description: params?.description || 'Chọn file để tải lên',
      onUploadSuccess,
      currentFileName
    })
  }

  return {
    openUploadDialog
  }
}
