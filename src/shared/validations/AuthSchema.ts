import z from 'zod'
import { BaseResponseSchema } from './CommonSchema'

export const LoginSchema = z
  .object({
    username: z.string().trim().min(1, 'Tên đăng nhập không được để trống'),
    password: z.string().trim()
  })
  .strict()
  .strip()

export type LoginBodyType = z.infer<typeof LoginSchema>

export const LogoutSchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()
  .strip()

export type LogoutBodyType = z.infer<typeof LogoutSchema>

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()
  .strip()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenSchema>

export const LoginResponseSchema = BaseResponseSchema.extend({
  data: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string()
    })
    .strip()
}).strip()

export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RefreshTokenResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
})

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>
