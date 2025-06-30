import ComboboxFaculty from '@/features/faculties/components/ComboboxFaculty'
import { ComboboxUser } from '@/features/users/components/ComboboxUser'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  CreateDepartmentSchema,
  UpdateDepartmentSchema,
  type CreateDepartmentSchemaType,
  type DepartmentSchemaType,
  type UpdateDepartmentSchemaType
} from '@/shared/validations/DepartmentSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface DepartmentFormProps {
  initialData?: DepartmentSchemaType
  onSubmit: (data: CreateDepartmentSchemaType | UpdateDepartmentSchemaType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const DepartmentForm = ({ initialData, onSubmit, isLoading, mode }: DepartmentFormProps) => {
  const schema = mode === 'create' ? CreateDepartmentSchema : UpdateDepartmentSchema

  const form = useForm<CreateDepartmentSchemaType | UpdateDepartmentSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      departmentCode: initialData?.departmentCode || '',
      description: initialData?.description || '',
      facultyId: initialData?.faculty?.id || undefined,
      headOfDepartmentId: initialData?.headOfDepartment?.id || undefined
    }
  })

  const handleSubmit = (data: CreateDepartmentSchemaType | UpdateDepartmentSchemaType) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên bộ môn *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên bộ môn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='departmentCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã bộ môn *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập mã bộ môn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='facultyId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khoa *</FormLabel>
              <FormControl>
                <ComboboxFaculty
                  value={form.watch('facultyId') ? String(form.watch('facultyId')) : undefined}
                  onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  placeholder='Chọn khoa'
                  disabled={isLoading}
                  width='100%'
                  isFaculty
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='headOfDepartmentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trưởng bộ môn</FormLabel>
              <FormControl>
                <ComboboxUser
                  value={form.watch('headOfDepartmentId') ? String(form.watch('headOfDepartmentId')) : undefined}
                  onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  placeholder='Chọn trưởng bộ môn'
                  disabled={isLoading}
                  width='100%'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập mô tả về bộ môn' className='resize-none' rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-2'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
