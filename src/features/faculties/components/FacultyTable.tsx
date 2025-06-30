import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { FacultySchemaType } from '@/shared/validations/FacultySchema'
import { Edit, Trash2 } from 'lucide-react'

interface FacultyTableProps {
  data: FacultySchemaType[]
  isLoading: boolean
  isFilterLoading?: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const FacultyTable = ({ data, isLoading, isFilterLoading, onEdit, onDelete }: FacultyTableProps) => {
  // Show initial loading spinner when no data yet
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu khoa/phòng ban</div>
  }

  return (
    <div className='relative'>
      {/* Filter loading overlay */}
      {isFilterLoading && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex justify-center items-center'>
          <LoadingSpinner isLoading={true} className='relative py-20' />
        </div>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã khoa/phòng ban</TableHead>
              <TableHead>Tên khoa/phòng ban</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trưởng khoa/phòng ban</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((faculty) => (
              <TableRow key={faculty.id}>
                <TableCell>
                  <Badge variant='outline'>{faculty.facultyCode}</Badge>
                </TableCell>
                <TableCell className='font-medium'>{faculty.name}</TableCell>
                <TableCell>
                  <Badge variant={faculty.isFaculty ? 'default' : 'secondary'}>
                    {faculty.isFaculty ? 'Khoa' : 'Phòng ban'}
                  </Badge>
                </TableCell>
                <TableCell>{faculty.headOfFaculty ? faculty.headOfFaculty.fullName : 'Chưa có'}</TableCell>
                <TableCell className='max-w-[200px] truncate'>{faculty.description || 'Không có ghi chú'}</TableCell>
                <TableCell>
                  {new Date(faculty.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='icon' onClick={() => onEdit(faculty.id)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(faculty.id)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
