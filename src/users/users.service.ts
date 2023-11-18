import { Injectable } from '@nestjs/common';
import client from './../prismaClient'
import IUser from './../interfaces/IUser'

@Injectable()
export class UsersService {
    async findById(id: string): Promise<IUser> {
        return await client.user.findFirst({
            where: {
                id
            }
        })
    }

    async create(opts: {
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    }): Promise<IUser> {
        return await client.user.create({
            data: opts
        })
    }

    async deleteById(id: string): Promise<IUser> {
        return await client.user.delete({
            where: {
                id
            }
        })
    }
}
