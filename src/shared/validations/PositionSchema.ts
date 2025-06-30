import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreatePositionSchema = z
  .object({
    name: z.string().min(1, 'Tên chức vụ không được để trống'),
    taxExemptionId: z.number().optional()
  })
  .strict()
  .strip()

export const UpdatePositionSchema = CreatePositionSchema

export const PositionSchema = BaseEntityDTO.extend({
  name: z.string(),
  taxExemption: z
    .object({
      id: z.number(),
      reason: z.string(),
      percentage: z.coerce.number()
    })
    .nullable()
    .default(null)
}).strip()

export const PositionResponseSchema = BaseResponseSchema.extend({
  data: PositionSchema
})

export const PaginationPositionSchema = createPaginationQuerySchema(z.enum(['createdAt', 'name']))

export const PositionQuerySchema = PaginationPositionSchema.extend({
  name: z.string().optional()
})

export const PaginatedPositionSchema = z
  .object({
    items: z.array(PositionSchema),
    meta: MetaPagination
  })
  .strip()

export const PositionsResponseSchema = BaseResponseSchema.extend({
  data: PaginatedPositionSchema
})

export const DeletePositionSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID chức vụ không hợp lệ')
  })
}).strip()

export const RestorePositionSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID chức vụ không hợp lệ')
  })
}).strip()

export type Position = z.infer<typeof PositionSchema>
export type Positions = z.infer<typeof PaginatedPositionSchema>
export type PositionResponse = z.infer<typeof PositionResponseSchema>
export type PositionsResponse = z.infer<typeof PositionsResponseSchema>
export type PaginationPosition = z.infer<typeof PaginationPositionSchema>
export type PaginatedPosition = z.infer<typeof PaginatedPositionSchema>
export type CreatePosition = z.infer<typeof CreatePositionSchema>
export type UpdatePosition = z.infer<typeof UpdatePositionSchema>
export type PositionQuery = z.infer<typeof PositionQuerySchema>
export type DeletePosition = z.infer<typeof DeletePositionSchema>
export type RestorePosition = z.infer<typeof RestorePositionSchema>
