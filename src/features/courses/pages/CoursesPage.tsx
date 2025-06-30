import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { BookOpen, Plus } from 'lucide-react'
import { Link } from 'react-router'

const CoursesPage = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý khóa học</h1>
          <p className='text-muted-foreground'>Quản lý các khóa học trong hệ thống</p>
        </div>
        <Button asChild>
          <Link to='/courses/create'>
            <Plus className='w-4 h-4 mr-2' />
            Tạo khóa học
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='w-5 h-5' />
            Danh sách khóa học
          </CardTitle>
          <CardDescription>Hiển thị tất cả khóa học trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>Tính năng đang được phát triển...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CoursesPage
