import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateFacultySchemaType,
  FacultySchemaType,
  MergeFacultySchemaType,
  UpdateFacultySchemaType
} from '@/shared/validations/FacultySchema'
import { Merge, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateFacultyMutation, useMergeFacultyMutation, useUpdateFacultyMutation } from '../api/FacultyService'
import { FacultyFilters, FacultyForm, FacultyMergeForm, FacultyTable } from '../components'
import { useFaculties } from '../hooks/useFaculties'

export const FacultiesPage = () => {
  const { data, isLoading, isFilterLoading, totalItems, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFaculties()
  const { mutateAsync: createMutation, isPending: isCreating } = useCreateFacultyMutation()
  const { mutateAsync: mergeMutation, isPending: isMerging } = useMergeFacultyMutation()
  const dialogStore = useDialogStore()

  const [editingFacultyId, setEditingFacultyId] = useState<number | null>(null)

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateFacultyMutation(editingFacultyId || 0)

  const handleDelete = (id: number) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa khoa/phòng ban này? Hành động này không thể hoàn tác.',
      loading: false,
      onConfirm: () => {
        console.log('Delete faculty with id:', id)
        toast.info('Chức năng này đang được phát triển')
        dialogStore.closeDialog()
      }
    })
  }

  const handleOpenCreate = () => {
    setEditingFacultyId(null)
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm khoa/phòng ban mới',
      description: 'Thêm khoa/phòng ban mới vào hệ thống',
      content: (
        <FacultyForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleOpenMerge = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Gộp khoa',
      description: 'Gộp nhiều khoa thành một đơn vị mới',
      content: <FacultyMergeForm onSubmit={handleMergeSubmit} isLoading={isMerging} />
    })
  }

  const handleEdit = (id: number) => {
    const found = data.find((item) => item.id === id)
    if (found) {
      setEditingFacultyId(found.id)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa khoa/phòng ban',
        description: 'Chỉnh sửa thông tin khoa/phòng ban đã tồn tại',
        content: (
          <FacultyForm
            mode='edit'
            initialData={found}
            onSubmit={(formData) => handleFormSubmit(formData, 'edit', found)}
            isLoading={isUpdating}
          />
        )
      })
    }
  }

  const handleFormSubmit = async (
    formData: CreateFacultySchemaType | UpdateFacultySchemaType,
    formMode: 'create' | 'edit',
    editingFaculty?: FacultySchemaType
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateFacultySchemaType)
      } else if (formMode === 'edit' && editingFaculty) {
        await updateMutation(formData as UpdateFacultySchemaType)
        setEditingFacultyId(null)
      }
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  const handleMergeSubmit = async (mergeData: MergeFacultySchemaType) => {
    try {
      await mergeMutation(mergeData)
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
            <h1 className='text-3xl font-bold'>Quản lý khoa/phòng ban</h1>
            <p className='text-muted-foreground'>Quản lý danh sách các khoa và phòng ban trong hệ thống</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleOpenMerge}>
              <Merge className='h-4 w-4 mr-2' />
              Gộp khoa
            </Button>
            <Button onClick={handleOpenCreate}>
              <Plus className='h-4 w-4 mr-2' />
              Thêm khoa/phòng ban
            </Button>
          </div>
        </div>

        <FacultyFilters />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách khoa/phòng ban ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            <InfiniteScrollContainer
              onBottomReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage()
                }
              }}
              hasMore={hasNextPage}
              isLoading={isLoading || isFetchingNextPage}
            >
              <FacultyTable
                data={data}
                isLoading={isLoading}
                isFilterLoading={isFilterLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </InfiniteScrollContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
