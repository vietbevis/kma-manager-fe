import { ComboboxTaxExemption } from '@/features/tax-exemptions/components'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  CreatePositionSchema,
  UpdatePositionSchema,
  type CreatePosition,
  type Position,
  type UpdatePosition
} from '@/shared/validations/PositionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface PositionFormProps {
  initialData?: Position
  onSubmit: (data: CreatePosition | UpdatePosition) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const PositionForm = ({ initialData, onSubmit, isLoading, mode }: PositionFormProps) => {
  const schema = mode === 'create' ? CreatePositionSchema : UpdatePositionSchema

  const form = useForm<CreatePosition | UpdatePosition>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      taxExemptionId: initialData?.taxExemption?.id
    }
  })

  const handleSubmit = (data: CreatePosition | UpdatePosition) => {
    // Remove taxExemptionId if it's undefined
    const submitData = {
      ...data,
      ...(data.taxExemptionId && { taxExemptionId: data.taxExemptionId })
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
              <FormLabel>Tên chức vụ *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên chức vụ' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='taxExemptionId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miễn giảm</FormLabel>
              <FormControl>
                <ComboboxTaxExemption
                  value={form.watch('taxExemptionId') ? String(form.watch('taxExemptionId')) : undefined}
                  onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                  placeholder='Chọn miễn giảm (tùy chọn)...'
                  width='100%'
                />
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
