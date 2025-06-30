import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { TaxExemption } from '@/shared/validations/TaxExemptionSchema'
import { Edit, Trash2 } from 'lucide-react'

interface TaxExemptionTableProps {
  data: TaxExemption[]
  isLoading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const TaxExemptionTable = ({ data, isLoading, onEdit, onDelete }: TaxExemptionTableProps) => {
  // Show initial loading spinner when no data yet
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu miễn giảm</div>
  }

  return (
    <div className='relative'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lý do miễn giảm</TableHead>
              <TableHead>Phần trăm miễn giảm</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((taxExemption) => (
              <TableRow key={taxExemption.id}>
                <TableCell className='font-medium max-w-[300px]'>{taxExemption.reason}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{taxExemption.percentage}%</Badge>
                </TableCell>
                <TableCell>
                  {new Date(taxExemption.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {new Date(taxExemption.updatedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='icon' onClick={() => onEdit(taxExemption.id)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(taxExemption.id)}>
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
