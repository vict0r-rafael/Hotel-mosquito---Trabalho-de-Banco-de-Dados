import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedure, callProcedureFirst } from '../database/database.helper';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';

@Injectable()
export class QuartosService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll() {
    return callProcedure(this.pool, 'sp_BuscarQuarto', [null]);
  }

  async findOne(numero: number) {
    const row = await callProcedureFirst(this.pool, 'sp_BuscarQuarto', [numero]);
    if (!row) throw new NotFoundException(`Quarto ${numero} não encontrado`);
    return row;
  }

  async create(dto: CreateQuartoDto) {
    return callProcedureFirst(this.pool, 'sp_CriarQuarto', [
      dto.numero,
      dto.andar,
      dto.capacidade,
      dto.status ?? 'disponivel',
      dto.preco_diaria,
      dto.id_categoria,
    ]);
  }

  async update(numero: number, dto: UpdateQuartoDto) {
    await this.findOne(numero);
    return callProcedureFirst(this.pool, 'sp_AtualizarQuarto', [
      numero,
      dto.andar ?? null,
      dto.capacidade ?? null,
      dto.status ?? null,
      dto.preco_diaria ?? null,
      dto.id_categoria ?? null,
    ]);
  }

  async remove(numero: number) {
    await this.findOne(numero);
    return callProcedureFirst(this.pool, 'sp_DeletarQuarto', [numero]);
  }
}
