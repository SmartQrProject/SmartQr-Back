import { pwMatch } from 'src/common/decorators/passwordMatch';
import { IsBoolean, IsEmail, IsEmpty, IsIn, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Length, Matches, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CompletoCustomerDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString({ message: 'Name must be a string.' })
  @Length(3, 100, {
    message: 'Name must be between 3 and 100 characters.',
  })
  @ApiProperty({
    description: 'Full name of the customer (from Auth0)',
    example: 'Elena Amigo',
  })
  name: string;

  @IsEmail({}, { message: 'Email must be valid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @ApiProperty({
    description: 'Customer email (from Auth0)',
    example: 'elena.amigo@example.com',
  })
  email: string;

  @IsNotEmpty({ message: 'customer authId is required' })
  @ApiProperty({
    description: 'Auth0 UserID, optional',
    example: 'auth0|6824dcf5c10f3f55f3e1f026',
  })
  auth0Id: string;

  @ApiProperty({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    type: String,
    required: false,
  })
  @IsNotEmpty({ message: 'The picture url is mandatory.' })
  @IsUrl()
  picture: string;

  @IsOptional()
  @Transform(({ value }) => String(value))
  @Length(6, 40, {
    message: 'The phone number must be between 6 and 40 characters',
  })
  @Matches(/^\+?[()\-\d\s]{6,40}$/, {
    message: 'Phone number format is invalid. It may include +, digits, spaces, parentheses, and hyphens.',
  })
  @IsString()
  @ApiPropertyOptional({
    description: 'Phone number +countryCode Area Code, Number',
    example: '+54 93487 424050',
  })
  phone?: string;

  @ApiProperty({
    description: 'Indicates whether the customer is active or not',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isActive: boolean;

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
