import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from '@/shared/components/ui/menubar'
import ROUTES from '@/shared/lib/routes'
import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Calendar,
  CircleUserRound,
  DatabaseBackup,
  GraduationCap,
  Home,
  PoundSterling,
  School,
  Settings,
  Users,
  Vote
} from 'lucide-react'
import { Link } from 'react-router'
import Container from '../Container'

interface SubMenuItemData {
  href: string
  label: string
}

type MenuItemData =
  | {
      href: string
      label: string
      icon?: LucideIcon
      submenu?: never
    }
  | {
      href?: never
      label: string
      icon?: LucideIcon
      submenu: {
        items: SubMenuItemData[]
        separatorIndexes?: number[]
      }
    }

interface MenuData {
  icon: LucideIcon
  title: string
  href?: string
  items: MenuItemData[]
  separatorIndexes?: number[]
}

const menuData: MenuData[] = [
  {
    icon: Home,
    title: 'Trang chủ',
    href: ROUTES.HOME,
    items: []
  },
  {
    icon: CircleUserRound,
    title: 'Tài khoản',
    href: ROUTES.ACCOUNT.ROOT,
    items: []
  },
  {
    icon: Users,
    title: 'Nhân viên',
    href: ROUTES.STAFF.ROOT,
    items: []
  },
  {
    icon: Building2,
    title: 'Phòng ban',
    href: ROUTES.FACULTY.ROOT,
    items: []
  },
  {
    icon: School,
    title: 'Bộ môn',
    href: ROUTES.DEPARTMENT.ROOT,
    items: []
  },
  {
    icon: Settings,
    title: 'Cài đặt hệ thống',
    items: [
      { icon: Calendar, href: ROUTES.SETTINGS.ACADEMIC_YEARS.ROOT, label: 'Năm học' },
      { icon: GraduationCap, href: ROUTES.SETTINGS.CLASSROOMS, label: 'Phòng học' },
      { icon: Building2, href: ROUTES.SETTINGS.BUILDINGS, label: 'Tòa nhà' },
      { icon: Vote, href: ROUTES.SETTINGS.POSITIONS, label: 'Chức vụ' },
      { icon: PoundSterling, href: ROUTES.TAX_EXEMPTIONS.ROOT, label: 'Miễn giảm' },
      {
        icon: DatabaseBackup,
        label: 'Sao lưu & Bảo mật',
        submenu: {
          items: [
            { href: ROUTES.SETTINGS.BACKUP, label: 'Sao lưu dữ liệu' },
            { href: ROUTES.SETTINGS.RESTORE, label: 'Khôi phục dữ liệu' },
            { href: ROUTES.SETTINGS.SECURITY, label: 'Bảo mật' }
          ]
        }
      }
    ]
  }
]

const renderMenuItem = (item: MenuItemData, itemIndex: number) => {
  if (item.submenu) {
    return (
      <MenubarSub key={itemIndex}>
        <MenubarSubTrigger className='flex items-center justify-between'>
          <span className='flex items-center gap-2'>
            {item.icon && <item.icon className='h-4 w-4' />}
            {item.label}
          </span>
        </MenubarSubTrigger>
        <MenubarSubContent>
          {item.submenu.items.map((subItem, subIndex) => (
            <div key={subIndex}>
              <MenubarItem asChild>
                <Link to={subItem.href}>{subItem.label}</Link>
              </MenubarItem>
              {item.submenu?.separatorIndexes?.includes(subIndex) && <MenubarSeparator />}
            </div>
          ))}
        </MenubarSubContent>
      </MenubarSub>
    )
  }

  return (
    <MenubarItem key={itemIndex} asChild>
      <Link to={item.href} className='flex items-center gap-2'>
        {item.icon && <item.icon className='h-4 w-4' />}
        {item.label}
      </Link>
    </MenubarItem>
  )
}

const MainMenubar = () => {
  return (
    <div className='border-b bg-background sticky top-0 z-10 shadow-sm'>
      <Container>
        <Menubar className='border-0 bg-transparent'>
          {menuData.map((menu, menuIndex) => (
            <MenubarMenu key={menuIndex}>
              {menu.href ? (
                <MenubarTrigger asChild>
                  <Link to={menu.href} className='flex items-center gap-2'>
                    <menu.icon className='h-4 w-4' />
                    {menu.title}
                  </Link>
                </MenubarTrigger>
              ) : (
                <MenubarTrigger className='flex items-center gap-2'>
                  <menu.icon className='h-4 w-4' />
                  {menu.title}
                </MenubarTrigger>
              )}

              {!menu.href && (
                <MenubarContent>
                  {menu.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {renderMenuItem(item, itemIndex)}
                      {menu.separatorIndexes?.includes(itemIndex) && <MenubarSeparator />}
                    </div>
                  ))}
                </MenubarContent>
              )}
            </MenubarMenu>
          ))}
        </Menubar>
      </Container>
    </div>
  )
}

export default MainMenubar
