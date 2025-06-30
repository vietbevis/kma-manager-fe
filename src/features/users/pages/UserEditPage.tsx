import Container from '@/shared/components/Container'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import ROUTES from '@/shared/lib/routes'
import type { UpdateUser } from '@/shared/validations/UserSchema'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useGetUserDetailQuery, useUpdateUserMutation } from '../api/UserService'
import { UserForm } from '../components'

export const UserEditPage = () => {
  const { id } = useParams()
  const { data: userResponse, isLoading } = useGetUserDetailQuery(Number(id))
  const updateUserMutation = useUpdateUserMutation(Number(id))

  const handleSubmit = (data: UpdateUser) => {
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        // TODO: Implement navigation back to users list
        console.log('Navigate back to users list')
      }
    })
  }

  if (isLoading) {
    return <LoadingSpinner isLoading={true} className='py-20' />
  }

  if (!userResponse?.data?.data) {
    return (
      <Container>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>Không tìm thấy nhân viên</p>
          <Button className='mt-4' asChild>
            <Link to={ROUTES.STAFF.ROOT}>Quay lại danh sách</Link>
          </Button>
        </div>
      </Container>
    )
  }

  const user = userResponse.data.data

  return (
    <Container>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' asChild>
            <Link to={ROUTES.STAFF.ROOT}>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa nhân viên</h1>
            <p className='text-muted-foreground'>Cập nhật thông tin nhân viên: {user.fullName}</p>
          </div>
        </div>

        <UserForm mode='edit' user={user} onSubmit={handleSubmit} isLoading={updateUserMutation.isPending} />
      </div>
    </Container>
  )
}
