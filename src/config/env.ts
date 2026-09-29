import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),

  databaseUrl: process.env.DATABASE_URL || '',

  jwtSecret:
    process.env.JWT_SECRET || 'buildsathi_development_secret',

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || '7d',

  nodeEnv:
    process.env.NODE_ENV || 'development',

  clientUrl:
    process.env.CLIENT_URL || '*',

  resendApiKey:
    process.env.RESEND_API_KEY || '',

  resendFromEmail:
    process.env.RESEND_FROM_EMAIL ||
    'BuildSathi <onboarding@resend.dev>',
};