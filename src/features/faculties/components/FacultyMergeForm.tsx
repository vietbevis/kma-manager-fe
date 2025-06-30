import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { MergeFacultySchema, type MergeFacultySchemaType } from '@/shared/validations/FacultySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import ComboboxFaculty from './ComboboxFaculty'

interface FacultyMergeFormProps {
  onSubmit: (data: MergeFacultySchemaType) => void
  isLoading: boolean
}

export const FacultyMergeForm = ({ onSubmit, isLoading }: FacultyMergeFormProps) => {
  const form = useForm<MergeFacultySchemaType>({
    resolver: zodResolver(MergeFacultySchema),
    defaultValues: {
      mergeFacultyIds: [],
      newFacultyName: '',
      newFacultyCode: '',
      newFacultyDescription: '',
      newFacultyHeadOfFacultyId: undefined
    }
  })

  const handleSubmit = (data: MergeFacultySchemaType) => {
    onSubmit(data)
  }

  const handleFacultySelectionChange = (selectedIds: string[]) => {
    const facultyIds = selectedIds.map((id) => parseInt(id, 10))
    form.setValue('mergeFacultyIds', facultyIds)

    // Clear validation error if user selects enough faculties
    if (facultyIds.length >= 2) {
      form.clearErrors('mergeFacultyIds')
    }
  }

  const selectedFacultyIds = form.watch('mergeFacultyIds')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <div className='border rounded-lg p-4 bg-muted/30'>
            <h4 className='text-sm font-medium mb-3'>Bước 1: Chọn các khoa cần gộp</h4>
            <FormField
              control={form.control}
              name='mergeFacultyIds'
              render={() => (
                <FormItem>
                  <FormLabel>Chọn khoa để gộp *</FormLabel>
                  <FormControl>
                    <ComboboxFaculty
                      multiple
                      values={selectedFacultyIds.map((id) => id.toString())}
                      onValuesChange={handleFacultySelectionChange}
                      placeholder='Chọn ít nhất 2 khoa để gộp...'
                      maxSelection={5}
                      showSelectionCount
                      width='100%'
                      isFaculty
                    />
                  </FormControl>
                  <div className='text-xs text-muted-foreground'>
                    Đã chọn: {selectedFacultyIds.length} khoa
                    {selectedFacultyIds.length < 2 && ' (Cần ít nhất 2)'}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='border rounded-lg p-4 space-y-4'>
            <h4 className='text-sm font-medium'>Bước 2: Thông tin khoa mới</h4>

            <FormField
              control={form.control}
              name='newFacultyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khoa mới *</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên khoa sau khi gộp' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newFacultyCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã khoa mới *</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập mã khoa sau khi gộp' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newFacultyDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả về khoa mới' className='resize-none' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex flex-col gap-3 pt-4 border-t'>
          <Button type='submit' disabled={isLoading || selectedFacultyIds.length < 2}>
            {isLoading ? 'Đang xử lý...' : 'Gộp khoa'}
          </Button>
          <div className='text-sm text-muted-foreground flex items-center'>
            {selectedFacultyIds.length < 2
              ? 'Vui lòng chọn ít nhất 2 khoa để gộp'
              : `Sẽ gộp ${selectedFacultyIds.length} khoa thành 1`}
          </div>
        </div>
      </form>
    </Form>
  )
}
