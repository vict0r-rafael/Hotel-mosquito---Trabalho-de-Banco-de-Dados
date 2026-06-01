import { IsString, IsOptional, Length, IsEnum, IsBoolean } from 'class-validator';

export class UpdateFuncionarioDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @Length(11, 11)
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  cargo?: string;

  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @IsOptional()
  senha?: string;

  @IsEnum(['Gerente', 'Recepcionista'])
  @IsOptional()
  perfil?: 'Gerente' | 'Recepcionista';

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
