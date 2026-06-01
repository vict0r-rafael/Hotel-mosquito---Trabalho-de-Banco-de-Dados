import { Controller, Get, UseGuards } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Gerente')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('faturamento-mensal')
  faturamentoMensal() {
    return this.relatoriosService.faturamentoMensal();
  }

  @Get('top10-quartos')
  top10Quartos() {
    return this.relatoriosService.top10Quartos();
  }

  @Get('top10-clientes')
  top10Clientes() {
    return this.relatoriosService.top10Clientes();
  }

  @Get('taxa-ocupacao')
  taxaOcupacaoMensal() {
    return this.relatoriosService.taxaOcupacaoMensal();
  }

  @Get('historico-reservas')
  historicoReservasClientes() {
    return this.relatoriosService.historicoReservasClientes();
  }
}
