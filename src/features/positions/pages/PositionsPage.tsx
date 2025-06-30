import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { CreatePosition, Position, UpdatePosition } from '@/shared/validations/PositionSchema'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useInfinitePositionQuery,
  useUpdatePositionMutation
} from '../api/PositionService'
import { PositionForm, PositionTable } from '../components'

export const PositionsPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePositionQuery({})
  const { mutateAsync: createMutation, isPending: isCreating } = useCreatePositionMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeletePositionMutation()
  const dialogStore = useDialogStore()

  const [editingPositionId, setEditingPositionId] = useState<number | null>(null)

  const allData = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) =>
      page.items.map(
        (item): Position => ({
          id: item.id,
          name: item.name,
          taxExemption: item.taxExemption,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })
      )
    )
  }, [data?.pages])

  const totalItems = useMemo(() => {
    return data?.pages?.[0]?.meta?.totalItems || 0
  }, [data?.pages])

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdatePositionMutation(editingPositionId || 0)

  const handleDelete = (id: number) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa chức vụ này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        try {
          await deleteMutation(id)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  const handleOpenCreate = () => {
    setEditingPositionId(null)
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm chức vụ mới',
      description: 'Thêm chức vụ mới vào hệ thống',
      content: (
        <PositionForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (id: number) => {
    const found = allData.find((item) => item.id === id)
    if (found) {
      setEditingPositionId(found.id)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa chức vụ',
        description: 'Chỉnh sửa thông tin chức vụ đã tồn tại',
        content: (
          <PositionForm
            mode='edit'
            initialData={found}
            onSubmit={(formData) => handleFormSubmit(formData, 'edit', found)}
            isLoading={isUpdating}
          />
        ),
        openFileUploadDialog: dialogStore.openFileUploadDialog
      })
    }
  }

  const handleFormSubmit = async (
    formData: CreatePosition | UpdatePosition,
    formMode: 'create' | 'edit',
    editingPosition?: Position
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreatePosition)
      } else if (formMode === 'edit' && editingPosition) {
        await updateMutation(formData as UpdatePosition)
        setEditingPositionId(null)
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
            <h1 className='text-3xl font-bold'>Quản lý chức vụ</h1>
            <p className='text-muted-foreground'>Quản lý danh sách các chức vụ trong hệ thống</p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleOpenCreate}>
              <Plus className='h-4 w-4 mr-2' />
              Thêm chức vụ
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách chức vụ ({totalItems})</CardTitle>
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
              <PositionTable data={allData} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
            </InfiniteScrollContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
