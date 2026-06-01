import { Module } from '@nestjs/common';
import { HospedagensController } from './hospedagens.controller';
import { HospedagensService } from './hospedagens.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [HospedagensController],
  providers: [HospedagensService],
})
export class HospedagensModule {}
