import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Search, X } from 'lucide-react'
import { useAccountStore } from '../stores/accountStore'

export const AccountFilters = () => {
  const { filters, setFilters, resetFilters } = useAccountStore()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm theo tên đăng nhập...'
            value={filters.searchUsername || ''}
            onChange={(e) => setFilters({ searchUsername: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm theo họ tên nhân viên...'
            value={filters.searchFullName || ''}
            onChange={(e) => setFilters({ searchFullName: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <Button variant='outline' onClick={resetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}
