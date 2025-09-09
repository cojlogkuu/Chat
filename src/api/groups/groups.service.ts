import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Group } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}
  async createGroup(title: string, userId: number): Promise<Group> {
    return this.prisma.group.create({
      data: {
        title: title,
        ownerId: userId,
      },
    });
  }
}
