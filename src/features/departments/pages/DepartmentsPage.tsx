import {
  useCreateDepartmentMutation,
  useInfiniteDepartmentQuery,
  useUpdateDepartmentMutation
} from '@/features/departments/api/DepartmentService'
import { DepartmentFilters, DepartmentForm, DepartmentTable } from '@/features/departments/components'
import { useDepartmentStore } from '@/features/departments/stores/departmentStore'
import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  CreateDepartmentSchemaType,
  DepartmentSchemaType,
  UpdateDepartmentSchemaType
} from '@/shared/validations/DepartmentSchema'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export const DepartmentsPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentSchemaType | null>(null)
  const { openDialog, closeDialog } = useDialogStore()
  const { filters, initializeFromUrl } = useDepartmentStore()

  // Convert store filters to API format
  const apiFilters = useMemo(() => {
    const converted: any = {}
    if (filters.searchName) converted.name = filters.searchName
    if (filters.searchCode) converted.departmentCode = filters.searchCode
    if (filters.facultyId) converted.facultyId = filters.facultyId
    return converted
  }, [filters])

  // Debounce the API filters to prevent excessive API calls
  const debouncedApiFilters = useDebounce(apiFilters, 300)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteDepartmentQuery(debouncedApiFilters)
  const totalItems = data?.pages[0]?.meta.totalItems || 0

  const createMutation = useCreateDepartmentMutation()
  const updateMutation = useUpdateDepartmentMutation(selectedDepartment?.id || 0)

  const departments = useMemo(() => {
    return data?.pages?.flatMap((page) => page.items) || []
  }, [data])

  // Initialize filters from URL on mount
  useEffect(() => {
    initializeFromUrl()
  }, [initializeFromUrl])

  const handleCreateDepartment = useCallback(
    (data: CreateDepartmentSchemaType) => {
      createMutation.mutate(data, {
        onSuccess: () => {
          closeDialog()
        }
      })
    },
    [createMutation, closeDialog]
  )

  const handleEditDepartment = useCallback(
    (department: DepartmentSchemaType) => {
      setSelectedDepartment(department)
      openDialog({
        type: 'custom',
        title: 'Chỉnh sửa bộ môn',
        description: 'Chỉnh sửa thông tin bộ môn',
        content: (
          <DepartmentForm
            mode='edit'
            initialData={department}
            onSubmit={(formData) => handleUpdateDepartment(formData, department)}
            isLoading={updateMutation.isPending}
          />
        )
      })
    },
    [openDialog, updateMutation.isPending]
  )

  const handleUpdateDepartment = useCallback(
    (data: UpdateDepartmentSchemaType, department?: DepartmentSchemaType) => {
      if (!department) return

      updateMutation.mutate(data, {
        onSuccess: () => {
          closeDialog()
          setSelectedDepartment(null)
        }
      })
    },
    [updateMutation, closeDialog]
  )

  const handleDeleteDepartment = useCallback(
    (department: DepartmentSchemaType) => {
      setSelectedDepartment(department)
      openDialog({
        type: 'confirm',
        title: 'Xác nhận xóa bộ môn',
        description: `Bạn có chắc chắn muốn xóa bộ môn "${department.name}"? Hành động này không thể hoàn tác.`,
        onConfirm: () => handleConfirmDelete(department.id)
      })
    },
    [openDialog]
  )

  const handleConfirmDelete = useCallback(
    (departmentId: number) => {
      console.log('🚀 ~ DepartmentsPage ~ departmentId:', departmentId)
      toast.info('Chức năng này đang được phát triển')
    },
    [closeDialog]
  )

  const handleCreateClick = useCallback(() => {
    openDialog({
      type: 'custom',
      title: 'Thêm bộ môn mới',
      description: 'Thêm thông tin bộ môn mới',
      content: <DepartmentForm mode='create' onSubmit={handleCreateDepartment} isLoading={createMutation.isPending} />
    })
  }, [openDialog, handleCreateDepartment, createMutation.isPending])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Quản lý bộ môn</h1>
            <p className='text-muted-foreground'>Quản lý thông tin các bộ môn trong trường</p>
          </div>
          <Button onClick={handleCreateClick}>
            <Plus className='mr-2 h-4 w-4' />
            Thêm bộ môn
          </Button>
        </div>

        {/* Filters */}
        <DepartmentFilters />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách bộ môn ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            <InfiniteScrollContainer
              hasMore={hasNextPage}
              isLoading={isFetchingNextPage}
              onBottomReached={handleLoadMore}
            >
              <DepartmentTable
                departments={departments}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
                isLoading={isLoading && departments.length === 0}
              />
            </InfiniteScrollContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
