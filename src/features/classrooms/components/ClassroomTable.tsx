import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { Classroom } from '@/shared/validations/ClassroomSchema'
import { Edit, Trash2 } from 'lucide-react'

interface ClassroomTableProps {
  data: Classroom[]
  isLoading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const ClassroomTable = ({ data, isLoading, onEdit, onDelete }: ClassroomTableProps) => {
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu phòng học</div>
  }

  return (
    <div className='relative'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên phòng học</TableHead>
              <TableHead>Tòa nhà</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((classroom) => (
              <TableRow key={classroom.id}>
                <TableCell className='font-medium'>{classroom.name}</TableCell>
                <TableCell>
                  {classroom.building ? (
                    <Badge variant='outline'>{classroom.building.name}</Badge>
                  ) : (
                    <Badge variant='secondary'>Không có</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {classroom.description || <span className='text-muted-foreground'>Không có</span>}
                </TableCell>
                <TableCell>
                  {new Date(classroom.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {new Date(classroom.updatedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='icon' onClick={() => onEdit(classroom.id)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(classroom.id)}>
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

export default ClassroomTable
