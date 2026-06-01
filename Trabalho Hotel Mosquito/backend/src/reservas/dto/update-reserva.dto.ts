import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class UpdateReservaDto {
  @IsDateString()
  @IsOptional()
  data_checkin_prev?: string;

  @IsDateString()
  @IsOptional()
  data_checkout_prev?: string;

  @IsEnum(['pendente', 'confirmada', 'checkin_realizado', 'cancelada', 'concluida'])
  @IsOptional()
  status?: 'pendente' | 'confirmada' | 'checkin_realizado' | 'cancelada' | 'concluida';
}
