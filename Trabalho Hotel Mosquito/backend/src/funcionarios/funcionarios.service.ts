import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedure, callProcedureFirst } from '../database/database.helper';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Injectable()
export class FuncionariosService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll() {
    return callProcedure(this.pool, 'sp_BuscarFuncionario', [null]);
  }

  async findOne(id: number) {
    const row = await callProcedureFirst(this.pool, 'sp_BuscarFuncionario', [id]);
    if (!row) throw new NotFoundException(`Funcionário ${id} não encontrado`);
    return row;
  }

  async create(dto: CreateFuncionarioDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    return callProcedureFirst(this.pool, 'sp_CriarFuncionario', [
      dto.nome,
      dto.cpf,
      dto.cargo,
      dto.login,
      senhaHash,
      dto.perfil,
    ]);
  }

  async update(id: number, dto: UpdateFuncionarioDto) {
    await this.findOne(id);
    const senhaHash = dto.senha ? await bcrypt.hash(dto.senha, 10) : null;
    return callProcedureFirst(this.pool, 'sp_AtualizarFuncionario', [
      id,
      dto.nome ?? null,
      dto.cpf ?? null,
      dto.cargo ?? null,
      dto.login ?? null,
      senhaHash,
      dto.perfil ?? null,
      dto.ativo !== undefined ? (dto.ativo ? 1 : 0) : null,
    ]);
  }

  async remove(id: number) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_DeletarFuncionario', [id]);
  }
}
