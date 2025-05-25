import { pwMatch } from 'src/common/decorators/passwordMatch';
import { Role } from 'src/common/decorators/role.enum';
import { IsBoolean, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteUserDto {
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

  @IsNotEmpty({
    message: 'The role should have these options only: superAdmin, owner, staff.',
  })
  @ApiProperty({
    description: 'It should be superAdmin or owner or staff',
    example: 'staff',
  })
  @IsIn(['staff', 'owner', 'superAdmin'], {
    message: 'The role should be: staff, owner o superAdmin only!',
  })
  role: string;

  @IsString({
    message: 'The phone must be a characters field.',
  })
  @Length(5, 20)
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

  @IsBoolean({
    message: 'To simulate a hard deletion based on a logic des-activation',
  })
  @ApiProperty({
    description: 'Simulate deletion of a user. True or False.',
    example: 'false',
  })
  exists: boolean;
}
