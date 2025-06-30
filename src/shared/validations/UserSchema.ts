import { z } from 'zod'
import { AcademicDegree, Gender } from '../lib/enum'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateUserSchema = z
  .object({
    fullName: z.string().min(1, 'Họ và tên không được để trống').max(255, 'Họ và tên không được quá 255 ký tự'),
    gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Giới tính không hợp lệ' }) }),
    dateOfBirth: z.coerce.date().optional(),
    phone: z.string().max(20, 'Số điện thoại không được quá 20 ký tự').optional(),
    email: z.string().email('Email không hợp lệ').max(255, 'Email không được quá 255 ký tự').optional(),
    address: z.string().optional(),
    citizenId: z.string().max(50, 'Căn cước công dân không được quá 50 ký tự').optional(),
    citizenIdIssueDate: z.coerce.date().optional(),
    citizenIdIssuePlace: z.string().max(255, 'Nơi cấp CCCD không được quá 255 ký tự').optional(),
    citizenIdAddress: z.string().optional(),
    currentAddress: z.string().optional(),
    academicDegree: z.nativeEnum(AcademicDegree).optional(),
    workplace: z.string().max(255, 'Nơi công tác không được quá 255 ký tự').optional(),
    departmentId: z.coerce.number().optional(),
    taxCode: z.string().max(20, 'Mã số thuế không được quá 20 ký tự').optional(),
    bankAccount: z.string().max(50, 'Số tài khoản không được quá 50 ký tự').optional(),
    bankName: z.string().max(255, 'Tên ngân hàng không được quá 255 ký tự').optional(),
    bankBranch: z.string().max(255, 'Chi nhánh không được quá 255 ký tự').optional(),
    salaryCoefficient: z.coerce.number().min(0, 'Hệ số lương phải lớn hơn hoặc bằng 0').optional(),
    salary: z.string().max(50, 'Mức lương không được quá 50 ký tự').optional(),
    profileFile: z.string().max(500, 'Đường dẫn file lý lịch không được quá 500 ký tự').optional(),
    teachingStatus: z.coerce.boolean(),
    facultyId: z.coerce.number(),
    positionId: z.coerce.number().optional(),
    taxExemptionId: z.coerce.number().optional()
  })
  .strict()
  .strip()

export const UpdateUserSchema = CreateUserSchema

export const UserSchema = BaseEntityDTO.extend({
  code: z.string(),
  fullName: z.string(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.coerce.date().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  citizenId: z.string().nullable(),
  citizenIdIssueDate: z.coerce.date().nullable(),
  citizenIdIssuePlace: z.string().nullable(),
  citizenIdAddress: z.string().nullable(),
  currentAddress: z.string().nullable(),
  academicDegree: z.nativeEnum(AcademicDegree).nullable(),
  workplace: z.string().nullable(),
  taxCode: z.string().nullable(),
  bankAccount: z.string().nullable(),
  bankName: z.string().nullable(),
  bankBranch: z.string().nullable(),
  salaryCoefficient: z.coerce.number().nullable(),
  salary: z.string().nullable(),
  profileFile: z.string().nullable(),
  teachingStatus: z.boolean(),
  username: z.string().nullable().default(''),
  faculty: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      isFaculty: z.coerce.boolean()
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
    .default(null),
  position: z
    .object({
      id: z.number(),
      name: z.string(),
      taxExemption: z
        .object({
          id: z.number(),
          reason: z.string(),
          percentage: z.coerce.number()
        })
        .nullable()
        .default(null)
    })
    .nullable()
    .default(null),
  taxExemption: z
    .object({
      id: z.number(),
      reason: z.string(),
      percentage: z.coerce.number()
    })
    .nullable()
    .default(null)
}).strip()

export const UserResponseSchema = BaseResponseSchema.extend({
  data: UserSchema
})

export const PaginationUserSchema = createPaginationQuerySchema(
  z.enum(['createdAt', 'fullName', 'code', 'dateOfBirth'])
)

export const UserQuerySchema = PaginationUserSchema.extend({
  fullName: z.string().optional(),
  code: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  academicDegree: z.nativeEnum(AcademicDegree).optional(),
  facultyId: z.coerce.number().optional(),
  departmentId: z.coerce.number().optional(),
  positionId: z.coerce.number().optional(),
  teachingStatus: z.enum(['true', 'false']).optional(),
  haveAccount: z.enum(['true', 'false']).optional()
})

export const PaginatedUserSchema = z
  .object({
    items: z.array(UserSchema),
    meta: MetaPagination
  })
  .strip()

export const UsersResponseSchema = BaseResponseSchema.extend({
  data: PaginatedUserSchema
})

export const DeleteUserSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID nhân viên không hợp lệ')
  })
}).strip()

export const RestoreUserSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID nhân viên không hợp lệ')
  })
}).strip()

export type User = z.infer<typeof UserSchema>
export type Users = z.infer<typeof PaginatedUserSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type UsersResponse = z.infer<typeof UsersResponseSchema>
export type PaginationUser = z.infer<typeof PaginationUserSchema>
export type PaginatedUser = z.infer<typeof PaginatedUserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserQuery = z.infer<typeof UserQuerySchema>
