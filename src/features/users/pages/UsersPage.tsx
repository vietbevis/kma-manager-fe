import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import ROUTES from '@/shared/lib/routes'
import { useDialogStore } from '@/shared/stores/dialogStore'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router'
import { useDeleteUserMutation } from '../api/UserService'
import { UserFilters, UserTable } from '../components'
import { useUsers } from '../hooks'

export const UsersPage = () => {
  const { data, isLoading, isFilterLoading, fetchNextPage, hasNextPage, isFetchingNextPage, totalItems } = useUsers()
  const deleteUserMutation = useDeleteUserMutation()
  const dialogStore = useDialogStore()

  const handleDelete = useCallback(
    (id: number) => {
      const user = data.find((u) => u.id === id)
      if (!user) return

      dialogStore.openDialog({
        type: 'confirm',
        title: 'Xác nhận xóa nhân viên',
        description: `Bạn có chắc chắn muốn xóa nhân viên "${user.fullName}"? Hành động này không thể hoàn tác.`,
        onConfirm: () => {
          deleteUserMutation.mutate(id)
          dialogStore.closeDialog()
        }
      })
    },
    [data, deleteUserMutation, dialogStore]
  )

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý nhân viên</h1>
          <p className='text-muted-foreground'>Quản lý thông tin nhân viên trong hệ thống ({totalItems} nhân viên)</p>
        </div>
        <Button asChild className='flex items-center gap-2'>
          <Link to={ROUTES.STAFF.CREATE}>
            <Plus className='h-4 w-4' />
            Thêm nhân viên mới
          </Link>
        </Button>
      </div>

      <UserFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên ({totalItems})</CardTitle>
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
            <UserTable data={data} isLoading={isLoading} isFilterLoading={isFilterLoading} onDelete={handleDelete} />
          </InfiniteScrollContainer>
        </CardContent>
      </Card>
    </div>
  )
}
