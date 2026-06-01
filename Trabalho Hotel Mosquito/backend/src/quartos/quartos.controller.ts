import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { QuartosService } from './quartos.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quartos')
export class QuartosController {
  constructor(private readonly quartosService: QuartosService) {}

  @Get()
  @Roles('Gerente', 'Recepcionista')
  findAll() {
    return this.quartosService.findAll();
  }

  @Get(':numero')
  @Roles('Gerente', 'Recepcionista')
  findOne(@Param('numero', ParseIntPipe) numero: number) {
    return this.quartosService.findOne(numero);
  }

  @Post()
  @Roles('Gerente')
  create(@Body() dto: CreateQuartoDto) {
    return this.quartosService.create(dto);
  }

  @Put(':numero')
  @Roles('Gerente')
  update(@Param('numero', ParseIntPipe) numero: number, @Body() dto: UpdateQuartoDto) {
    return this.quartosService.update(numero, dto);
  }

  @Delete(':numero')
  @Roles('Gerente')
  remove(@Param('numero', ParseIntPipe) numero: number) {
    return this.quartosService.remove(numero);
  }
}
