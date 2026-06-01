import { IsString, IsNotEmpty, Length, IsEnum } from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  cargo: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsEnum(['Gerente', 'Recepcionista'])
  perfil: 'Gerente' | 'Recepcionista';
}
