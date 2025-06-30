import { z, ZodEnum } from 'zod'

export const BaseResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string()
  })
  .strip()

export const MetaPagination = z
  .object({
    currentPage: z.number(),
    limit: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
    sortBy: z.array(z.string()),
    sortDirection: z.array(z.string())
  })
  .strip()

export const BaseEntityDTO = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const NameSchema = z
  .string({ message: 'Tên không được để trống' })
  .trim()
  .nonempty()
  .min(3, { message: 'Tên phải có ít nhất 3 ký tự.' })
  .max(20, { message: 'Tên không được vượt quá 20 ký tự.' })

export const EmailSchema = z.string({ message: 'Email không được để trống' }).email({
  message: 'Email không hợp lệ.'
})

export const phoneNumberSchema = z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
  message: 'Số điện thoại không hợp lệ (chỉ hỗ trợ số điện thoại Việt Nam).'
})

export const UrlSchema = z.union([z.string().url(), z.string().length(0)]).default('')

export const PasswordSchema = z
  .string({ message: 'Mật khẩu không được để trống' })
  .trim()
  .min(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự.'
  })
  .max(20, { message: 'Mật khẩu có tối đa 20 ký tự.' })
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,20}$/, {
    message:
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.'
  })

export const createPaginationQuerySchema = <T extends string>(sortByEnum: ZodEnum<[T, ...T[]]>) =>
  z
    .object({
      page: z
        .string()
        .default('1')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: 'Page phải là số dương'
        })
        .transform((val) => Number(val)),
      limit: z
        .string()
        .default('9')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: 'Limit phải là số dương'
        })
        .transform((val) => Number(val)),
      sortBy: sortByEnum.optional(),
      sortDirection: z.enum(['asc', 'desc']).optional()
    })
    .strict()
    .strip()

export const SlugParamsSchema = z
  .object({
    slug: z.string().default('')
  })
  .strict()
  .strip()

export type SlugParamsType = z.infer<typeof SlugParamsSchema>

export const IdParamsSchema = z
  .object({
    id: z.string().uuid({ message: 'Id không hợp lệ (UUID)' }).trim().nonempty()
  })
  .strict()
  .strip()

export type IdParamsType = z.infer<typeof IdParamsSchema>

export const NameParamsSchema = z
  .object({
    name: z.string().trim().nonempty()
  })
  .strict()
  .strip()
