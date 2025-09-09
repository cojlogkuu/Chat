import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsInt({ message: 'receiverId must be an integer' })
  @Min(1, { message: 'receiverId must be a positive number' })
  receiverId: number;
}
