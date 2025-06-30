import LogoutWrapper from '@/features/auth/components/ButtonLogout'
import { Button } from '@/shared/components/ui/button'
import { LogOut } from 'lucide-react'
import Container from '../Container'

const Header = () => {
  return (
    <header className='border-b bg-orange-200/50'>
      <Container>
        <div className='flex h-16 items-center justify-between'>
          {/* Left side - Logo and Banner */}
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <img src='/logo.webp' alt='ACTVN Logo' className='size-12 object-contain' />
              <img src='/dongchu_banner.png' alt='Dongchu Banner' className='h-10 object-contain' />
            </div>
          </div>

          {/* Right side - User Avatar Dropdown */}
          <div className='flex items-center'>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src='' alt='User Avatar' />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>nhân viên</p>
                    <p className='text-xs leading-none text-muted-foreground'>ID: {userId || 'N/A'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>Thông tin cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-red-600 focus:text-red-600' onClick={handleLogout}>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <LogoutWrapper>
              <Button variant='outline' className='w-full'>
                <LogOut className='size-4' />
                Đăng xuất
              </Button>
            </LogoutWrapper>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
