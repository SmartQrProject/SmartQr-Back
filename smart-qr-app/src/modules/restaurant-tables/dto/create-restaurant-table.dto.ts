import { pwMatch } from 'src/common/decorators/passwordMatch';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantTableDto {
  @IsNotEmpty()
  @IsString({
    message:
      'The Table-Code is mandatory and  must have between 5 and 100 characteres',
  })
  @Length(1, 50, {
    message:
      'The Table-Code is mandatory and  must have between 5 and 100 characteres',
  })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'This field only permits letters and numbers and spaces.',
  })
  @ApiProperty({
    description: 'The Table-Code must have between 5 and 100 characteres',
    example: 'T001',
  })
  code: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'Indicates if the Table is temporarilly available to be used. True or False.',
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  is_active: boolean;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Indicates if the Table should be blocked. True or False.',
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  exist: boolean;
}
