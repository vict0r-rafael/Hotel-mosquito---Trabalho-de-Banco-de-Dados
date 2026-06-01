import { atom } from 'jotai'

export type Perfil = 'Gerente' | 'Recepcionista'

export interface AuthUser {
  id: number
  nome: string
  cargo: string
  perfil: Perfil
  token: string
}

export const authAtom = atom<AuthUser | null>(null)
