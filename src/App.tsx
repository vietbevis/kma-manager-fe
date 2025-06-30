import { AuthGuard } from '@/features/auth'
import '@/index.css'
import ErrorBoundary from '@/shared/components/ErrorBoundary'
import Layout from '@/shared/components/layout/Layout'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { ReactQueryProvider } from '@/shared/components/ReactQuery'
import { Toaster } from '@/shared/components/ui/sonner'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ROUTES from './shared/lib/routes'

// Lazy load pages from features
const DashboardPage = lazy(() => import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })))
const LoginPage = lazy(() => import('@/features/auth').then((m) => ({ default: m.LoginPage })))
const UsersPage = lazy(() => import('@/features/users').then((m) => ({ default: m.UsersPage })))
const UserCreatePage = lazy(() => import('@/features/users').then((m) => ({ default: m.UserCreatePage })))
const UserEditPage = lazy(() => import('@/features/users').then((m) => ({ default: m.UserEditPage })))
const CoursesPage = lazy(() => import('@/features/courses').then((m) => ({ default: m.CoursesPage })))
const CourseCreatePage = lazy(() => import('@/features/courses').then((m) => ({ default: m.CourseCreatePage })))
const AccountsPage = lazy(() => import('@/features/accounts').then((m) => ({ default: m.AccountsPage })))
const AcademicYearsPage = lazy(() =>
  import('@/features/academic-years').then((m) => ({ default: m.AcademicYearsPage }))
)
const FacultiesPage = lazy(() => import('@/features/faculties').then((m) => ({ default: m.FacultiesPage })))
const TaxExemptionsPage = lazy(() =>
  import('@/features/tax-exemptions').then((m) => ({ default: m.TaxExemptionsPage }))
)
const PositionsPage = lazy(() => import('@/features/positions').then((m) => ({ default: m.PositionsPage })))
const DepartmentsPage = lazy(() => import('@/features/departments').then((m) => ({ default: m.DepartmentsPage })))
const BuildingsPage = lazy(() => import('@/features/buildings').then((m) => ({ default: m.BuildingsPage })))
const ClassroomsPage = lazy(() => import('@/features/classrooms').then((m) => ({ default: m.ClassroomsPage })))

// Keep some shared pages
const SettingsPage = lazy(() => import('@/shared/pages/SettingsPage'))
const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'))

// Loading wrapper component
const PageLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner isLoading={true} />}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </Suspense>
)

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>
    <Layout>
      <PageLoader>{children}</PageLoader>
    </Layout>
  </AuthGuard>
)

// Auth route wrapper (for login page)
const AuthRoute = ({ children }: { children: React.ReactNode }) => <PageLoader>{children}</PageLoader>

const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    )
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.ACCOUNT.ROOT,
    element: (
      <ProtectedRoute>
        <AccountsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.STAFF.ROOT,
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.STAFF.CREATE,
    element: (
      <ProtectedRoute>
        <UserCreatePage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.STAFF.EDIT(':id'),
    element: (
      <ProtectedRoute>
        <UserEditPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.COURSE.ROOT,
    element: (
      <ProtectedRoute>
        <CoursesPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.COURSE.CREATE,
    element: (
      <ProtectedRoute>
        <CourseCreatePage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.SETTINGS.ROOT,
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.SETTINGS.ACADEMIC_YEARS.ROOT,
    element: (
      <ProtectedRoute>
        <AcademicYearsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.FACULTIES.ROOT,
    element: (
      <ProtectedRoute>
        <FacultiesPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.TAX_EXEMPTIONS.ROOT,
    element: (
      <ProtectedRoute>
        <TaxExemptionsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.SETTINGS.POSITIONS,
    element: (
      <ProtectedRoute>
        <PositionsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.DEPARTMENT.ROOT,
    element: (
      <ProtectedRoute>
        <DepartmentsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.SETTINGS.BUILDINGS,
    element: (
      <ProtectedRoute>
        <BuildingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.SETTINGS.CLASSROOMS,
    element: (
      <ProtectedRoute>
        <ClassroomsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: (
      <AuthRoute>
        <NotFoundPage />
      </AuthRoute>
    )
  }
])

function App() {
  return (
    <ReactQueryProvider>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors theme='light' />
    </ReactQueryProvider>
  )
}

export default App
