import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'
import type { Reserva } from '../types'

const ELEGIVEL: Reserva['status'][] = ['pendente', 'confirmada']

export default function CheckIn() {
  const { data, mutate } = useSWR<Reserva[]>('/reservas', fetcher)
  const [loading, setLoading] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const reservas = data?.filter((r) => ELEGIVEL.includes(r.status)) ?? []

  async function realizarCheckIn(id: number) {
    setLoading(id)
    setErro('')
    setSucesso('')
    try {
      await api.post('/hospedagens/checkin', { id_reserva: id })
      setSucesso(`Check-In da reserva #${id} realizado com sucesso!`)
      mutate()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? 'Erro ao realizar Check-In')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Check-In</h2>
        <p className="mt-1 text-sm text-gray-500">Reservas pendentes ou confirmadas disponíveis para check-in.</p>
      </div>

      {sucesso && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {sucesso}
        </div>
      )}
      {erro && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Reserva</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Quarto</th>
              <th className="px-4 py-3 text-left">Check-in Previsto</th>
              <th className="px-4 py-3 text-left">Check-out Previsto</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservas.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">#{r.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {r.cliente?.nome ?? `ID ${r.id_cliente}`}
                </td>
                <td className="px-4 py-3 text-gray-600">{r.numero_quarto}</td>
                <td className="px-4 py-3 text-gray-600">{r.data_checkin_prev.slice(0, 10)}</td>
                <td className="px-4 py-3 text-gray-600">{r.data_checkout_prev.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => realizarCheckIn(r.id)}
                    disabled={loading === r.id}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {loading === r.id ? 'Processando...' : 'Fazer Check-In'}
                  </button>
                </td>
              </tr>
            ))}
            {reservas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Nenhuma reserva disponível para check-in.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
