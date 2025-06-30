import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  Building,
  CreateBuildingSchemaType as CreateBuilding,
  UpdateBuildingSchemaType as UpdateBuilding
} from '@/shared/validations/BuildingSchema'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useInfiniteBuildingQuery,
  useUpdateBuildingMutation
} from '../api/BuildingService'
import { BuildingFilters, BuildingForm, BuildingTable } from '../components'
import { useBuildingStore } from '../stores/buildingStore'

export const BuildingsPage = () => {
  const { filters, initializeFromUrl } = useBuildingStore()

  // convert to api filters
  const apiFilters = useMemo(() => {
    const obj: any = {}
    if (filters.searchName) obj.name = filters.searchName
    return obj
  }, [filters])

  const debouncedFilters = useDebounce(apiFilters, 300)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteBuildingQuery(debouncedFilters)

  // init from URL
  useEffect(() => {
    initializeFromUrl()
  }, [initializeFromUrl])

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateBuildingMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteBuildingMutation()
  const dialogStore = useDialogStore()

  const [editingId, setEditingId] = useState<number | null>(null)

  const allData = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) =>
      page.items.map(
        (item): Building => ({
          id: item.id,
          name: item.name,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })
      )
    )
  }, [data?.pages])

  const totalItems = useMemo(() => data?.pages?.[0]?.meta?.totalItems || 0, [data?.pages])

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateBuildingMutation(editingId || 0)

  const handleDelete = (id: number) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa tòa nhà này? Hành động này không thể hoàn tác.',
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
    setEditingId(null)
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm tòa nhà mới',
      description: 'Thêm tòa nhà mới vào hệ thống',
      content: (
        <BuildingForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (id: number) => {
    const found = allData.find((b) => b.id === id)
    if (found) {
      setEditingId(found.id)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa tòa nhà',
        description: 'Chỉnh sửa thông tin tòa nhà đã tồn tại',
        content: (
          <BuildingForm
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
    formData: CreateBuilding | UpdateBuilding,
    formMode: 'create' | 'edit',
    editing?: Building
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateBuilding)
      } else if (formMode === 'edit' && editing) {
        await updateMutation(formData as UpdateBuilding)
        setEditingId(null)
      }
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý tòa nhà</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các tòa nhà trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm tòa nhà
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BuildingFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tòa nhà ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          <InfiniteScrollContainer
            onBottomReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage()
            }}
            hasMore={hasNextPage}
            isLoading={isLoading || isFetchingNextPage}
          >
            <BuildingTable data={allData} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
          </InfiniteScrollContainer>
        </CardContent>
      </Card>
    </div>
  )
}
