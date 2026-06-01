import { NavLink, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtom } from '../atoms/auth'

interface NavItem {
  to: string
  label: string
}

const ITENS_COMUNS: NavItem[] = [
  { to: '/clientes', label: 'Clientes' },
  { to: '/quartos', label: 'Quartos' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/checkin', label: 'Check-In' },
  { to: '/checkout', label: 'Check-Out' },
  { to: '/consumos', label: 'Consumos' },
]

const ITENS_GERENTE: NavItem[] = [
  { to: '/funcionarios', label: 'Funcionários' },
  { to: '/relatorios', label: 'Relatórios' },
]

export default function Sidebar() {
  const [auth, setAuth] = useAtom(authAtom)
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth(null)
    navigate('/login')
  }

  const itens = auth?.perfil === 'Gerente'
    ? [...ITENS_COMUNS, ...ITENS_GERENTE]
    : ITENS_COMUNS

  return (
    <aside className="flex h-screen w-56 flex-col bg-gray-900 text-white">
      <div className="px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hotel do Mosquito</p>
        <p className="mt-1 text-sm font-medium text-white truncate">{auth?.nome}</p>
        <span className="mt-1 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium">
          {auth?.perfil}
        </span>
      </div>

      <nav className="flex-1 px-3">
        {itens.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
