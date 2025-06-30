import ROUTES from '@/shared/lib/routes'
import { Navigate } from 'react-router'
import LoginForm from '../components/LoginForm'
import useAuthStore from '../stores/authStore'

const LoginPage = () => {
  const { isAuth } = useAuthStore()

  if (isAuth) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex items-center gap-3'>
            <img src='/logo.webp' alt='ACTVN Logo' className='h-16 w-16 object-contain' />
            <img src='/dongchu_banner.png' alt='Dongchu Banner' className='h-12 object-contain' />
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
