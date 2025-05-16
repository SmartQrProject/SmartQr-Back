import { pwMatch } from 'src/common/decorators/passwordMatch';
import {
  IsEmail,
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantTableDto {
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
}

//   @IsEmail({}, { message: 'The email must have a valid format.' })
//   @IsNotEmpty({ message: 'The email is mandatory.' })
//   @ApiProperty({
//     description: 'The email must have a valid format',
//     example: 'amigop@example.com',
//   })
//   email: string;

//   @IsString({ message: 'The password must be a characters field .' })
//   @IsNotEmpty({ message: 'The password could not blank.' })
//   @Matches(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
//     {
//       message:
//         'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
//     },
//   )
//   @ApiProperty({
//     description:
//       'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
//     example: 'Clave123%%',
//   })
//   password: string;

//   @IsString({ message: 'The password must be a characters field .' })
//   @pwMatch('password', { message: 'Passwords do not match' })
//   @ApiProperty({
//     description:
//       'It should have between 8 and 15 characteres, having at least one lowercase, one uppercase, one number and one special character (!@#$%^&*).',
//     example: 'Clave123%%',
//   })
//   confirmPassword: string;

//   @IsNotEmpty({
//     message:
//       'The role should have these options only: superAdmin, restOwner, restStaff.',
//   })
//   @ApiProperty({
//     description: 'It should be superadmin or restadmin or reststaff',
//     example: 'restStaff',
//   })
//   @IsIn(['restStaff', 'restOwner', 'superAdmin'], {
//     message: 'The role should be: restStaff, restOwner o superAdmin only!',
//   })
//   role: string;
// }

// =====================================================

//   @Column({ default: true })
//   @IsBoolean()
//   is_active: boolean;

//   @Column({ default: true })
//   exist: boolean;

//   @CreateDateColumn()
//   created_at: Date;

//   @OneToMany(() => Order, (order) => order.table)
//   orders: Order[];

//   @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, {
//     onDelete: 'CASCADE',
//   })
//   restaurant: Restaurant;
// }
