import { IsString, IsNotEmpty, IsNumber, IsPositive, IsEnum } from 'class-validator';

export class CreateProdutoServicoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  preco_venda: number;

  @IsEnum(['produto', 'servico'])
  tipo: 'produto' | 'servico';
}
