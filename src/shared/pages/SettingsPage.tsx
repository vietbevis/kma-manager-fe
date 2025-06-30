import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Database, Shield, User } from 'lucide-react'

const Settings = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Cài đặt</h1>
        <p className='text-muted-foreground'>Quản lý cài đặt hệ thống và tài khoản</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='w-5 h-5' />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-center py-4'>
              <p className='text-muted-foreground text-sm'>Tính năng đang được phát triển...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='w-5 h-5' />
              Bảo mật
            </CardTitle>
            <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-center py-4'>
              <p className='text-muted-foreground text-sm'>Tính năng đang được phát triển...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Database className='w-5 h-5' />
              Hệ thống
            </CardTitle>
            <CardDescription>Cài đặt chung của hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-center py-4'>
              <p className='text-muted-foreground text-sm'>Tính năng đang được phát triển...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
