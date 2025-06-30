import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void
  className?: string
  hasMore?: boolean
  isLoading?: boolean
}

const InfiniteScrollContainer = ({
  children,
  onBottomReached,
  className,
  hasMore,
  isLoading
}: InfiniteScrollContainerProps) => {
  const { ref, inView } = useInView({
    rootMargin: '200px',
    triggerOnce: false
  })

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      onBottomReached()
    }
  }, [inView, isLoading, hasMore, onBottomReached])

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  )
}

export default InfiniteScrollContainer
