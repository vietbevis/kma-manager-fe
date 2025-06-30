import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className='flex items-center justify-center p-4'>
          <Card className='w-full max-w-lg'>
            <CardHeader className='text-center'>
              <div className='mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4'>
                <AlertTriangle className='w-6 h-6 text-destructive' />
              </div>
              <CardTitle>Đã xảy ra lỗi</CardTitle>
              <CardDescription>Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='p-3 bg-muted rounded-md'>
                  <p className='text-sm font-mono text-muted-foreground'>{this.state.error.message}</p>
                </div>
              )}
              <Button onClick={this.handleRetry} className='w-full'>
                <RefreshCw className='w-4 h-4 mr-2' />
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
