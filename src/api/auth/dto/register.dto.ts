import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsStrong } from '../../../common/decorators/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    minLength: 2,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(2, 20, { message: 'First name must be between 2 and 20 characters' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user (optional)',
    example: 'Doe',
    minLength: 2,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 20, { message: 'Last name must be between 2 and 20 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description:
      'Password of the user. Must be strong (contain uppercase, lowercase, number, special char)',
    example: 'StrongP@ssw0rd!',
    minLength: 2,
    maxLength: 20,
  })
  @IsString({ message: 'Password must be a string' })
  @Length(2, 20, { message: 'Password must be between 2 and 20 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrong()
  password: string;
}
