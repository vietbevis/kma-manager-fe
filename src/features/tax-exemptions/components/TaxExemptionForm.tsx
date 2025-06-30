import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  CreateTaxExemptionSchema,
  UpdateTaxExemptionSchema,
  type CreateTaxExemption,
  type TaxExemption,
  type UpdateTaxExemption
} from '@/shared/validations/TaxExemptionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface TaxExemptionFormProps {
  initialData?: TaxExemption
  onSubmit: (data: CreateTaxExemption | UpdateTaxExemption) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const TaxExemptionForm = ({ initialData, onSubmit, isLoading, mode }: TaxExemptionFormProps) => {
  const schema = mode === 'create' ? CreateTaxExemptionSchema : UpdateTaxExemptionSchema

  const form = useForm<CreateTaxExemption | UpdateTaxExemption>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: initialData?.reason || '',
      percentage: initialData?.percentage || 0
    }
  })

  const handleSubmit = (data: CreateTaxExemption | UpdateTaxExemption) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='reason'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do miễn giảm *</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập lý do miễn giảm' className='resize-none' rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='percentage'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phần trăm miễn giảm (%) *</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  step={0.01}
                  placeholder='Nhập phần trăm miễn giảm'
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
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
