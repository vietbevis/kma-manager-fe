import { ComboboxBuilding } from '@/features/buildings/components'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  CreateClassroomSchema,
  UpdateClassroomSchema,
  type Classroom,
  type CreateClassroomSchemaType as CreateClassroom,
  type UpdateClassroomSchemaType as UpdateClassroom
} from '@/shared/validations/ClassroomSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface ClassroomFormProps {
  initialData?: Classroom
  onSubmit: (data: CreateClassroom | UpdateClassroom) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const ClassroomForm = ({ initialData, onSubmit, isLoading, mode }: ClassroomFormProps) => {
  const schema = mode === 'create' ? CreateClassroomSchema : UpdateClassroomSchema

  const form = useForm<CreateClassroom | UpdateClassroom>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      buildingId: initialData?.building?.id
    }
  })

  const handleSubmit = (data: CreateClassroom | UpdateClassroom) => {
    // Remove buildingId if undefined
    const submitData = {
      ...data,
      ...(data.buildingId && { buildingId: data.buildingId })
    }
    onSubmit(submitData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên phòng học *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên phòng học' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='buildingId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tòa nhà *</FormLabel>
              <FormControl>
                <ComboboxBuilding
                  value={form.watch('buildingId') ? String(form.watch('buildingId')) : undefined}
                  onValueChange={(value: string | undefined) => field.onChange(value ? Number(value) : undefined)}
                  placeholder='Chọn tòa nhà...'
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
                <Textarea placeholder='Mô tả phòng học' rows={3} className='resize-none' {...field} />
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
