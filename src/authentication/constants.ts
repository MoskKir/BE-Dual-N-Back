import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default-secret-key',
};

export const googleConstants = {
  clientId: process.env.GOOGLE_CLIENT_ID || 'add-google-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'add-google-client-secret',
  callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'add-google-callback-url',
};
