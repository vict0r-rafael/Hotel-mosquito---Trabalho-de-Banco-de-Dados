import { IsString, IsOptional, IsNumber, IsPositive, IsEnum, IsBoolean } from 'class-validator';

export class UpdateProdutoServicoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  preco_venda?: number;

  @IsOptional()
  @IsEnum(['produto', 'servico'])
  tipo?: 'produto' | 'servico';

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
