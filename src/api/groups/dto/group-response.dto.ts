import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: '2025-09-09T18:53:31.698Z' })
  createdAt: Date;

  @ApiProperty({ example: 'Family' })
  title: string;

  @ApiProperty({ example: 1 })
  ownerId: number;
}
