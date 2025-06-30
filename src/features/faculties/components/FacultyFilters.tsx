import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Search, X } from 'lucide-react'
import { useFacultyStore } from '../stores/facultyStore'

export const FacultyFilters = () => {
  const { filters, setFilters, resetFilters } = useFacultyStore()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo tên khoa/phòng ban...'
            value={filters.searchName || ''}
            onChange={(e) => setFilters({ searchName: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo mã khoa/phòng ban...'
            value={filters.searchCode || ''}
            onChange={(e) => setFilters({ searchCode: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <Select
        value={filters.isFaculty === undefined ? 'all' : filters.isFaculty ? 'true' : 'false'}
        onValueChange={(value) => setFilters({ isFaculty: value === 'all' ? undefined : value === 'true' })}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Loại đơn vị' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Khoa/Phòng ban</SelectItem>
          <SelectItem value='true'>Khoa</SelectItem>
          <SelectItem value='false'>Phòng ban</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={resetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}
