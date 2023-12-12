import { Injectable } from '@nestjs/common';
import client from '../../db/prismaClient';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  async findById(id: string): Promise<User> {
    return await client.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await client.user.findFirst({
      where: {
        email,
      },
    });
  }

  async create(opts: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return await client.user.create({
      data: opts,
    });
  }

  async update(id: string, opts: any): Promise<User> {
    return client.user.update({
      where: {
        id,
      },
      data: opts,
    });
  }

  async deleteById(id: string): Promise<User> {
    return await client.user.delete({
      where: {
        id,
      },
    });
  }
}
