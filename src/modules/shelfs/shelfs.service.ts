import { Injectable, NotFoundException } from '@nestjs/common';
import { FindShelfsRequestDto } from 'src/dto/shelfs';
import client from 'src/db/prismaClient';
import { Shelf } from '@prisma/client';
import { IShelfUpdateError } from '../../interfaces/IShelf';


@Injectable()
export class ShelfsService {
  async findShelfs(
    findShelfsRequestDto: FindShelfsRequestDto,
    userId: string,
  ): Promise<Shelf[]> {
    const filter = Object.entries(findShelfsRequestDto).reduce(
      (filters, [key, value]) => {
        if (value !== undefined && value !== '') {
          filters[key] =
            key === 'stillage'
              ? { id: value }
              : typeof value === 'string'
              ? { contains: value }
              : { gte: new Date(value) };
        }
        return filters;
      },
      {},
    );

    return await client.shelf.findMany({
      where: {
        user: { id: userId },
        ...filter,
      },
    });
  }

  async updateShelfs(id: string, userId: string, opts: any): Promise <Shelf | IShelfUpdateError>{
    opts.stillageId = opts.stillage;
    delete opts.stillage;
    
    try{
      return await client.shelf.update({
        where:{
          id,
          userId
        },
        data: opts,
      })
    }
    catch(error){
      
      // Slice (start_position: ) of the stock error message
      // start_position = beginning of this phrase ("return await client.shelf.update(")
      // (index of this phrase inside the string), because it repeats in each error message,
      // and adding the length of this part,
      // so we need to "slice" a text after "return await client.shelf.update(" part
      const textErrorMessage = error.message.slice(
        error.message.indexOf("return await client.shelf.update(") +
        "return await client.shelf.update(".length
      )
      
      const updateError: IShelfUpdateError = {
        error_message: textErrorMessage,
        //error_status_code: "404"
      }
      
      return updateError;
    }
  }
}