import { Module } from '@nestjs/common';
import { ProdutosServicosController } from './produtos-servicos.controller';
import { ProdutosServicosService } from './produtos-servicos.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProdutosServicosController],
  providers: [ProdutosServicosService],
})
export class ProdutosServicosModule {}
