import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { AcademicDegree } from '@/shared/lib/enum'
import { Search, X } from 'lucide-react'
import { useUserStore } from '../stores/userStore'

export const UserFilters = () => {
  const { filters, setFilters, resetFilters } = useUserStore()

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo họ tên...'
            value={filters.fullName || ''}
            onChange={(e) => setFilters({ fullName: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <div className='flex-1 min-w-[200px]'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Tìm kiếm theo mã nhân viên...'
            value={filters.code || ''}
            onChange={(e) => setFilters({ code: e.target.value })}
            className='pl-10'
          />
        </div>
      </div>

      <Select
        value={filters.academicDegree === undefined ? 'all' : filters.academicDegree}
        onValueChange={(value) =>
          setFilters({ academicDegree: value === 'all' ? undefined : (value as AcademicDegree) })
        }
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Trình độ học vấn' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Trình độ học vấn</SelectItem>
          {Object.values(AcademicDegree).map((degree) => (
            <SelectItem key={degree} value={degree}>
              {degree}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.teachingStatus === undefined ? 'all' : filters.teachingStatus ? 'true' : 'false'}
        onValueChange={(value) => setFilters({ teachingStatus: value === 'all' ? undefined : value === 'true' })}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Trạng thái giảng dạy' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Trạng thái giảng dạy</SelectItem>
          <SelectItem value='true'>Có</SelectItem>
          <SelectItem value='false'>Không</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' onClick={resetFilters} className='flex items-center gap-2'>
        <X className='h-4 w-4' />
        Xóa bộ lọc
      </Button>
    </div>
  )
}
