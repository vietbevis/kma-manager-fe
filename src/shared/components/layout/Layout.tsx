import type { ReactNode } from 'react'
import CommonAlertDialog from '../CommonAlertDialog'
import Container from '../Container'
import ErrorBoundary from '../ErrorBoundary'
import Header from './Header'
import MainMenubar from './MainMenubar'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <MainMenubar />
      <main className='flex-1'>
        <ErrorBoundary>
          <Container className='pb-4 pt-6'>
            {children}
            <CommonAlertDialog />
          </Container>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default Layout
