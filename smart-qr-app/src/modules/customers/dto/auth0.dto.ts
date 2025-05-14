import { IsString } from 'class-validator';

export class Auth0Dto {
  @IsString()
  auth0Id: string;
}
