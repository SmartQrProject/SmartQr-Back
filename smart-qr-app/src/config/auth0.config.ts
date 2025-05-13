import {
  AUTH0_BASEURL,
  AUTH0_CLIENTID,
  AUTH0_ISSUER_URL,
  AUTH0_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_SECRET,
} from './env.loader';

export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_BASEURL,
  clientSecret: AUTH0_CLIENT_SECRET,
  clientID: AUTH0_CLIENTID,
  issuerBaseURL: AUTH0_ISSUER_URL,
  authorizationParams: {
    response_type: 'code', // Asegura que el flujo de autorización incluya el código para obtener el token
    scope: 'openid profile email offline_access', // Incluye los permisos necesarios
  },
  //   audience: AUTH0_AUDIENCE,
};
