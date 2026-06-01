import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { authAtom } from './atoms/auth'
import { api } from './lib/api'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Quartos from './pages/Quartos'
import Funcionarios from './pages/Funcionarios'
import Reservas from './pages/Reservas'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Consumos from './pages/Consumos'
import Relatorios from './pages/Relatorios'
import Layout from './components/Layout'
import PrivateRoute from './router/PrivateRoute'

function AuthInit({ children }: { children: React.ReactNode }) {
  const setAuth = useSetAtom(authAtom)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (!raw) return
    try {
      setAuth(JSON.parse(raw))
    } catch {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }, [setAuth])

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInit>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="quartos" element={<Quartos />} />
              <Route path="reservas" element={<Reservas />} />
              <Route path="checkin" element={<CheckIn />} />
              <Route path="checkout" element={<CheckOut />} />
              <Route path="consumos" element={<Consumos />} />

              <Route element={<PrivateRoute somentePerfil="Gerente" />}>
                <Route path="funcionarios" element={<Funcionarios />} />
                <Route path="relatorios" element={<Relatorios />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInit>
    </BrowserRouter>
  )
}
