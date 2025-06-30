import { Button } from '@/shared/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import type { DepartmentSchemaType } from '@/shared/validations/DepartmentSchema'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteDepartmentQuery } from '../api/DepartmentService'

interface ComboboxDepartmentProps {
  value?: string
  onValueChange?: (value: string) => void
  onSelect?: (value: DepartmentSchemaType | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
  facultyId?: number // optional filter by faculty
}

const ComboboxDepartment = forwardRef<HTMLButtonElement, ComboboxDepartmentProps>(
  (
    {
      value,
      onValueChange,
      onSelect,
      placeholder = 'Chọn bộ môn...',
      disabled = false,
      className,
      width = '300px',
      error,
      facultyId
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearch = useDebounce(searchValue, 300)
    const listRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)

    const {
      data,
      isLoading,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      error: queryError
    } = useInfiniteDepartmentQuery({
      name: debouncedSearch || undefined,
      facultyId: facultyId || undefined
    })

    const departments = useMemo(() => data?.pages?.flatMap((p) => p.items) || [], [data])

    const selectedDept = useMemo(() => departments.find((d) => d.id.toString() === value), [departments, value])

    const handleScroll = useCallback(async () => {
      if (!listRef.current || !hasNextPage || isFetchingNextPage || isLoading || isScrolling) return
      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      const threshold = 100
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        setIsScrolling(true)
        try {
          await fetchNextPage()
        } finally {
          setTimeout(() => setIsScrolling(false), 500)
        }
      }
    }, [hasNextPage, isFetchingNextPage, isLoading, isScrolling, fetchNextPage])

    const handleSelect = useCallback(
      (deptId: string) => {
        onValueChange?.(deptId)
        setOpen(false)
        setSearchValue('')
        onSelect?.(departments.find((d) => d.id.toString() === deptId) || null)
      },
      [onValueChange, onSelect, departments]
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange?.('')
      },
      [onValueChange]
    )

    const displayText = useMemo(() => {
      return selectedDept ? selectedDept.name : placeholder
    }, [selectedDept, placeholder])

    const hasSelection = !!value

    useEffect(() => {
      if (!open) setSearchValue('')
    }, [open])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }, [])

    const renderContent = () => {
      if (isLoading && departments.length === 0) {
        return (
          <CommandItem disabled>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Đang tải dữ liệu...
          </CommandItem>
        )
      }
      if (queryError) {
        return (
          <CommandItem disabled className='text-destructive'>
            Có lỗi xảy ra khi tải dữ liệu
          </CommandItem>
        )
      }
      if (departments.length === 0 && !isLoading) {
        return (
          <CommandItem disabled>
            {debouncedSearch ? 'Không tìm thấy bộ môn nào' : 'Không có dữ liệu bộ môn'}
          </CommandItem>
        )
      }
      return (
        <>
          {departments.map((dept) => (
            <CommandItem
              key={dept.id}
              value={dept.id.toString()}
              onSelect={() => handleSelect(dept.id.toString())}
              className='flex cursor-pointer items-center justify-between'
            >
              <div className='flex flex-col'>
                <span className='font-medium'>{dept.name}</span>
                <span className='text-sm text-muted-foreground'>
                  {dept.faculty.name} - {dept.departmentCode}
                </span>
              </div>
              <Check className={cn('ml-2 h-4 w-4', value === dept.id.toString() ? 'opacity-100' : 'opacity-0')} />
            </CommandItem>
          ))}
          {(isFetchingNextPage || (hasNextPage && isScrolling)) && (
            <CommandItem disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang tải thêm...
            </CommandItem>
          )}
        </>
      )
    }

    return (
      <div className={cn('relative', className)} style={{ width }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant='outline'
              role='combobox'
              aria-expanded={open}
              aria-haspopup='listbox'
              className={cn(
                'w-full justify-between',
                !hasSelection && 'text-muted-foreground',
                error && 'border-destructive',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              disabled={disabled}
              onKeyDown={handleKeyDown}
              style={{ width: width !== '100%' ? width : undefined }}
            >
              <span className='truncate'>{displayText}</span>
              <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
            <Command shouldFilter={false}>
              <CommandInput placeholder='Tìm kiếm bộ môn...' value={searchValue} onValueChange={setSearchValue} />
              <CommandList ref={listRef} onScroll={handleScroll} className='max-h-[200px] overflow-auto'>
                <CommandGroup>{renderContent()}</CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {hasSelection && !disabled && (
          <button
            type='button'
            className='absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 cursor-pointer hover:bg-muted z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            aria-label='Xóa lựa chọn'
            tabIndex={-1}
          >
            <X className='h-3 w-3' />
          </button>
        )}

        {error && (
          <p className='mt-1 text-xs text-destructive' role='alert'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

ComboboxDepartment.displayName = 'ComboboxDepartment'

export default ComboboxDepartment
