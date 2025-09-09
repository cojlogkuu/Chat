import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupDto {
  @ApiProperty({
    description: 'Title of new group',
    example: 'Family',
    minLength: 5,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Group title required' })
  @IsString({ message: 'Group title should be string' })
  @Length(5, 20, {
    message: 'Group title length should be between 5 and 20 characters',
  })
  title: string;
}
