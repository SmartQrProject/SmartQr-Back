import { pwMatch } from 'src/common/decorators/passwordMatch';
import { Role } from 'src/common/decorators/role.enum';
import { IsBoolean, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CompleteUserDto {
  @IsNotEmpty({ message: 'Staff name is required' })
  @IsString({
    message: 'The name is mandatory and  must have between 5 and 50 characteres',
  })
  @Length(5, 50, {
    message: 'LThe name is mandatory and  must have between 5 and 50 characteres',
  })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'THis field only permits letters and numbers and spaces.',
  })
  @ApiProperty({
    description: 'Full name of the restaurant owner (5 to 50 characters)',
    example: 'John Smith',
    minLength: 5,
    maxLength: 50,
  })
  name: string;

  @IsEmail({}, { message: 'The email must have a valid format.' })
  @Length(5, 100, { message: 'Owner email must be between 5 and 100 characters' })
  @IsNotEmpty({ message: 'The email is mandatory.' })
  @ApiProperty({
    description: 'Restaurant owner email',
    example: 'smartqr2@gmail.com',
  })
  email: string;

  @IsString({ message: 'The password must be a characters field .' })
  @IsNotEmpty({ message: 'The password could not blank.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, {
    message: 'Password must be 8–15 characters and include uppercase, lowercase, number, and special character (@$!%*?&)',
  })
  @ApiProperty({
    description: 'Restaurant owner password (8–15 characters, must include uppercase, lowercase, number, and a special character)',
    example: '!Example123',
    minLength: 8,
    maxLength: 15,
  })
  password: string;

  @IsString({ message: 'The confirm password must be a characters field .' })
  @IsNotEmpty({ message: 'The password could not blank.' })
  @pwMatch('password', { message: 'Passwords do not match' })
  @ApiProperty({
    description: 'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
    example: '!Example123',
  })
  confirmPassword: string;

  // @IsNotEmpty({
  //   message: 'The role should have these options only: superAdmin, owner, staff.',
  // })
  // @ApiProperty({
  //   description: 'It should be superAdmin or owner or staff',
  //   example: 'staff',
  // })
  // @IsIn(['staff', 'owner', 'superAdmin'], {
  //   message: 'The role should be: staff, owner o superAdmin only!',
  // })
  // role: string;/////////////////////////////////////////////

  @IsOptional()
  @Transform(({ value }) => String(value))
  @Length(6, 40, {
    message: 'The phone number must be between 6 and 40 characters',
  })
  @IsString()
  @Matches(/^\+?[()\-\d\s]{6,40}$/, {
    message: 'Phone number format is invalid. It may include +, digits, spaces, parentheses, and hyphens.',
  })
  @ApiPropertyOptional({
    description: 'Phone number +countryCode Area Code, Number',
    example: '+54 93487 424050',
  })
  phone?: string;

  @IsNotEmpty({
    message: 'De-activation of a user.',
  })
  @ApiProperty({
    description: 'De-activation of a user. True or False.',
    example: 'true',
  })
  @IsBoolean({
    message: 'To unactivate/activate users',
  })
  is_active: boolean;
}
