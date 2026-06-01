import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.constants';

@Injectable()
export class RelatoriosService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async faturamentoMensal() {
    const [rows] = await this.pool.query('SELECT * FROM vw_faturamento_mensal');
    return rows;
  }

  async top10Quartos() {
    const [rows] = await this.pool.query('SELECT * FROM vw_top10_quartos');
    return rows;
  }

  async top10Clientes() {
    const [rows] = await this.pool.query('SELECT * FROM vw_top10_clientes');
    return rows;
  }

  async taxaOcupacaoMensal() {
    const [rows] = await this.pool.query('SELECT * FROM vw_taxa_ocupacao_mensal');
    return rows;
  }

  async historicoReservasClientes() {
    const [rows] = await this.pool.query('SELECT * FROM vw_historico_reservas_clientes');
    return rows;
  }
}
