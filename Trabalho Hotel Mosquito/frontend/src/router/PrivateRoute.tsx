import { Navigate, Outlet } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { authAtom, type Perfil } from '../atoms/auth'

interface Props {
  somentePerfil?: Perfil
}

export default function PrivateRoute({ somentePerfil }: Props) {
  const auth = useAtomValue(authAtom)

  if (!auth) return <Navigate to="/login" replace />
  if (somentePerfil && auth.perfil !== somentePerfil) return <Navigate to="/" replace />

  return <Outlet />
}
