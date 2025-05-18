import { config as dotenvConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenvConfig({ path: '.env.development' });
}

export const DB_NAME = process.env.DB_NAME;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT || '5432');
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || '10');

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || '1h';

export const AUTH0_SECRET = process.env.AUTH0_SECRET;
export const AUTH0_BASEURL = process.env.AUTH0_BASEURL;
export const AUTH0_CLIENTID = process.env.AUTH0_CLIENTID;
export const AUTH0_ISSUER_URL = process.env.AUTH0_ISSUER_URL;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
