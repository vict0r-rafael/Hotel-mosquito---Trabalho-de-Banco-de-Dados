import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('Gerente' | 'Recepcionista')[]) =>
  SetMetadata(ROLES_KEY, roles);
