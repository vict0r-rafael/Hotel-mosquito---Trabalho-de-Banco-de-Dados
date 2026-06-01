import { useAtomValue } from 'jotai'
import { authAtom } from '../atoms/auth'

export default function Dashboard() {
  const auth = useAtomValue(authAtom)
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Bem-vindo, {auth?.nome}!</h2>
      <p className="mt-1 text-sm text-gray-500">Perfil: {auth?.perfil} · Cargo: {auth?.cargo}</p>
    </div>
  )
}
