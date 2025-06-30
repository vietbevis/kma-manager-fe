import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  CreateAcademicYearSchema,
  UpdateAcademicYearSchema,
  type AcademicYearSchemaType,
  type CreateAcademicYearSchemaType,
  type UpdateAcademicYearSchemaType
} from '@/shared/validations/AcademicYearSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface AcademicYearFormProps {
  initialData?: AcademicYearSchemaType
  onSubmit: (data: CreateAcademicYearSchemaType | UpdateAcademicYearSchemaType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const AcademicYearForm = ({ initialData, onSubmit, isLoading, mode }: AcademicYearFormProps) => {
  const schema = mode === 'create' ? CreateAcademicYearSchema : UpdateAcademicYearSchema

  const form = useForm<CreateAcademicYearSchemaType | UpdateAcademicYearSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      yearCode: initialData?.yearCode || ''
    }
  })

  const handleSubmit = (data: CreateAcademicYearSchemaType | UpdateAcademicYearSchemaType) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='yearCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã năm học *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập mã năm học (ví dụ: 2024-2025)' {...field} />
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
