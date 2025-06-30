import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { DepartmentSchemaType } from '@/shared/validations/DepartmentSchema'
import { Edit, Trash2 } from 'lucide-react'

interface DepartmentTableProps {
  departments: DepartmentSchemaType[]
  onEdit?: (department: DepartmentSchemaType) => void
  onDelete?: (department: DepartmentSchemaType) => void
  isLoading?: boolean
}

export const DepartmentTable = ({ departments, onEdit, onDelete, isLoading }: DepartmentTableProps) => {
  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='h-12 animate-pulse rounded-md bg-muted' />
        ))}
      </div>
    )
  }

  if (departments.length === 0) {
    return (
      <div className='flex h-24 items-center justify-center text-muted-foreground'>Không có dữ liệu bộ môn nào</div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên bộ môn</TableHead>
            <TableHead>Mã bộ môn</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Trưởng bộ môn</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className='w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className='font-medium'>{department.name}</TableCell>
              <TableCell>
                <Badge variant='outline'>{department.departmentCode}</Badge>
              </TableCell>
              <TableCell>
                <div className='flex flex-col'>
                  <span className='font-medium'>{department.faculty.name}</span>
                  <span className='text-sm text-muted-foreground'>{department.faculty.facultyCode}</span>
                </div>
              </TableCell>
              <TableCell>
                {department.headOfDepartment ? (
                  <Badge variant='secondary'>{department.headOfDepartment.fullName}</Badge>
                ) : (
                  <span className='text-muted-foreground'>Chưa có</span>
                )}
              </TableCell>
              <TableCell className='max-w-[200px] truncate' title={department.description}>
                {department.description || <span className='text-muted-foreground'>Không có mô tả</span>}
              </TableCell>
              <TableCell className='text-right w-20'>
                <div className='flex justify-end gap-2'>
                  {onEdit && (
                    <Button variant='outline' size='icon' onClick={() => onEdit(department)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant='outline' size='icon' onClick={() => onDelete(department)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
