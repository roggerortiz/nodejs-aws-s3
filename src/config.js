import { z } from 'zod'

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().nonnegative())
    .default(3000),
  AWS_BUCKET_NAME: z.string().min(1, 'AWS_BUCKET_NAME is required'),
  AWS_BUCKET_REGION: z.string().min(1, 'AWS_BUCKET_REGION is required'),
  AWS_PUBLIC_KEY: z.string().min(1, 'AWS_PUBLIC_KEY is required'),
  AWS_SECRET_KEY: z.string().min(1, 'AWS_SECRET_KEY is required')
})

const { success, error, data } = envSchema.safeParse(process.env)

if (!success) {
  console.log('❌ Error on enviroment variables', error.format())
  process.exit(1)
}

export const { PORT, AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } = data
