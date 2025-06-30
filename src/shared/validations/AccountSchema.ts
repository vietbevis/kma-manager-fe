import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateAccountSchema = z
  .object({
    userId: z.coerce.number().min(1, 'ID nhân viên không hợp lệ'),
    username: z.string().min(1, 'Tên đăng nhập không được để trống').max(100, 'Tên đăng nhập không được quá 100 ký tự'),
    password: z.string().min(1, 'Mật khẩu phải có ít nhất 1 ký tự').max(20, 'Mật khẩu không được quá 20 ký tự'),
    role: z.string().min(1, 'Vai trò không được để trống')
  })
  .strict()
  .strip()

export const UpdateAccountSchema = z
  .object({
    role: z.string().min(1, 'Vai trò không được để trống').optional(),
    newPassword: z
      .string()
      .min(1, 'Mật khẩu mới phải có ít nhất 1 ký tự')
      .max(20, 'Mật khẩu mới không được quá 20 ký tự')
      .optional()
  })
  .strict()
  .strip()

export const AccountSchema = BaseEntityDTO.extend({
  username: z.string(),
  role: z.string(),
  user: z.object({
    id: z.number(),
    code: z.string(),
    fullName: z.string(),
    faculty: z
      .object({
        id: z.number(),
        name: z.string(),
        isFaculty: z.coerce.boolean()
      })
      .nullable()
      .default(null),
    department: z
      .object({
        id: z.number(),
        name: z.string()
      })
      .nullable()
      .default(null)
  })
}).strip()

export const AccountResponseSchema = BaseResponseSchema.extend({
  data: AccountSchema
})

export const PaginationAccountSchema = createPaginationQuerySchema(
  z.enum(['createdAt', 'updatedAt', 'username', 'role'])
)
export const AccountQuerySchema = PaginationAccountSchema.extend({
  fullName: z.string().optional(),
  username: z.string().optional()
})

export const PaginatedAccountSchema = z.object({
  items: z.array(AccountSchema),
  meta: MetaPagination
})

export const AccountsResponseSchema = BaseResponseSchema.extend({
  data: PaginatedAccountSchema
})

export const DeleteAccountSchema = BaseResponseSchema.extend({
  data: z.object({
    userId: z.number().min(1, 'ID nhân viên không hợp lệ')
  })
}).strip()

export const RestoreAccountSchema = BaseResponseSchema.extend({
  data: z.object({
    userId: z.number().min(1, 'ID nhân viên không hợp lệ')
  })
}).strip()

export type Account = z.infer<typeof AccountSchema>
export type AccountResponse = z.infer<typeof AccountResponseSchema>
export type AccountsResponse = z.infer<typeof AccountsResponseSchema>
export type CreateAccount = z.infer<typeof CreateAccountSchema>
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>
export type AccountQuery = z.infer<typeof AccountQuerySchema>
export type PaginatedAccount = z.infer<typeof PaginatedAccountSchema>
export type DeleteAccount = z.infer<typeof DeleteAccountSchema>
export type RestoreAccount = z.infer<typeof RestoreAccountSchema>
