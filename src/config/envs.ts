import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.coerce.number().min(1, 'PORT is required.'),
    // DB_HOST: z.string(),
    // DB_PORT: z.coerce.number().min(1, 'DB_PORT is required.'),
    // DB_NAME: z.string(),
    // DB_USER: z.string(),
    // DB_PASSWORD: z.string(),
    DATABASE_URL: z.string(),
    ALLOWED_ORIGINS: z.string().transform((val) => val.split(',').map((origin) => origin.trim())),
}).passthrough();

type EnvType = z.infer<typeof envSchema>;
const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
    console.log('Environment Validation Error:', envParsed.error.format());
    throw new Error('Environment Validation Error');
}

export const envs: EnvType = {
    PORT: envParsed.data.PORT,
    ALLOWED_ORIGINS: envParsed.data.ALLOWED_ORIGINS,
    // DB_HOST: envParsed.data.DB_HOST,
    // DB_PORT: envParsed.data.DB_PORT,
    // DB_NAME: envParsed.data.DB_NAME,
    // DB_USER: envParsed.data.DB_USER,
    // DB_PASSWORD: envParsed.data.DB_PASSWORD,
    DATABASE_URL: envParsed.data.DATABASE_URL,
};