import { IsNumber, IsPositive, IsEnum, IsOptional } from 'class-validator';

type StatusQuarto = 'disponivel' | 'ocupado' | 'manutencao' | 'reservado';

export class UpdateQuartoDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  andar?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  capacidade?: number;

  @IsEnum(['disponivel', 'ocupado', 'manutencao', 'reservado'])
  @IsOptional()
  status?: StatusQuarto;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  preco_diaria?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  id_categoria?: number;
}
