import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ProdutosServicosService } from './produtos-servicos.service';
import { CreateProdutoServicoDto } from './dto/create-produto-servico.dto';
import { UpdateProdutoServicoDto } from './dto/update-produto-servico.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('produtos-servicos')
export class ProdutosServicosController {
  constructor(private readonly produtosServicosService: ProdutosServicosService) {}

  @Get()
  @Roles('Gerente', 'Recepcionista')
  findAll() {
    return this.produtosServicosService.findAll();
  }

  @Get(':id')
  @Roles('Gerente', 'Recepcionista')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtosServicosService.findOne(id);
  }

  @Post()
  @Roles('Gerente')
  create(@Body() dto: CreateProdutoServicoDto) {
    return this.produtosServicosService.create(dto);
  }

  @Put(':id')
  @Roles('Gerente')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoServicoDto) {
    return this.produtosServicosService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Gerente')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtosServicosService.remove(id);
  }
}
