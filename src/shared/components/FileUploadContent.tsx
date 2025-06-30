import { useUploadMutation } from '@/features/attachments/api/AttachmentService'
import { File, FileText, Image, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDialogStore } from '../stores/dialogStore'
import { Button } from './ui/button'
import { Progress } from './ui/progress'

export const FileUploadContent = () => {
  const { fileUploadParams, closeDialog } = useDialogStore()
  const [uploadProgress, setUploadProgress] = useState(0)
  const uploadMutation = useUploadMutation()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!fileUploadParams) return

      const file = acceptedFiles[0]
      if (!file) return

      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      uploadMutation.mutate([file], {
        onSuccess: (response) => {
          clearInterval(progressInterval)
          setUploadProgress(100)

          const uploadedFileName = response.data.data[0]?.url || file.name

          setTimeout(() => {
            fileUploadParams.onUploadSuccess(uploadedFileName)
            closeDialog()
            setUploadProgress(0)
          }, 500)
        },
        onError: () => {
          clearInterval(progressInterval)
          setUploadProgress(0)
        }
      })
    },
    [fileUploadParams, uploadMutation, closeDialog]
  )

  const getDropzoneAccept = () => {
    if (!fileUploadParams?.acceptedFileTypes) {
      return {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      }
    }

    return fileUploadParams.acceptedFileTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>)
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    maxFiles: fileUploadParams?.maxFiles || 1,
    accept: getDropzoneAccept()
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className='w-8 h-8 text-blue-500' />
    if (fileType === 'application/pdf') return <FileText className='w-8 h-8 text-red-500' />
    return <File className='w-8 h-8 text-gray-500' />
  }

  const handleRemoveCurrentFile = () => {
    if (fileUploadParams?.onUploadSuccess) {
      fileUploadParams.onUploadSuccess('')
    }
  }

  if (!fileUploadParams) return null

  return (
    <div className='space-y-4'>
      {fileUploadParams.currentFileName && (
        <div className='p-3 bg-gray-50 rounded-lg border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FileText className='w-4 h-4 text-gray-500' />
              <span className='text-sm font-medium'>File hiện tại:</span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemoveCurrentFile}
              className='h-6 w-6 p-0 text-red-500 hover:text-red-700'
            >
              <X className='w-3 h-3' />
            </Button>
          </div>
          <p className='text-sm text-gray-600 mt-1 truncate'>{fileUploadParams.currentFileName}</p>
        </div>
      )}

      {uploadProgress > 0 && (
        <div>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium'>Đang tải lên...</span>
            <span className='text-sm text-gray-600'>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className='h-2' />
        </div>
      )}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${!isDragActive ? 'border-gray-300 hover:border-gray-400' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className='flex flex-col items-center gap-3'>
          <Upload className={`w-12 h-12 ${isDragReject ? 'text-red-400' : 'text-gray-400'}`} />

          {isDragActive ? (
            <div>
              {isDragReject ? (
                <p className='text-red-600 font-medium'>File không được hỗ trợ</p>
              ) : (
                <p className='text-blue-600 font-medium'>Thả file vào đây...</p>
              )}
            </div>
          ) : (
            <div>
              <p className='text-gray-700 font-medium mb-1'>Kéo thả file vào đây hoặc click để chọn</p>
              <p className='text-sm text-gray-500'>Hỗ trợ: Images, PDF, DOC, DOCX</p>
            </div>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div>
          <h4 className='text-sm font-medium mb-2'>Files đã chọn:</h4>
          <div className='space-y-2'>
            {acceptedFiles.map((file) => (
              <div key={file.name} className='flex items-center gap-3 p-2 bg-gray-50 rounded'>
                {getFileIcon(file.type)}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{file.name}</p>
                  <p className='text-xs text-gray-500'>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
          <h4 className='text-sm font-medium text-red-800 mb-1'>Lỗi file:</h4>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className='text-sm text-red-600'>
              <span className='font-medium'>{file.name}:</span>
              <ul className='ml-4'>
                {errors.map((error) => (
                  <li key={error.code}>• {error.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
