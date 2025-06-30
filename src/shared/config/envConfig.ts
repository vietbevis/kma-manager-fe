import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url('Invalid API URL'),
  VITE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const env = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_ENV: import.meta.env.VITE_ENV
  }

  try {
    return envSchema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join('.'))
      throw new Error(`❌ Invalid environment variables: ${missingVars.join(', ')}\n${error.message}`)
    }
    throw error
  }
}

export default validateEnv()
