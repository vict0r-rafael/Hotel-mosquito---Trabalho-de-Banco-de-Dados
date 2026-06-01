import { IsNumber, IsPositive, IsEnum, IsOptional } from 'class-validator';

export type StatusQuarto = 'disponivel' | 'ocupado' | 'manutencao' | 'reservado';

export class CreateQuartoDto {
  @IsNumber()
  @IsPositive()
  numero: number;

  @IsNumber()
  @IsPositive()
  andar: number;

  @IsNumber()
  @IsPositive()
  capacidade: number;

  @IsEnum(['disponivel', 'ocupado', 'manutencao', 'reservado'])
  @IsOptional()
  status?: StatusQuarto;

  @IsNumber()
  @IsPositive()
  preco_diaria: number;

  @IsNumber()
  @IsPositive()
  id_categoria: number;
}
