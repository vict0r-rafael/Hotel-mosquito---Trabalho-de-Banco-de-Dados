import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedure, callProcedureFirst } from '../database/database.helper';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll() {
    return callProcedure(this.pool, 'sp_BuscarReserva', [null]);
  }

  async findOne(id: number) {
    const row = await callProcedureFirst(this.pool, 'sp_BuscarReserva', [id]);
    if (!row) throw new NotFoundException(`Reserva ${id} não encontrada`);
    return row;
  }

  async create(dto: CreateReservaDto, idFuncionario: number) {
    return callProcedureFirst(this.pool, 'sp_CriarReserva', [
      dto.id_cliente,
      dto.numero_quarto,
      dto.data_checkin_prev,
      dto.data_checkout_prev,
      idFuncionario,
    ]);
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_AtualizarReserva', [
      id,
      dto.data_checkin_prev ?? null,
      dto.data_checkout_prev ?? null,
      dto.status ?? null,
    ]);
  }

  async remove(id: number) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_DeletarReserva', [id]);
  }
}
