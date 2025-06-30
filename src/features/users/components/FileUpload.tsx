import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { useFileUploadDialog } from '@/shared/hooks/useFileUploadDialog'
import type { FileType } from '@/shared/lib/enum'
import { FileText, Upload, X } from 'lucide-react'

interface FileUploadProps {
  value?: string
  onChange: (fileName: string) => void
  label?: string
  description?: string
  acceptedFileTypes?: FileType[]
  maxFiles?: number
}

export const FileUpload = ({
  value,
  onChange,
  label = 'Tải lên file',
  description = 'Chọn file để tải lên',
  acceptedFileTypes,
  maxFiles = 1
}: FileUploadProps) => {
  const { openUploadDialog } = useFileUploadDialog({
    acceptedFileTypes,
    maxFiles,
    title: label,
    description
  })

  const handleUploadClick = () => {
    openUploadDialog(onChange, value)
  }

  const handleRemoveFile = () => {
    onChange('')
  }

  return (
    <Card className='border-dashed border-2 hover:border-gray-400 transition-colors'>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center gap-4'>
          {/* Upload Icon */}
          <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center'>
            <Upload className='w-6 h-6 text-accent-foreground' />
          </div>

          {/* Label and Description */}
          <div className='text-center'>
            <h3 className='font-medium'>{label}</h3>
            <p className='text-sm text-accent-foreground mt-1'>{description}</p>
          </div>

          {/* Current File Display */}
          {value && (
            <div className='w-full p-3 bg-gray-50 rounded-lg border flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FileText className='w-4 h-4 text-accent-foreground' />
                <span className='text-sm font-medium text-accent-foreground truncate max-w-[200px]'>{value}</span>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleRemoveFile}
                className='h-6 w-6 p-0 text-red-500 hover:text-red-700'
              >
                <X className='w-3 h-3' />
              </Button>
            </div>
          )}

          {/* Upload Button */}
          <Button type='button' variant={value ? 'outline' : 'default'} onClick={handleUploadClick} className='w-full'>
            {value ? 'Thay đổi file' : 'Chọn file'}
          </Button>

          {/* File Type Info */}
          <div className='text-xs text-gray-400 text-center'>
            <p>Hỗ trợ: Images, PDF, DOC, DOCX</p>
            <p>Tối đa: {maxFiles} file</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
