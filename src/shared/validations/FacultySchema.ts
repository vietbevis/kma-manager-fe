import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateFacultySchema = z
  .object({
    name: z.string().min(1, 'Tên khoa không được để trống'),
    facultyCode: z.string().min(1, 'Mã khoa không được để trống'),
    isFaculty: z.boolean(),
    description: z.string(),
    headOfFacultyId: z.number().optional()
  })
  .strict()
  .strip()

export const UpdateFacultySchema = z
  .object({
    name: z.string().min(1, 'Tên khoa không được để trống'),
    facultyCode: z.string().min(1, 'Mã khoa không được để trống'),
    isFaculty: z.boolean(),
    description: z.string(),
    headOfFacultyId: z.number().optional()
  })
  .strict()
  .strip()

export const FacultySchema = BaseEntityDTO.extend({
  name: z.string().min(1, 'Tên khoa không được để trống'),
  facultyCode: z.string().min(1, 'Mã khoa không được để trống'),
  isFaculty: z.boolean(),
  description: z.string(),
  headOfFaculty: z
    .object({
      id: z.number(),
      fullName: z.string().min(1, 'Tên khoa không được để trống')
    })
    .nullable()
    .default(null)
}).strip()

export const FacultyResponseSchema = BaseResponseSchema.extend({
  data: FacultySchema
}).strip()

export const PaginationFacultySchema = createPaginationQuerySchema(z.enum(['name', 'facultyCode']))

export const GetFacultiesSchema = PaginationFacultySchema.extend({
  name: z.string().optional(),
  facultyCode: z.string().optional(),
  isFaculty: z.enum(['true', 'false']).optional()
})

export const FacultiesSchema = z.array(FacultySchema)

export const PaginatedFacultiesSchema = z.object({
  items: FacultiesSchema,
  meta: MetaPagination
})

export const FacultiesResponseSchema = BaseResponseSchema.extend({
  data: PaginatedFacultiesSchema
}).strip()

export const MergeFacultySchema = z.object({
  mergeFacultyIds: z.array(z.number()).min(2, 'Phải có ít nhất 2 khoa để gộp'),
  newFacultyName: z.string().min(1, 'Tên khoa mới không được để trống'),
  newFacultyCode: z.string().min(1, 'Mã khoa mới không được để trống'),
  newFacultyDescription: z.string(),
  newFacultyHeadOfFacultyId: z.number().optional()
})

export type GetFacultiesSchemaType = z.infer<typeof GetFacultiesSchema>
export type FacultyResponseSchemaType = z.infer<typeof FacultyResponseSchema>
export type FacultySchemaType = z.infer<typeof FacultySchema>
export type CreateFacultySchemaType = z.infer<typeof CreateFacultySchema>
export type UpdateFacultySchemaType = z.infer<typeof UpdateFacultySchema>
export type MergeFacultySchemaType = z.infer<typeof MergeFacultySchema>
export type FacultiesResponseSchemaType = z.infer<typeof FacultiesResponseSchema>
export type FacultiesSchemaType = z.infer<typeof FacultiesSchema>
export type PaginatedFacultiesSchemaType = z.infer<typeof PaginatedFacultiesSchema>
