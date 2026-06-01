import { Module } from '@nestjs/common';
import { QuartosService } from './quartos.service';
import { QuartosController } from './quartos.controller';

@Module({
  providers: [QuartosService],
  controllers: [QuartosController],
})
export class QuartosModule {}
