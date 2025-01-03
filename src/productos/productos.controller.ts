import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  // @Post()
  @MessagePattern({cmd: 'create', type: 'productos'})
  create(@Body() createProductoDto: CreateProductoDto) {
    // return createProductoDto
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {

    return this.productosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    // return { id, updateProductoDto }
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
