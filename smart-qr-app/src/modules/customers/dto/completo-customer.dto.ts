import { pwMatch } from 'src/common/decorators/passwordMatch';
import { IsBoolean, IsEmail, IsEmpty, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Length, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompletoCustomerDto {
  @IsEmail({}, { message: 'The email must have a valid format.' })
  @IsNotEmpty({ message: 'The email is mandatory.' })
  @ApiProperty({
    description: 'The email must have a valid format',
    example: 'amigoe@example.com',
  })
  email: string;

  @IsNumber()
  @ApiProperty({
    description: 'The phone # is mandatory and  must have only numbers',
    example: '3487424050',
  })
  phone: BigInteger;

  @ApiProperty({
    description: 'Indicates whether the customer is active or not',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  exist: boolean;

  @IsString({
    message: 'The name is mandatory and  must have between 5 and 100 characteres',
  })
  @Length(5, 100, {
    message: 'LThe name is mandatory and  must have between 5 and 100 characteres',
  })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'THis field only permits letters and numbers and spaces.',
  })
  @ApiProperty({
    description: 'The name must have between 5 and 100 characteres',
    example: 'Elena Amigo',
  })
  name: string;

  @ApiProperty({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  picture?: string;

  @IsString({ message: 'The password must be a characters field .' })
  @IsNotEmpty({ message: 'The password could not blank.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message: 'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
  })
  @ApiProperty({
    description: 'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
    example: 'Clave123%%',
  })
  password: string;

  @IsString({ message: 'The password must be a characters field .' })
  @pwMatch('password', { message: 'Passwords do not match' })
  @ApiProperty({
    description: 'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
    example: 'Clave123%%',
  })
  confirmPassword: string;

  @IsOptional()
  @ApiProperty({
    description: 'Auth0 UserID, optional',
    example: 'auth0|6824dcf5c10f3f55f3e1f026',
  })
  auth0Id: string;

  @ApiProperty({ description: 'RewardID', example: 0, type: Number })
  @IsInt()
  @Min(0) // Acepta 0 como mínimo
  reward: number;

  @IsNotEmpty({
    message: 'The restaurant ID is optional. It is an UUID',
  })
  @ApiProperty({
    description: 'The restaurant ID is optional. It is an UUID',
    example: '5722abf1-f895-4f94-86d7-264580caca5b',
  })
  restaurantId: string;
}
