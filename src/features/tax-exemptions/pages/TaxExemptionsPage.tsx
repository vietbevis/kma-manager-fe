import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { CreateTaxExemption, TaxExemption, UpdateTaxExemption } from '@/shared/validations/TaxExemptionSchema'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  useCreateTaxExemptionMutation,
  useDeleteTaxExemptionMutation,
  useInfiniteTaxExemptionQuery,
  useUpdateTaxExemptionMutation
} from '../api/TaxExemptionService'
import { TaxExemptionForm, TaxExemptionTable } from '../components'

export const TaxExemptionsPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteTaxExemptionQuery({})
  const { mutateAsync: createMutation, isPending: isCreating } = useCreateTaxExemptionMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteTaxExemptionMutation()
  const dialogStore = useDialogStore()

  const [editingTaxExemptionId, setEditingTaxExemptionId] = useState<number | null>(null)

  const allData = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) =>
      page.items.map(
        (item): TaxExemption => ({
          id: item.id,
          reason: item.reason,
          percentage: item.percentage,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })
      )
    )
  }, [data?.pages])

  const totalItems = useMemo(() => {
    return data?.pages?.[0]?.meta?.totalItems || 0
  }, [data?.pages])

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateTaxExemptionMutation(
    editingTaxExemptionId || 0
  )

  const handleDelete = (id: number) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa miễn giảm này? Hành động này không thể hoàn tác.',
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
    setEditingTaxExemptionId(null)
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm miễn giảm mới',
      description: 'Thêm miễn giảm mới vào hệ thống',
      content: (
        <TaxExemptionForm
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
      setEditingTaxExemptionId(found.id)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa miễn giảm',
        description: 'Chỉnh sửa thông tin miễn giảm đã tồn tại',
        content: (
          <TaxExemptionForm
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
    formData: CreateTaxExemption | UpdateTaxExemption,
    formMode: 'create' | 'edit',
    editingTaxExemption?: TaxExemption
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateTaxExemption)
      } else if (formMode === 'edit' && editingTaxExemption) {
        await updateMutation(formData as UpdateTaxExemption)
        setEditingTaxExemptionId(null)
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
            <h1 className='text-3xl font-bold'>Quản lý miễn giảm</h1>
            <p className='text-muted-foreground'>Quản lý danh sách các miễn giảm trong hệ thống</p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleOpenCreate}>
              <Plus className='h-4 w-4 mr-2' />
              Thêm miễn giảm
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách miễn giảm ({totalItems})</CardTitle>
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
              <TaxExemptionTable data={allData} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
            </InfiniteScrollContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
