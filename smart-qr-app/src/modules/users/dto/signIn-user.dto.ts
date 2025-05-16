import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({
    description: 'User email',
    example: 'smartqr2@gmail.com'
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @ApiProperty({
    description: 'User password',
    example: '!Example123'
  })
  password: string;
}
