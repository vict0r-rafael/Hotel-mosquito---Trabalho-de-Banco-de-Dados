import {
  Controller, Get, Post,
  Param, Body, ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { HospedagensService } from './hospedagens.service';
import { CheckInDto } from './dto/checkin.dto';
import { ConsumoDto } from './dto/consumo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hospedagens')
export class HospedagensController {
  constructor(private readonly hospedagensService: HospedagensService) {}

  @Get()
  @Roles('Gerente', 'Recepcionista')
  findAll() {
    return this.hospedagensService.findAll();
  }

  @Post('checkin')
  @Roles('Gerente', 'Recepcionista')
  checkIn(@Body() dto: CheckInDto, @Request() req: any) {
    return this.hospedagensService.checkIn(dto, req.user.sub);
  }

  @Post(':id/checkout')
  @Roles('Gerente', 'Recepcionista')
  checkOut(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.hospedagensService.checkOut(id, req.user.sub);
  }

  @Get(':id/consumos')
  @Roles('Gerente', 'Recepcionista')
  getConsumos(@Param('id', ParseIntPipe) id: number) {
    return this.hospedagensService.getConsumos(id);
  }

  @Post(':id/consumos')
  @Roles('Gerente', 'Recepcionista')
  registrarConsumo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConsumoDto,
    @Request() req: any,
  ) {
    return this.hospedagensService.registrarConsumo(id, dto);
  }
}
