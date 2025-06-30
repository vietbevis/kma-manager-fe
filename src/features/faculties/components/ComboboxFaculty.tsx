import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import type { FacultySchemaType } from '@/shared/validations/FacultySchema'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteFacultyQuery } from '../api/FacultyService'

interface ComboboxFacultyProps {
  // Single select props
  value?: string
  onValueChange?: (value: string) => void

  // Multi select props
  values?: string[]
  onValuesChange?: (values: string[]) => void

  // Common props
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  multiple?: boolean
  maxSelection?: number
  showSelectionCount?: boolean
  isFaculty?: boolean
  error?: string
}

const ComboboxFaculty = forwardRef<HTMLButtonElement, ComboboxFacultyProps>(
  (
    {
      value,
      onValueChange,
      values = [],
      onValuesChange,
      placeholder = 'Chọn khoa/phòng ban...',
      disabled = false,
      className,
      width = '250px',
      multiple = false,
      maxSelection,
      showSelectionCount = false,
      isFaculty = false,
      error
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearchValue = useDebounce(searchValue, 300)
    const listRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)

    // Lưu trữ tất cả dữ liệu đã tải từ API
    const [allFaculties, setAllFaculties] = useState<FacultySchemaType[]>([])

    const {
      data,
      isLoading,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      error: queryError,
      refetch
    } = useInfiniteFacultyQuery({
      name: debouncedSearchValue,
      isFaculty: isFaculty ? 'true' : undefined
    })

    // Tổng hợp dữ liệu từ tất cả các trang
    const searchResults = useMemo(() => {
      return data?.pages?.flatMap((page) => page.items) || []
    }, [data])

    // Cập nhật danh sách faculties khi có dữ liệu mới
    useEffect(() => {
      if (searchResults.length > 0) {
        setAllFaculties((prev) => {
          const existingIds = new Set(prev.map((f) => f.id))
          const newFaculties = searchResults.filter((f) => !existingIds.has(f.id))
          return [...prev, ...newFaculties]
        })
      }
    }, [searchResults])

    // Lấy các item đã được chọn
    const selectedItems = useMemo(() => {
      if (multiple) {
        return allFaculties.filter((faculty) => values.includes(faculty.id.toString()))
      }
      return allFaculties.filter((faculty) => faculty.id.toString() === value)
    }, [allFaculties, multiple, values, value])

    // Xử lý scroll để load thêm dữ liệu
    const handleScroll = useCallback(async () => {
      if (!listRef.current || !hasNextPage || isFetchingNextPage || isLoading || isScrolling) return

      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      const scrollThreshold = 100

      if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
        setIsScrolling(true)
        try {
          await fetchNextPage()
        } finally {
          setTimeout(() => setIsScrolling(false), 500)
        }
      }
    }, [hasNextPage, isFetchingNextPage, isLoading, isScrolling, fetchNextPage])

    // Xử lý thay đổi giá trị tìm kiếm
    const handleSearchChange = useCallback((value: string) => {
      setSearchValue(value)
    }, [])

    // Xử lý chọn item
    const handleSelect = useCallback(
      (facultyId: string) => {
        if (multiple) {
          const currentValues = values || []
          const isSelected = currentValues.includes(facultyId)

          if (isSelected) {
            // Bỏ chọn
            const newValues = currentValues.filter((id) => id !== facultyId)
            onValuesChange?.(newValues)
          } else {
            // Chọn mới (kiểm tra giới hạn)
            if (!maxSelection || currentValues.length < maxSelection) {
              const newValues = [...currentValues, facultyId]
              onValuesChange?.(newValues)
            }
          }
        } else {
          // Single select - luôn cập nhật giá trị mới
          const newValue = value === facultyId ? '' : facultyId
          onValueChange?.(newValue)
          setOpen(false)
          setSearchValue('')
        }
      },
      [multiple, values, onValuesChange, maxSelection, onValueChange, value]
    )

    // Xử lý xóa tất cả lựa chọn
    const handleClearAll = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault() // Ngăn form submit nếu button nằm trong form

        if (multiple) {
          onValuesChange?.([])
        } else {
          onValueChange?.('')
        }
      },
      [multiple, onValuesChange, onValueChange]
    )

    // Kiểm tra item có được chọn không
    const isSelected = useCallback(
      (facultyId: string) => {
        if (multiple) {
          return values.includes(facultyId)
        }
        return value === facultyId
      },
      [multiple, values, value]
    )

    // Text hiển thị trên button
    const displayText = useMemo(() => {
      if (multiple) {
        if (selectedItems.length === 0) {
          return placeholder
        }
        if (selectedItems.length === 1) {
          return selectedItems[0].name
        }
        if (showSelectionCount) {
          return `Đã chọn ${selectedItems.length} khoa${isFaculty ? '' : '/phòng ban'}`
        }
        return `${selectedItems[0].name} và ${selectedItems.length - 1} khác`
      }

      const selectedItem = selectedItems[0]
      return selectedItem ? selectedItem.name : placeholder
    }, [multiple, selectedItems, showSelectionCount, placeholder, isFaculty])

    // Kiểm tra có selection không
    const hasSelection = multiple ? values.length > 0 : !!value

    // Reset search khi đóng popover
    useEffect(() => {
      if (!open) {
        setSearchValue('')
      }
    }, [open])

    // Xử lý phím tắt
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }, [])

    // Focus vào input khi mở popover
    useEffect(() => {
      if (open) {
        const input = document.querySelector('[cmdk-input]') as HTMLInputElement
        if (input) {
          setTimeout(() => {
            input.focus()
          }, 100) // Tăng delay để đảm bảo DOM đã render
        }
      }
    }, [open])

    // Xử lý retry khi có lỗi
    const handleRetry = useCallback(() => {
      refetch()
    }, [refetch])

    // Render nội dung danh sách
    const renderContent = () => {
      // Loading state
      if (isLoading && searchResults.length === 0) {
        return (
          <div className='py-8 text-center'>
            <Loader2 className='mx-auto h-5 w-5 animate-spin text-muted-foreground' />
            <p className='mt-2 text-sm text-muted-foreground'>Đang tải dữ liệu...</p>
          </div>
        )
      }

      // Error state
      if (queryError) {
        return (
          <div className='py-8 text-center'>
            <p className='text-sm text-destructive'>Có lỗi xảy ra khi tải dữ liệu</p>
            <Button variant='ghost' size='sm' className='mt-2 h-8 text-xs' onClick={handleRetry}>
              Thử lại
            </Button>
          </div>
        )
      }

      // Empty state
      if (searchResults.length === 0) {
        return (
          <div className='py-8 text-center text-sm text-muted-foreground'>
            {debouncedSearchValue
              ? `Không tìm thấy khoa${isFaculty ? '' : '/phòng ban'} "${debouncedSearchValue}"`
              : 'Không có dữ liệu'}
          </div>
        )
      }

      // Render danh sách
      return (
        <CommandGroup>
          {searchResults.map((faculty: FacultySchemaType) => {
            const selected = isSelected(faculty.id.toString())
            const isMaxReached = multiple && maxSelection && values.length >= maxSelection && !selected

            return (
              <CommandItem
                key={faculty.id}
                value={faculty.id.toString()}
                onSelect={() => {
                  if (!isMaxReached) {
                    handleSelect(faculty.id.toString())
                  }
                }}
                className={cn(
                  'cursor-pointer',
                  isMaxReached && 'opacity-50 cursor-not-allowed',
                  selected && 'bg-accent'
                )}
                disabled={!!isMaxReached}
              >
                <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', selected ? 'opacity-100' : 'opacity-0')} />
                <span className='flex-1 truncate' title={faculty.name}>
                  {faculty.name}
                </span>
                {isMaxReached && (
                  <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>
      )
    }

    return (
      <div className={cn('relative w-full', className)}>
        <Popover open={open} onOpenChange={setOpen} modal={false}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant='outline'
              role='combobox'
              aria-expanded={open}
              aria-haspopup='listbox'
              aria-label={multiple ? 'Chọn nhiều khoa/phòng ban' : 'Chọn khoa/phòng ban'}
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
              {multiple && selectedItems.length > 0 ? (
                <>
                  {selectedItems.slice(0, 3).map((faculty) => (
                    <Badge
                      key={faculty.id}
                      variant='outline'
                      className='truncate text-xs max-w-[120px] h-6'
                      title={faculty.name}
                    >
                      <span className='truncate'>{faculty.name}</span>
                    </Badge>
                  ))}
                  {selectedItems.length > 3 && (
                    <Badge variant='secondary' className='text-xs h-6'>
                      +{selectedItems.length - 3}
                    </Badge>
                  )}
                </>
              ) : (
                <span className='truncate'>{displayText}</span>
              )}
              <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>

          <PopoverContent className='p-0 w-[var(--radix-popover-trigger-width)]' align='start' sideOffset={4}>
            <Command shouldFilter={false} className='w-full'>
              <CommandInput
                placeholder={`Tìm kiếm khoa${isFaculty ? '' : '/phòng ban'}...`}
                value={searchValue}
                onValueChange={handleSearchChange}
                className='h-9'
              />

              {multiple && (
                <div className='px-3 py-2 text-xs text-muted-foreground bg-muted/50 border-b flex items-center justify-between'>
                  <span>
                    Đã chọn: {values.length}
                    {maxSelection && ` / ${maxSelection}`}
                  </span>
                  {values.length > 0 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive'
                      onClick={(e) => {
                        e.stopPropagation()
                        onValuesChange?.([])
                      }}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>
              )}

              <CommandList className='max-h-[200px] overflow-y-auto' ref={listRef} onScroll={handleScroll}>
                {renderContent()}

                {isFetchingNextPage && (
                  <div className='py-3 text-center border-t'>
                    <Loader2 className='mx-auto h-4 w-4 animate-spin text-muted-foreground' />
                    <p className='mt-1 text-xs text-muted-foreground'>Đang tải thêm...</p>
                  </div>
                )}

                {!hasNextPage && searchResults.length > 0 && (
                  <div className='py-2 text-center text-xs text-muted-foreground border-t'>
                    {searchResults.length === 1
                      ? `Đã hiển thị 1 khoa${isFaculty ? '' : '/phòng ban'}`
                      : `Đã hiển thị tất cả ${searchResults.length} khoa${isFaculty ? '' : '/phòng ban'}`}
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Clear button - chỉ hiển thị khi có selection */}
        {hasSelection && !disabled && (
          <button
            type='button'
            className='absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 cursor-pointer hover:bg-muted z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            onClick={handleClearAll}
            onMouseDown={(e) => e.preventDefault()} // Ngăn focus loss khi click
            aria-label={multiple ? 'Xóa tất cả lựa chọn' : 'Xóa lựa chọn'}
            tabIndex={-1}
          >
            <X className='h-3 w-3' />
          </button>
        )}

        {/* Error message */}
        {error && (
          <p className='mt-1 text-xs text-destructive' role='alert'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

ComboboxFaculty.displayName = 'ComboboxFaculty'

export default ComboboxFaculty
