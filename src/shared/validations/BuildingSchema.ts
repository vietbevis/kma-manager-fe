import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateBuildingSchema = z
  .object({
    name: z.string().min(1, 'Tên tòa nhà không được để trống'),
    description: z.string().optional()
  })
  .strict()
  .strip()

export const UpdateBuildingSchema = CreateBuildingSchema

export const BuildingSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string().nullable().optional()
}).strip()

export const BuildingResponseSchema = BaseResponseSchema.extend({
  data: BuildingSchema
})

export const PaginationBuildingSchema = createPaginationQuerySchema(z.enum(['createdAt', 'name']))

export const BuildingQuerySchema = PaginationBuildingSchema.extend({
  name: z.string().optional()
})

export const PaginatedBuildingsSchema = z
  .object({
    items: z.array(BuildingSchema),
    meta: MetaPagination
  })
  .strip()

export const BuildingsResponseSchema = BaseResponseSchema.extend({
  data: PaginatedBuildingsSchema
})

export const DeleteBuildingSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID tòa nhà không hợp lệ')
  })
}).strip()

export type Building = z.infer<typeof BuildingSchema>
export type Buildings = z.infer<typeof PaginatedBuildingsSchema>
export type BuildingResponse = z.infer<typeof BuildingResponseSchema>
export type BuildingsResponse = z.infer<typeof BuildingsResponseSchema>
export type PaginationBuilding = z.infer<typeof PaginationBuildingSchema>
export type PaginatedBuildings = z.infer<typeof PaginatedBuildingsSchema>
export type CreateBuildingSchemaType = z.infer<typeof CreateBuildingSchema>
export type UpdateBuildingSchemaType = z.infer<typeof UpdateBuildingSchema>
export type BuildingQuery = z.infer<typeof BuildingQuerySchema>
export type DeleteBuilding = z.infer<typeof DeleteBuildingSchema>
