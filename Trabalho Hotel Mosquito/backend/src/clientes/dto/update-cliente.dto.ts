import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @Length(11, 11)
  @IsOptional()
  cpf?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  endereco?: string;
}
