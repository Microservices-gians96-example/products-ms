import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  // @Post()
  @MessagePattern({ cmd: 'create_producto' })
  create(@Payload() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_productos' })
  findAll(@Payload() paginationDto: PaginationDto) {

    return this.productosService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_producto' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_producto' })
  update(
    // @Param('id', ParseIntPipe) id: number, 
    // @Body() updateProductoDto: UpdateProductoDto

    @Payload() updateProductoDto: UpdateProductoDto
  ) {
    return this.productosService.update(updateProductoDto.id, updateProductoDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_producto' })
  remove(
    // @Param('id', ParseIntPipe) id: number
    @Payload('id', ParseIntPipe) id: number
  ) {
    return this.productosService.remove(id);
  }
}
