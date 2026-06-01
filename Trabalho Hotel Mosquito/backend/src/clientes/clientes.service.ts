import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedure, callProcedureFirst } from '../database/database.helper';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll() {
    return callProcedure(this.pool, 'sp_BuscarCliente', [null]);
  }

  async findOne(id: number) {
    const row = await callProcedureFirst(this.pool, 'sp_BuscarCliente', [id]);
    if (!row) throw new NotFoundException(`Cliente ${id} não encontrado`);
    return row;
  }

  async create(dto: CreateClienteDto) {
    const row = await callProcedureFirst<{ id: number }>(
      this.pool,
      'sp_CriarCliente',
      [dto.nome, dto.cpf, dto.email, dto.telefone, dto.endereco ?? null],
    );
    return row;
  }

  async update(id: number, dto: UpdateClienteDto) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_AtualizarCliente', [
      id,
      dto.nome ?? null,
      dto.cpf ?? null,
      dto.email ?? null,
      dto.telefone ?? null,
      dto.endereco ?? null,
    ]);
  }

  async remove(id: number) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_DeletarCliente', [id]);
  }
}
