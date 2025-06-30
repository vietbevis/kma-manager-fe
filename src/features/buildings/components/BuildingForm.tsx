import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  CreateBuildingSchema,
  UpdateBuildingSchema,
  type Building,
  type CreateBuildingSchemaType as CreateBuilding,
  type UpdateBuildingSchemaType as UpdateBuilding
} from '@/shared/validations/BuildingSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface BuildingFormProps {
  initialData?: Building
  onSubmit: (data: CreateBuilding | UpdateBuilding) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const BuildingForm = ({ initialData, onSubmit, isLoading, mode }: BuildingFormProps) => {
  const schema = mode === 'create' ? CreateBuildingSchema : UpdateBuildingSchema

  const form = useForm<CreateBuilding | UpdateBuilding>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  })

  const handleSubmit = (data: CreateBuilding | UpdateBuilding) => {
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
              <FormLabel>Tên tòa nhà *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên tòa nhà' {...field} />
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
                <Textarea placeholder='Mô tả tòa nhà' rows={3} className='resize-none' {...field} />
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
