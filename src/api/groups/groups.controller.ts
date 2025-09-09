import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtPayload } from '../../common/decorators/jwt-payload.decorator';
import { JWTPayloadType } from '../../common/types/auth.types';
import { GroupDto } from './dto/group.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupResponseDto } from './dto/group-response.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'group is created',
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'wrong data',
  })
  async createGroup(@JwtPayload() user: JWTPayloadType, @Body() dto: GroupDto) {
    return this.groupsService.createGroup(dto.title, user.sub);
  }
}
