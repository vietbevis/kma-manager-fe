import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Role } from '@/shared/lib/enum'
import {
  CreateAccountSchema,
  UpdateAccountSchema,
  type Account,
  type CreateAccount,
  type UpdateAccount
} from '@/shared/validations/AccountSchema'
import type { User } from '@/shared/validations/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ComboboxUser } from '../../users/components/ComboboxUser'

interface AccountFormProps {
  initialData?: Account
  onSubmit: (data: CreateAccount | UpdateAccount) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const AccountForm = ({ initialData, onSubmit, isLoading, mode }: AccountFormProps) => {
  if (mode === 'create') {
    return <CreateAccountForm onSubmit={onSubmit} isLoading={isLoading} />
  }

  return <EditAccountForm initialData={initialData} onSubmit={onSubmit} isLoading={isLoading} />
}

interface CreateAccountFormProps {
  onSubmit: (data: CreateAccount) => void
  isLoading: boolean
}

const CreateAccountForm = ({ onSubmit, isLoading }: CreateAccountFormProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const form = useForm<CreateAccount>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      userId: 0,
      username: '',
      password: '',
      role: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='userId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhân viên *</FormLabel>
              <FormControl>
                <ComboboxUser
                  value={form.watch('userId') ? String(form.watch('userId')) : undefined}
                  onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                  placeholder='Chọn nhân viên để tạo tài khoản'
                  width='100%'
                  onSelect={(user) => {
                    setSelectedUser(user)
                  }}
                  haveAccount={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên đăng nhập' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu *</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Nhập mật khẩu' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full' disabled={!selectedUser}>
                    <SelectValue placeholder='Chọn vai trò' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedUser ? (
                    selectedUser.faculty?.isFaculty ? (
                      <>
                        {Object.values(Role.Faculty).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </>
                    ) : (
                      <>
                        {Object.values(Role.Department).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </>
                    )
                  ) : null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-2'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface EditAccountFormProps {
  initialData?: Account
  onSubmit: (data: UpdateAccount) => void
  isLoading: boolean
}

const EditAccountForm = ({ initialData, onSubmit, isLoading }: EditAccountFormProps) => {
  const form = useForm<UpdateAccount>({
    resolver: zodResolver(UpdateAccountSchema),
    defaultValues: {
      role: initialData?.role || '',
      newPassword: undefined
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='rounded-lg border p-4 bg-muted/50'>
          <h3 className='font-medium mb-2'>Thông tin tài khoản</h3>
          <div className='space-y-1 text-sm'>
            <p>
              <strong>Mã nhân viên:</strong> {initialData?.user.code}
            </p>
            <p>
              <strong>Họ và tên:</strong> {initialData?.user.fullName}
            </p>
            <p>
              <strong>Tên đăng nhập:</strong> {initialData?.username}
            </p>
            <p>
              <strong>Mật khẩu:</strong> *********
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reset mật khẩu (để trống nếu không đổi)</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Nhập mật khẩu mới' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={!initialData} className='w-full'>
                    <SelectValue placeholder='Chọn vai trò' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {initialData ? (
                    initialData?.user.faculty?.isFaculty ? (
                      <>
                        {Object.values(Role.Faculty).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </>
                    ) : (
                      <>
                        {Object.values(Role.Department).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </>
                    )
                  ) : null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-2'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
