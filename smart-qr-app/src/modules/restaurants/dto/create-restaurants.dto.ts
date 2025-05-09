import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateRestaurantsDto {
  @IsNotEmpty({ message: 'El el nombre de la Tienda es obligatorio.' })
  @IsString()
  @ApiProperty({
    description: 'Nombre de la Tienda',
    example: 'Rocio Café',
  })
  name: string;

  @IsNotEmpty({ message: 'El el Slug de la Tienda es obligatorio.' })
  @IsString()
  @ApiProperty({
    description: 'Slug/endpoint de la Tienda',
    example: 'Rocio-cafe',
  })
  slug: string;

  @IsNotEmpty({
    message: 'El el E-mail del dueño de la Tienda es obligatorio.',
  })
  @IsEmail()
  @ApiProperty({
    description: 'E-mail del dueño de la Tienda',
    example: 'rocio@cafe.com',
  })
  owner_email: string;

  @IsNotEmpty({
    message: 'El el E-mail del dueño de la Tienda es obligatorio.',
  })
  @IsString()
  @ApiProperty({
    description: 'Password del dueño de la Tienda',
    example: 'Example123',
  })
  owner_pass: string;
}
