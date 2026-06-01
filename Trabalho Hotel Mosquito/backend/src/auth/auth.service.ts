import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { DATABASE_POOL } from '../database/database.constants';
import { callProcedureFirst } from '../database/database.helper';
import { LoginDto } from './dto/login.dto';

interface FuncionarioRow extends RowDataPacket {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  login: string;
  senha_hash: string;
  perfil: 'Gerente' | 'Recepcionista';
  ativo: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const funcionario = await callProcedureFirst<FuncionarioRow>(
      this.pool,
      'sp_Login',
      [dto.login],
    );

    if (!funcionario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.senha, funcionario.senha_hash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: funcionario.id,
      login: funcionario.login,
      perfil: funcionario.perfil,
    };

    return {
      access_token: this.jwtService.sign(payload),
      funcionario: {
        id: funcionario.id,
        nome: funcionario.nome,
        cargo: funcionario.cargo,
        perfil: funcionario.perfil,
      },
    };
  }
}
