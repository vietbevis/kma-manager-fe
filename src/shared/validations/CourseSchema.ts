import { z } from 'zod'
import { KiHoc } from '../lib/enum'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateCourseSchema = z
  .object({
    courseCode: z.string().min(1, 'Mã học phần không được để trống').max(50, 'Mã học phần không được quá 50 ký tự'),
    courseName: z.string().min(1, 'Tên học phần không được để trống').max(255, 'Tên học phần không được quá 255 ký tự'),
    credits: z.number().min(1, 'Số tín chỉ phải lớn hơn 0').max(10, 'Số tín chỉ không được quá 10'),
    semester: z.nativeEnum(KiHoc, { errorMap: () => ({ message: 'Kỳ học không hợp lệ' }) }),
    description: z.string().optional(),
    facultyId: z.number().min(1, 'ID khoa không hợp lệ'),
    departmentId: z.number().optional()
  })
  .strict()
  .strip()

export const UpdateCourseSchema = CreateCourseSchema.partial()

export const CourseSchema = BaseEntityDTO.extend({
  courseCode: z.string(),
  courseName: z.string(),
  credits: z.coerce.number().min(1, 'Số tín chỉ phải lớn hơn 0'),
  semester: z.nativeEnum(KiHoc),
  description: z.string().nullable(),
  faculty: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable()
    })
    .nullable()
    .default(null),
  department: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable()
    })
    .nullable()
    .default(null)
}).strip()

export const CourseResponseSchema = BaseResponseSchema.extend({
  data: CourseSchema
})

export const PaginationCourseSchema = createPaginationQuerySchema(z.enum(['createdAt', 'courseName', 'courseCode']))

export const CourseQuerySchema = PaginationCourseSchema.extend({
  courseName: z.string().optional(),
  courseCode: z.string().optional(),
  facultyId: z.coerce.number().optional(),
  departmentId: z.coerce.number().optional(),
  semester: z.nativeEnum(KiHoc).optional()
})

export const PaginatedCourseSchema = z
  .object({
    items: z.array(CourseSchema),
    meta: MetaPagination
  })
  .strip()

export const CoursesResponseSchema = BaseResponseSchema.extend({
  data: PaginatedCourseSchema
})

export const DeleteCourseSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID học phần không hợp lệ')
  })
}).strip()

export const RestoreCourseSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID học phần không hợp lệ')
  })
}).strip()

export type Course = z.infer<typeof CourseSchema>
export type Courses = z.infer<typeof PaginatedCourseSchema>
export type CourseResponse = z.infer<typeof CourseResponseSchema>
export type CoursesResponse = z.infer<typeof CoursesResponseSchema>
export type PaginationCourse = z.infer<typeof PaginationCourseSchema>
export type PaginatedCourse = z.infer<typeof PaginatedCourseSchema>
export type CreateCourse = z.infer<typeof CreateCourseSchema>
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>
export type CourseQuery = z.infer<typeof CourseQuerySchema>
