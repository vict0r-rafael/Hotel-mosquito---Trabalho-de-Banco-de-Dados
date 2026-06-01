import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get()
  @Roles('Gerente', 'Recepcionista')
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  @Roles('Gerente', 'Recepcionista')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  @Post()
  @Roles('Gerente', 'Recepcionista')
  create(@Body() dto: CreateReservaDto, @Request() req: any) {
    return this.reservasService.create(dto, req.user.sub);
  }

  @Put(':id')
  @Roles('Gerente', 'Recepcionista')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservaDto) {
    return this.reservasService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Gerente')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.remove(id);
  }
}
