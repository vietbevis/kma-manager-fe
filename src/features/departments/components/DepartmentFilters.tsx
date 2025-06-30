import ComboboxFaculty from '@/features/faculties/components/ComboboxFaculty'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Search, X } from 'lucide-react'
import { useDepartmentStore } from '../stores/departmentStore'

export const DepartmentFilters = () => {
  const { filters, setFilters, resetFilters } = useDepartmentStore()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo tên bộ môn...'
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
            placeholder='Tìm kiếm theo mã bộ môn...'
            value={filters.searchCode || ''}
            onChange={(e) => setFilters({ searchCode: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='min-w-[200px]'>
        <ComboboxFaculty
          value={filters.facultyId ? String(filters.facultyId) : ''}
          onValueChange={(value: string) => setFilters({ facultyId: value ? Number(value) : undefined })}
          placeholder='Chọn khoa...'
          width='100%'
          className='min-w-72'
          isFaculty
        />
      </div>

      <Button variant='outline' onClick={resetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}
