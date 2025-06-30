import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  AcademicYearSchemaType,
  CreateAcademicYearSchemaType,
  UpdateAcademicYearSchemaType
} from '@/shared/validations/AcademicYearSchema'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
  useCreateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useUpdateAcademicYearMutation
} from '../api/AcademicYearService'
import { AcademicYearFilters, AcademicYearForm, AcademicYearTable } from '../components'
import { useAcademicYears } from '../hooks/useAcademicYears'

export const AcademicYearsPage = () => {
  const { data, isLoading, totalItems } = useAcademicYears()
  const { mutateAsync: createMutation, isPending: isCreating } = useCreateAcademicYearMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteAcademicYearMutation()
  const dialogStore = useDialogStore()

  const [editingYearCode, setEditingYearCode] = useState<string | null>(null)

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateAcademicYearMutation(editingYearCode || '')

  const handleDelete = (yearCode: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa năm học này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        await deleteMutation(yearCode)
        dialogStore.closeDialog()
      }
    })
  }

  const handleOpenCreate = () => {
    setEditingYearCode(null)
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm năm học mới',
      description: 'Thêm năm học mới vào hệ thống',
      content: (
        <AcademicYearForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (yearCode: string) => {
    setEditingYearCode(null)
    const found = data.find((item) => item.yearCode === yearCode)
    if (found) {
      setEditingYearCode(found.yearCode)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa năm học',
        description: 'Chỉnh sửa thông tin năm học đã tồn tại',
        content: (
          <AcademicYearForm
            mode='edit'
            initialData={{
              ...found,
              id: found.id,
              createdAt: new Date(found.createdAt),
              updatedAt: new Date(found.updatedAt)
            }}
            onSubmit={(formData) => handleFormSubmit(formData, 'edit', found)}
            isLoading={isUpdating}
          />
        )
      })
    }
  }

  const handleFormSubmit = async (
    formData: CreateAcademicYearSchemaType | UpdateAcademicYearSchemaType,
    formMode: 'create' | 'edit',
    editingAcademicYear?: AcademicYearSchemaType
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateAcademicYearSchemaType)
      } else if (formMode === 'edit' && editingAcademicYear) {
        await updateMutation(formData as UpdateAcademicYearSchemaType)
        setEditingYearCode(null)
      }
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Quản lý năm học</h1>
            <p className='text-muted-foreground'>Quản lý danh sách năm học trong hệ thống</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm năm học
          </Button>
        </div>

        <AcademicYearFilters />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách năm học ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            <AcademicYearTable data={data} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
