import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { AcademicDegree, Gender } from '@/shared/lib/enum'
import ROUTES from '@/shared/lib/routes'
import type { User } from '@/shared/validations/UserSchema'
import { Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

interface UserTableProps {
  data: User[]
  isLoading: boolean
  isFilterLoading?: boolean
  onDelete: (id: number) => void
}

const getGenderLabel = (gender: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return 'Nam'
    case Gender.FEMALE:
      return 'Nữ'
    default:
      return 'Không xác định'
  }
}

const getGenderVariant = (gender: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return 'default'
    case Gender.FEMALE:
      return 'secondary'
    default:
      return 'outline'
  }
}

const getAcademicDegreeLabel = (degree: AcademicDegree | null) => {
  if (!degree) return 'Chưa có'
  return degree
}

const getTeachingStatusVariant = (status: boolean) => {
  return status ? 'default' : 'secondary'
}

export const UserTable = ({ data, isLoading, isFilterLoading, onDelete }: UserTableProps) => {
  // Show initial loading spinner when no data yet
  if (isLoading && data.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className='text-center py-8 text-muted-foreground'>Không có dữ liệu nhân viên</div>
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
              <TableHead>Mã nhân viên</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Khoa</TableHead>
              <TableHead>Trình độ</TableHead>
              <TableHead>Trạng thái giảng dạy</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className='text-right w-32'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Badge variant='outline'>{user.code}</Badge>
                </TableCell>
                <TableCell className='font-medium'>{user.fullName}</TableCell>
                <TableCell>
                  <Badge variant={getGenderVariant(user.gender)}>{getGenderLabel(user.gender)}</Badge>
                </TableCell>
                <TableCell>{user.email || 'Chưa có'}</TableCell>
                <TableCell>{user.phone || 'Chưa có'}</TableCell>
                <TableCell>{user.faculty?.name || 'Chưa có'}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{getAcademicDegreeLabel(user.academicDegree)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getTeachingStatusVariant(user.teachingStatus)}>
                    {user.teachingStatus ? 'Đang giảng dạy' : 'Không giảng dạy'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className='text-right w-32'>
                  <div className='flex justify-end gap-2'>
                    {/* <Button variant='outline' size='icon' asChild>
                      <Link to={ROUTES.STAFF.DETAIL(user.id)}>
                        <Eye className='h-4 w-4' />
                      </Link>
                    </Button> */}
                    <Button variant='outline' size='icon' asChild>
                      <Link to={ROUTES.STAFF.EDIT(user.id)}>
                        <Edit className='h-4 w-4' />
                      </Link>
                    </Button>
                    <Button variant='outline' size='icon' onClick={() => onDelete(user.id)}>
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
