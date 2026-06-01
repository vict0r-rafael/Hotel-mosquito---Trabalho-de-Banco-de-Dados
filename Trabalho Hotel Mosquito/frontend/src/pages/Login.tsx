import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { authAtom } from '../atoms/auth'
import { api } from '../lib/api'

export default function Login() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useSetAtom(authAtom)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { login, senha })
      const user = {
        id: data.funcionario.id,
        nome: data.funcionario.nome,
        cargo: data.funcionario.cargo,
        perfil: data.funcionario.perfil,
        token: data.access_token,
      }
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setAuth(user)
      navigate('/')
    } catch {
      setErro('Login ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-center text-2xl font-bold text-gray-800">Hotel do Mosquito</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Sistema de Gestão Hoteleira</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Login</label>
            <input
              type="text"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="seu.login"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {erro && <p className="text-center text-sm text-red-500">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
