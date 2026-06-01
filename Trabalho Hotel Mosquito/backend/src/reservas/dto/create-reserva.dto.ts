import { IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreateReservaDto {
  @IsNumber()
  @IsPositive()
  id_cliente: number;

  @IsNumber()
  @IsPositive()
  numero_quarto: number;

  @IsDateString()
  data_checkin_prev: string;

  @IsDateString()
  data_checkout_prev: string;
}
