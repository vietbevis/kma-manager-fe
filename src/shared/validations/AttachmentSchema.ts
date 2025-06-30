import { z } from 'zod'
import { BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const AttachmentDTO = z
  .object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number(),
    createdBy: z.object({
      id: z.string(),
      fullName: z.string(),
      avatar: z.string()
    }),
    updatedBy: z.object({
      id: z.string(),
      fullName: z.string(),
      avatar: z.string()
    })
  })
  .strip()

export type AttachmentType = z.infer<typeof AttachmentDTO>

export const UploadAttachmentDTO = z.array(AttachmentDTO)

export const UploadAttachmentResponse = BaseResponseSchema.extend({
  data: UploadAttachmentDTO
})

export type UploadAttachmentResponseType = z.infer<typeof UploadAttachmentResponse>

export const PaginatedAttachmentDTO = z.object({
  items: UploadAttachmentDTO,
  meta: MetaPagination
})

export const PaginateAttachmentDTO = BaseResponseSchema.extend({
  data: PaginatedAttachmentDTO
})

export const ImageUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1).max(10)
})

export const PaginationAttachmentSchema = createPaginationQuerySchema(
  z.enum(['name', 'type', 'createdAt', 'updatedAt'])
)

export const PaginationAttachmentQuerySchema = PaginationAttachmentSchema.extend({
  name: z.string().optional(),
  type: z.string().optional(),
  createdById: z.string().optional()
})

export type GetAttachmentsType = z.infer<typeof PaginationAttachmentQuerySchema>
export type UploadAttachmentDTO = z.infer<typeof UploadAttachmentDTO>
export type PaginateAttachmentResponse = z.infer<typeof PaginateAttachmentDTO>
