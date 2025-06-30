import { ComboboxUser } from '@/features/users/components/ComboboxUser'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  CreateFacultySchema,
  UpdateFacultySchema,
  type CreateFacultySchemaType,
  type FacultySchemaType,
  type UpdateFacultySchemaType
} from '@/shared/validations/FacultySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface FacultyFormProps {
  initialData?: FacultySchemaType
  onSubmit: (data: CreateFacultySchemaType | UpdateFacultySchemaType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const FacultyForm = ({ initialData, onSubmit, isLoading, mode }: FacultyFormProps) => {
  const schema = mode === 'create' ? CreateFacultySchema : UpdateFacultySchema

  const form = useForm<CreateFacultySchemaType | UpdateFacultySchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      facultyCode: initialData?.facultyCode || '',
      isFaculty: initialData?.isFaculty || false,
      description: initialData?.description || '',
      headOfFacultyId: initialData?.headOfFaculty?.id || undefined
    }
  })

  const handleSubmit = (data: CreateFacultySchemaType | UpdateFacultySchemaType) => {
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
              <FormLabel>Tên khoa/phòng ban *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên khoa/phòng ban' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='facultyCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã khoa/phòng ban *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập mã khoa/phòng ban' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='headOfFacultyId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trưởng khoa/phòng ban</FormLabel>
              <FormControl>
                <ComboboxUser
                  value={form.watch('headOfFacultyId') ? String(form.watch('headOfFacultyId')) : undefined}
                  onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  placeholder='Chọn trưởng khoa/phòng ban'
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
          name='isFaculty'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Loại đơn vị</FormLabel>
                <div className='text-sm text-muted-foreground'>
                  {field.value ? 'Đây là một khoa' : 'Đây là một phòng ban'}
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
                <Textarea placeholder='Nhập mô tả về khoa/phòng ban' className='resize-none' rows={3} {...field} />
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
