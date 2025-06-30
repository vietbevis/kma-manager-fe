import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { AcademicYearSchemaType } from '@/shared/validations/AcademicYearSchema'
import { Edit, Trash2 } from 'lucide-react'

interface AcademicYearTableProps {
  data: AcademicYearSchemaType[]
  isLoading: boolean
  onEdit: (yearCode: string) => void
  onDelete: (yearCode: string) => void
}

export const AcademicYearTable = ({ data, isLoading, onEdit, onDelete }: AcademicYearTableProps) => {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu năm học</div>
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã năm học</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày cập nhật</TableHead>
            <TableHead className='text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((academicYear) => (
            <TableRow key={academicYear.id}>
              <TableCell>
                <Badge variant='outline'>{academicYear.yearCode}</Badge>
              </TableCell>
              <TableCell>
                {new Date(academicYear.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>
                {new Date(academicYear.updatedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex justify-end gap-2'>
                  <Button variant='outline' size='icon' onClick={() => onEdit(academicYear.yearCode)}>
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='icon' onClick={() => onDelete(academicYear.yearCode)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
