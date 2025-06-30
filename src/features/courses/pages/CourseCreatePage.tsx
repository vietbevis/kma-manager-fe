import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Link } from 'react-router'

const CourseCreatePage = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' asChild>
          <Link to='/courses'>
            <ArrowLeft className='w-4 h-4' />
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Tạo khóa học mới</h1>
          <p className='text-muted-foreground'>Thêm khóa học mới vào hệ thống</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='w-5 h-5' />
            Thông tin khóa học
          </CardTitle>
          <CardDescription>Nhập thông tin để tạo khóa học mới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>Form tạo khóa học đang được phát triển...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseCreatePage
