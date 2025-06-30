import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateDepartmentSchema = z
  .object({
    name: z.string().min(1, 'Tên bộ môn không được để trống'),
    departmentCode: z.string().min(1, 'Mã bộ môn không được để trống'),
    description: z.string(),
    headOfDepartmentId: z.number().optional(),
    facultyId: z.number({ message: 'Bộ môn phải thuộc về 1 khoa nào đó' }).min(1, 'Bộ môn phải thuộc về 1 khoa nào đó')
  })
  .strict()
  .strip()

export const UpdateDepartmentSchema = CreateDepartmentSchema

export const DepartmentSchema = BaseEntityDTO.extend({
  name: z.string().min(1, 'Tên bộ môn không được để trống'),
  departmentCode: z.string().min(1, 'Mã bộ môn không được để trống'),
  description: z.string(),
  headOfDepartment: z
    .object({
      id: z.number(),
      fullName: z.string().min(1, 'Tên trưởng bộ môn không được để trống')
    })
    .nullable()
    .default(null),
  faculty: z.object({
    id: z.number(),
    name: z.string().min(1, 'Tên khoa không được để trống'),
    facultyCode: z.string().min(1, 'Mã khoa không được để trống')
  })
}).strip()

export const DepartmentResponseSchema = BaseResponseSchema.extend({
  data: DepartmentSchema
}).strip()

export const PaginationDepartmentSchema = createPaginationQuerySchema(z.enum(['name', 'departmentCode', 'facultyId']))

export const GetDepartmentsSchema = PaginationDepartmentSchema.extend({
  name: z.string().optional(),
  departmentCode: z.string().optional(),
  facultyId: z.coerce.number().optional()
})

export const DepartmentsSchema = z.array(DepartmentSchema)

export const PaginatedDepartmentsSchema = z.object({
  items: DepartmentsSchema,
  meta: MetaPagination
})

export const DepartmentsResponseSchema = BaseResponseSchema.extend({
  data: PaginatedDepartmentsSchema
}).strip()

export type GetDepartmentsSchemaType = z.infer<typeof GetDepartmentsSchema>
export type DepartmentResponseSchemaType = z.infer<typeof DepartmentResponseSchema>
export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>
export type CreateDepartmentSchemaType = z.infer<typeof CreateDepartmentSchema>
export type UpdateDepartmentSchemaType = z.infer<typeof UpdateDepartmentSchema>
export type DepartmentsResponseSchemaType = z.infer<typeof DepartmentsResponseSchema>
export type DepartmentsSchemaType = z.infer<typeof DepartmentsSchema>
export type PaginatedDepartmentsSchemaType = z.infer<typeof PaginatedDepartmentsSchema>
