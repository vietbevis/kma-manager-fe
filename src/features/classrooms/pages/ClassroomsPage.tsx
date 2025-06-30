import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  Classroom,
  CreateClassroomSchemaType as CreateClassroom,
  UpdateClassroomSchemaType as UpdateClassroom
} from '@/shared/validations/ClassroomSchema'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  useCreateClassroomMutation,
  useDeleteClassroomMutation,
  useInfiniteClassroomQuery,
  useUpdateClassroomMutation
} from '../api/ClassroomService'
import { ClassroomFilters, ClassroomForm, ClassroomTable } from '../components'
import { useClassroomStore } from '../stores/classroomStore'

export const ClassroomsPage = () => {
  const { filters, initializeFromUrl } = useClassroomStore()

  const apiFilters = useMemo(() => {
    const obj: any = {}
    if (filters.searchName) obj.name = filters.searchName
    if (filters.buildingId) obj.buildingId = filters.buildingId
    return obj
  }, [filters])

  const debouncedFilters = useDebounce(apiFilters, 300)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteClassroomQuery(debouncedFilters)

  useEffect(() => {
    initializeFromUrl()
  }, [initializeFromUrl])

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateClassroomMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteClassroomMutation()
  const dialogStore = useDialogStore()

  const [editingId, setEditingId] = useState<number | null>(null)

  const allData = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) =>
      page.items.map(
        (item): Classroom => ({
          id: item.id,
          name: item.name,
          description: item.description,
          building: item.building,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })
      )
    )
  }, [data?.pages])

  const totalItems = useMemo(() => data?.pages?.[0]?.meta?.totalItems || 0, [data?.pages])

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateClassroomMutation(editingId || 0)

  const handleDelete = (id: number) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa phòng học này? Hành động này không thể hoàn tác.',
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
      title: 'Thêm phòng học mới',
      description: 'Thêm phòng học mới vào hệ thống',
      content: (
        <ClassroomForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (id: number) => {
    const found = allData.find((c) => c.id === id)
    if (found) {
      setEditingId(found.id)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa phòng học',
        description: 'Chỉnh sửa thông tin phòng học đã tồn tại',
        content: (
          <ClassroomForm
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
    formData: CreateClassroom | UpdateClassroom,
    formMode: 'create' | 'edit',
    editing?: Classroom
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateClassroom)
      } else if (formMode === 'edit' && editing) {
        await updateMutation(formData as UpdateClassroom)
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
          <h1 className='text-3xl font-bold'>Quản lý phòng học</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các phòng học trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm phòng học
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ClassroomFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng học ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          <InfiniteScrollContainer
            onBottomReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage()
            }}
            hasMore={hasNextPage}
            isLoading={isLoading || isFetchingNextPage}
          >
            <ClassroomTable data={allData} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
          </InfiniteScrollContainer>
        </CardContent>
      </Card>
    </div>
  )
}
