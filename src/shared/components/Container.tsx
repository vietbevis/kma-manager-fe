import React from 'react'

interface ContainerOwnProps {
  children?: React.ReactNode
  className?: string
}

const Container: React.FC<ContainerOwnProps> = ({ className = '', children }) => {
  return <div className={`container-fluid max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export default Container
