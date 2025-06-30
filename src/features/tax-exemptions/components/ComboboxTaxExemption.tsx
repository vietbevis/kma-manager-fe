import { Button } from '@/shared/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import type { TaxExemption } from '@/shared/validations/TaxExemptionSchema'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteTaxExemptionQuery } from '../api/TaxExemptionService'

interface ComboboxTaxExemptionProps {
  value?: string
  onValueChange?: (value: string) => void
  onSelect?: (value: TaxExemption | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
}

const ComboboxTaxExemption = forwardRef<HTMLButtonElement, ComboboxTaxExemptionProps>(
  (
    { value, onValueChange, onSelect, placeholder = 'Chọn miễn giảm...', disabled, className, width = '300px', error },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearchValue = useDebounce(searchValue, 300)
    const listRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const [allTaxExemptions, setAllTaxExemptions] = useState<TaxExemption[]>([])

    const {
      data,
      isLoading,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      error: queryError
    } = useInfiniteTaxExemptionQuery({})

    const searchResults = useMemo(() => {
      return data?.pages?.flatMap((page) => page.items) || []
    }, [data])

    useEffect(() => {
      if (searchResults.length > 0) {
        setAllTaxExemptions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id))
          const newTaxExemptions = searchResults.filter((t) => !existingIds.has(t.id))
          return [...prev, ...newTaxExemptions]
        })
      }
    }, [searchResults])

    const selectedTaxExemption = useMemo(() => {
      return allTaxExemptions.find((taxExemption) => taxExemption.id.toString() === value)
    }, [allTaxExemptions, value])

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

    const handleSearchChange = useCallback((value: string) => {
      setSearchValue(value)
    }, [])

    const handleSelect = useCallback(
      (taxExemptionId: string) => {
        onValueChange?.(taxExemptionId)
        setOpen(false)
        setSearchValue('')
        onSelect?.(allTaxExemptions.find((taxExemption) => taxExemption.id.toString() === taxExemptionId) || null)
      },
      [onValueChange, onSelect, allTaxExemptions]
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange?.('')
      },
      [onValueChange]
    )

    const displayText = useMemo(() => {
      if (selectedTaxExemption) {
        return `${selectedTaxExemption.reason} (${selectedTaxExemption.percentage}%)`
      }
      return placeholder
    }, [selectedTaxExemption, placeholder])

    const hasSelection = !!value

    useEffect(() => {
      if (!open) {
        setSearchValue('')
      }
    }, [open])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }, [])

    const renderContent = () => {
      if (isLoading && allTaxExemptions.length === 0) {
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

      if (allTaxExemptions.length === 0 && !isLoading) {
        return (
          <CommandItem disabled>
            {debouncedSearchValue ? 'Không tìm thấy miễn giảm nào' : 'Không có dữ liệu miễn giảm'}
          </CommandItem>
        )
      }

      return (
        <>
          {allTaxExemptions.map((taxExemption) => (
            <CommandItem
              key={taxExemption.id}
              value={taxExemption.id.toString()}
              onSelect={() => handleSelect(taxExemption.id.toString())}
              className='flex cursor-pointer items-center justify-between'
            >
              <div className='flex flex-col'>
                <span className='font-medium'>{taxExemption.reason}</span>
                <span className='text-sm text-muted-foreground'>Miễn giảm: {taxExemption.percentage}%</span>
              </div>
              <Check
                className={cn('ml-2 h-4 w-4', value === taxExemption.id.toString() ? 'opacity-100' : 'opacity-0')}
              />
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
              className={cn(
                'w-full justify-between',
                !hasSelection && 'text-muted-foreground',
                error && 'border-destructive',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              disabled={disabled}
              onKeyDown={handleKeyDown}
            >
              <span className='truncate'>{displayText}</span>
              <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
            <Command shouldFilter={false}>
              <CommandInput
                hidden
                placeholder='Tìm kiếm miễn giảm...'
                value={searchValue}
                onValueChange={handleSearchChange}
              />
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
            aria-label={'Xóa lựa chọn'}
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

ComboboxTaxExemption.displayName = 'ComboboxTaxExemption'

export default ComboboxTaxExemption
