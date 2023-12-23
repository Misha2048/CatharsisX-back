import { Injectable } from '@nestjs/common';
import client from '../../db/prismaClient';
import { Stillage } from '@prisma/client';

@Injectable()
export class StillagesService {

    async updateStillage(id: string, userId: string, opts: any): Promise<Stillage | null | undefined>{
        try{
            return await client.stillage.update({
                where: {
                    id,
                    userId,
                },
                data: opts,
            });
        }
        catch(error){
            return undefined;
        }
    }


}