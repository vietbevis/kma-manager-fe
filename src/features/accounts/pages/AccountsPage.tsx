import InfiniteScrollContainer from '@/shared/components/InfiniteScrollContainer'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { Account, CreateAccount, UpdateAccount } from '@/shared/validations/AccountSchema'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useInfiniteAccountQuery,
  useUpdateAccountMutation
} from '../api/AccountService'
import { AccountForm, AccountTable } from '../components'
import { AccountFilters } from '../components/AccountFilters'
import { useAccountStore } from '../stores/accountStore'

export const AccountsPage = () => {
  const { filters, initializeFromUrl } = useAccountStore()

  const apiFilters = useMemo(() => {
    const obj: any = {}
    if (filters.searchUsername) obj.username = filters.searchUsername
    if (filters.searchFullName) obj.fullName = filters.searchFullName
    return obj
  }, [filters])

  const debouncedFilters = useDebounce(apiFilters, 300)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteAccountQuery(debouncedFilters)

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateAccountMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteAccountMutation()
  const dialogStore = useDialogStore()

  const [editingAccountUserId, setEditingAccountUserId] = useState<number | null>(null)

  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateAccountMutation(editingAccountUserId || 0)

  const allData = useMemo(() => {
    if (!data?.pages) return []

    return data.pages.flatMap((page) => page.items)
  }, [data?.pages])

  const totalItems = useMemo(() => {
    return data?.pages?.[0]?.meta?.totalItems || 0
  }, [data?.pages])

  useEffect(() => {
    initializeFromUrl()
  }, [initializeFromUrl])

  const handleDelete = (userId: number) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        try {
          await deleteMutation(userId)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  const handleOpenCreate = () => {
    setEditingAccountUserId(null)
    dialogStore.openDialog({
      type: 'custom',
      title: 'Tạo tài khoản mới',
      description: 'Tạo tài khoản cho nhân viên',
      content: (
        <AccountForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (userId: number) => {
    const found = allData.find((item) => item.user.id === userId)
    if (found) {
      setEditingAccountUserId(found.user.id)
      dialogStore.openDialog({
        type: 'custom',
        title: 'Chỉnh sửa tài khoản',
        description: 'Cập nhật thông tin tài khoản nhân viên',
        content: (
          <AccountForm
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
    formData: CreateAccount | UpdateAccount,
    formMode: 'create' | 'edit',
    editingAccount?: Account
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateAccount)
      } else if (formMode === 'edit' && editingAccount) {
        await updateMutation(formData as UpdateAccount)
        setEditingAccountUserId(null)
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
            <h1 className='text-3xl font-bold'>Quản lý tài khoản</h1>
            <p className='text-muted-foreground'>Quản lý tài khoản đăng nhập của nhân viên</p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleOpenCreate}>
              <Plus className='h-4 w-4 mr-2' />
              Tạo tài khoản
            </Button>
          </div>
        </div>

        {/* Filters */}
        <AccountFilters />

        <Card>
          <CardHeader>
            <CardTitle>Danh sách tài khoản ({totalItems})</CardTitle>
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
              <AccountTable data={allData} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
            </InfiniteScrollContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
