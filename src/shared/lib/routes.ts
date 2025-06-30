const ROUTES = {
  AUTH: {
    LOGIN: '/login'
  },
  HOME: '/',
  STAFF: {
    ROOT: '/staffs',
    CREATE: '/staffs/create',
    EDIT: (id: number | string) => `/staffs/${id}/edit`,
    DETAIL: (id: number | string) => `/staffs/${id}`
  },
  ACCOUNT: {
    ROOT: '/accounts',
    CREATE: '/accounts/create',
    EDIT: '/accounts/:id',
    DETAIL: '/accounts/:id',
    DELETE: '/accounts/:id'
  },
  DEPARTMENT: {
    ROOT: '/departments',
    CREATE: '/departments/create',
    EDIT: '/departments/:id',
    DETAIL: '/departments/:id',
    DELETE: '/departments/:id'
  },
  FACULTY: {
    ROOT: '/faculties',
    CREATE: '/faculties/create',
    EDIT: '/faculties/:id',
    DETAIL: '/faculties/:id',
    DELETE: '/faculties/:id'
  },
  COURSE: {
    ROOT: '/courses',
    CREATE: '/courses/create',
    EDIT: '/courses/:id',
    DETAIL: '/courses/:id',
    DELETE: '/courses/:id'
  },
  SETTINGS: {
    ROOT: '/settings',
    ACADEMIC_YEARS: {
      ROOT: '/settings/academic-years',
      CREATE: '/settings/academic-years/create',
      EDIT: '/settings/academic-years/:id',
      DETAIL: '/settings/academic-years/:id',
      DELETE: '/settings/academic-years/:id'
    },
    CLASSROOMS: '/settings/classrooms',
    BUILDINGS: '/settings/buildings',
    POSITIONS: '/settings/positions',
    BACKUP: '/settings/backup',
    RESTORE: '/settings/restore',
    SECURITY: '/settings/security'
  },
  FACULTIES: {
    ROOT: '/faculties'
  },
  TAX_EXEMPTIONS: {
    ROOT: '/tax-exemptions'
  }
}

export default ROUTES
