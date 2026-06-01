import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { QuartosModule } from './quartos/quartos.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { ReservasModule } from './reservas/reservas.module';
import { HospedagensModule } from './hospedagens/hospedagens.module';
import { ProdutosServicosModule } from './produtos-servicos/produtos-servicos.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    ClientesModule,
    QuartosModule,
    FuncionariosModule,
    ReservasModule,
    HospedagensModule,
    ProdutosServicosModule,
    RelatoriosModule,
  ],
})
export class AppModule {}
