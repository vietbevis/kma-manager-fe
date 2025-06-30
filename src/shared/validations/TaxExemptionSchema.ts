import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateTaxExemptionSchema = z
  .object({
    reason: z.string().min(1, 'Lý do miễn giảm không được để trống'),
    percentage: z
      .number()
      .min(0, 'Phần trăm miễn giảm không được nhỏ hơn 0')
      .max(100, 'Phần trăm miễn giảm không được lớn hơn 100')
  })
  .strict()
  .strip()

export const UpdateTaxExemptionSchema = CreateTaxExemptionSchema

export const TaxExemptionSchema = BaseEntityDTO.extend({
  reason: z.string(),
  percentage: z.coerce.number()
}).strip()

export const TaxExemptionResponseSchema = BaseResponseSchema.extend({
  data: TaxExemptionSchema
})

export const PaginationTaxExemptionSchema = createPaginationQuerySchema(z.enum(['createdAt', 'percentage']))

export const TaxExemptionQuerySchema = PaginationTaxExemptionSchema

export const PaginatedTaxExemptionSchema = z
  .object({
    items: z.array(TaxExemptionSchema),
    meta: MetaPagination
  })
  .strip()

export const TaxExemptionsResponseSchema = BaseResponseSchema.extend({
  data: PaginatedTaxExemptionSchema
})

export const DeleteTaxExemptionSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID miễn giảm không hợp lệ')
  })
}).strip()

export const RestoreTaxExemptionSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID miễn giảm không hợp lệ')
  })
}).strip()

export type TaxExemption = z.infer<typeof TaxExemptionSchema>
export type TaxExemptions = z.infer<typeof PaginatedTaxExemptionSchema>
export type TaxExemptionResponse = z.infer<typeof TaxExemptionResponseSchema>
export type TaxExemptionsResponse = z.infer<typeof TaxExemptionsResponseSchema>
export type PaginationTaxExemption = z.infer<typeof PaginationTaxExemptionSchema>
export type PaginatedTaxExemption = z.infer<typeof PaginatedTaxExemptionSchema>
export type CreateTaxExemption = z.infer<typeof CreateTaxExemptionSchema>
export type UpdateTaxExemption = z.infer<typeof UpdateTaxExemptionSchema>
export type TaxExemptionQuery = z.infer<typeof TaxExemptionQuerySchema>
export type DeleteTaxExemption = z.infer<typeof DeleteTaxExemptionSchema>
export type RestoreTaxExemption = z.infer<typeof RestoreTaxExemptionSchema>
