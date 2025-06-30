import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { Account } from '@/shared/validations/AccountSchema'
import { Edit, Trash2 } from 'lucide-react'

interface AccountTableProps {
  data: Account[]
  isLoading: boolean
  onEdit: (userId: number) => void
  onDelete: (userId: number) => void
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'destructive'
    case 'MANAGER':
      return 'default'
    case 'USER':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên'
    case 'MANAGER':
      return 'Quản lý'
    case 'USER':
      return 'Người dùng'
    default:
      return role
  }
}

export const AccountTable = ({ data, isLoading, onEdit, onDelete }: AccountTableProps) => {
  // Show initial loading spinner when no data yet
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu tài khoản</div>
  }

  return (
    <div className='relative'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã nhân viên</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Khoa/Phòng ban</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className='text-right w-20'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((account) => (
              <TableRow key={account.user.id}>
                <TableCell>
                  <Badge variant='outline'>{account.user.code}</Badge>
                </TableCell>
                <TableCell className='font-medium'>{account.user.fullName}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(account.role)}>{getRoleDisplayName(account.role)}</Badge>
                </TableCell>
                <TableCell>
                  {account.user.faculty ? (
                    <span>{account.user.faculty.name}</span>
                  ) : (
                    <span className='text-muted-foreground'>Chưa có</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(account.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='icon' onClick={() => onEdit(account.user.id)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(account.user.id)}>
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
