import { IsString, IsNotEmpty, Length, IsEmail, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsString()
  @IsOptional()
  endereco?: string;
}
