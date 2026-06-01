import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedure, callProcedureFirst } from '../database/database.helper';
import { CheckInDto } from './dto/checkin.dto';
import { ConsumoDto } from './dto/consumo.dto';

@Injectable()
export class HospedagensService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll() {
    const [rows] = await this.pool.query('SELECT * FROM vw_ocupacao_atual');
    return rows;
  }

  async checkIn(dto: CheckInDto, idFuncionario: number) {
    return callProcedureFirst(this.pool, 'sp_RealizarCheckIn', [
      dto.id_reserva,
      idFuncionario,
    ]);
  }

  async checkOut(idHospedagem: number, idFuncionario: number) {
    const result = await callProcedureFirst(this.pool, 'sp_RealizarCheckOut', [
      idHospedagem,
      idFuncionario,
    ]);
    if (!result) throw new NotFoundException(`Hospedagem ${idHospedagem} não encontrada`);
    return result;
  }

  async getConsumos(idHospedagem: number) {
    return callProcedure(this.pool, 'sp_BuscarConsumos', [idHospedagem]);
  }

  async registrarConsumo(idHospedagem: number, dto: ConsumoDto) {
    return callProcedureFirst(this.pool, 'sp_RegistrarConsumo', [
      idHospedagem,
      dto.id_produto_servico,
      dto.quantidade,
    ]);
  }
}
