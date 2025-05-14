import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Auth0CustomerDto {
  @IsString({
    message:
      'The name is mandatory and  must have between 5 and 100 characteres',
  })
  @Length(5, 100, {
    message:
      'LThe name is mandatory and  must have between 5 and 100 characteres',
  })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'THis field only permits letters and numbers and spaces.',
  })
  @ApiProperty({
    description: 'The name must have between 5 and 100 characteres',
    example: 'Pablo Amigo',
  })
  name: string;

  @IsEmail({}, { message: 'The email must have a valid format.' })
  @IsNotEmpty({ message: 'The email is mandatory.' })
  @ApiProperty({
    description: 'The email must have a valid format',
    example: 'amigop@example.com',
  })
  email: string;

  @IsNotEmpty({ message: 'The auth0Id is mandatory.' })
  @ApiProperty({
    description:
      'The Auth0 ID shouldhave this format google-oauth2|111957317329254676094 or auth0|682117d3be12873aaf887384',
    example: 'google-oauth2|111957317329254676094',
  })
  @ApiProperty()
  auth0Id: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The url with the picture taken from Auth0',
    example:
      'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747194140/logo2_jzvw9b.png',
  })
  picture: string;
}
