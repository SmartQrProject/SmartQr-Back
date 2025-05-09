import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

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
