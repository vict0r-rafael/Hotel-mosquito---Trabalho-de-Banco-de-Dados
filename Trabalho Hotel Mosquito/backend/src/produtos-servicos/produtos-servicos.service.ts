import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedure, callProcedureFirst } from '../database/database.helper';
import { CreateProdutoServicoDto } from './dto/create-produto-servico.dto';
import { UpdateProdutoServicoDto } from './dto/update-produto-servico.dto';

@Injectable()
export class ProdutosServicosService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll() {
    return callProcedure(this.pool, 'sp_BuscarProdutoServico', [null]);
  }

  async findOne(id: number) {
    const row = await callProcedureFirst(this.pool, 'sp_BuscarProdutoServico', [id]);
    if (!row) throw new NotFoundException(`Produto/Serviço ${id} não encontrado`);
    return row;
  }

  async create(dto: CreateProdutoServicoDto) {
    return callProcedureFirst(this.pool, 'sp_CriarProdutoServico', [
      dto.nome,
      dto.preco_venda,
      dto.tipo,
    ]);
  }

  async update(id: number, dto: UpdateProdutoServicoDto) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_AtualizarProdutoServico', [
      id,
      dto.nome ?? null,
      dto.preco_venda ?? null,
      dto.tipo ?? null,
      dto.ativo !== undefined ? (dto.ativo ? 1 : 0) : null,
    ]);
  }

  async remove(id: number) {
    await this.findOne(id);
    return callProcedureFirst(this.pool, 'sp_DeletarProdutoServico', [id]);
  }
}
