import { IsInt, IsPositive, Min } from 'class-validator';

export class ConsumoDto {
  @IsInt()
  @IsPositive()
  id_produto_servico: number;

  @IsInt()
  @Min(1)
  quantidade: number;
}
