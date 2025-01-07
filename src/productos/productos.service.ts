import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductosService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductosService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to database');
  }

  create(createProductoDto: CreateProductoDto) {
    return this.producto.create({
      data: createProductoDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPage = await this.producto.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPage / limit);
    return {
      data: await this.producto.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        }
      }),
      meta: {
        total: totalPage,
        page: page,
        lastPage: lastPage
      }
    }
  }

  async findOne(id: number) {
    const producto = await this.producto.findUnique({
      where: {
        id: id,
        available: true,
      },
    });
    if (!producto) {
      throw new RpcException({
        message: `producto ${id} not found`,
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    return producto
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {

    const { id: _, ...data } = updateProductoDto;
    await this.findOne(id)

    return this.producto.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id)

    //SOFT DELETE
    return await this.producto.update({
      where: {
        id,
      },
      data: {
        available: false
      }
    });

    //HARD DELETE
    // return this.producto.delete({
    //   where: {
    //     id,
    //   },
    // });
  }
}
