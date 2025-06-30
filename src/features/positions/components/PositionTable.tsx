import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { Position } from '@/shared/validations/PositionSchema'
import { Edit, Trash2 } from 'lucide-react'

interface PositionTableProps {
  data: Position[]
  isLoading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const PositionTable = ({ data, isLoading, onEdit, onDelete }: PositionTableProps) => {
  // Show initial loading spinner when no data yet
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu chức vụ</div>
  }

  return (
    <div className='relative'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên chức vụ</TableHead>
              <TableHead>Miễn giảm</TableHead>
              <TableHead>Lý do miễn giảm</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((position) => (
              <TableRow key={position.id}>
                <TableCell className='font-medium'>{position.name}</TableCell>
                <TableCell>
                  {position.taxExemption ? (
                    <Badge variant='outline'>{position.taxExemption.percentage}%</Badge>
                  ) : (
                    <Badge variant='secondary'>Không có</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {position.taxExemption ? (
                    <span>{position.taxExemption.reason}</span>
                  ) : (
                    <span className='text-muted-foreground'>Không có lý do</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(position.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {new Date(position.updatedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='icon' onClick={() => onEdit(position.id)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(position.id)}>
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
