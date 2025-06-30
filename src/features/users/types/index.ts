import type { AcademicDegree, Gender } from '@/shared/lib/enum'

export interface UserFilters {
  fullName?: string
  code?: string
  gender?: Gender
  academicDegree?: AcademicDegree
  facultyId?: number
  departmentId?: number
  positionId?: number
  teachingStatus?: boolean
}
