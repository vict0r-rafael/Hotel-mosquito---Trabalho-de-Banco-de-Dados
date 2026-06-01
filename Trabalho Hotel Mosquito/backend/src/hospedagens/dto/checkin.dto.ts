import { IsInt, IsPositive } from 'class-validator';

export class CheckInDto {
  @IsInt()
  @IsPositive()
  id_reserva: number;
}
