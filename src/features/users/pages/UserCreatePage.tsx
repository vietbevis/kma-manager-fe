import Container from '@/shared/components/Container'
import { Button } from '@/shared/components/ui/button'
import ROUTES from '@/shared/lib/routes'
import type { CreateUser } from '@/shared/validations/UserSchema'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useCreateUserMutation } from '../api/UserService'
import { UserForm } from '../components'

export const UserCreatePage = () => {
  const createUserMutation = useCreateUserMutation()
  const navigate = useNavigate()

  const handleSubmit = (data: CreateUser) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.STAFF.ROOT)
      }
    })
  }

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
            <h1 className='text-3xl font-bold tracking-tight'>Thêm nhân viên mới</h1>
            <p className='text-muted-foreground'>Điền thông tin để tạo nhân viên mới trong hệ thống</p>
          </div>
        </div>

        <UserForm mode='create' onSubmit={handleSubmit} isLoading={createUserMutation.isPending} />
      </div>
    </Container>
  )
}
