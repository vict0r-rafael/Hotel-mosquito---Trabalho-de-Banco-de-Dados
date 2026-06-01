import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'

interface OcupacaoAtual {
  id_hospedagem: number
  numero_quarto: number
  categoria_quarto: string
  nome_cliente: string
  cpf_cliente: string
  data_checkin_prev: string
  data_checkout_prev: string
  data_checkin_real: string
  valor_total_diarias: number
  valor_total_consumos: number
  valor_total_final: number
}

function fmt(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CheckOut() {
  const { data, mutate } = useSWR<OcupacaoAtual[]>('/hospedagens', fetcher)
  const [loading, setLoading] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function realizarCheckOut(id: number) {
    if (!confirm(`Confirmar Check-Out da hospedagem #${id}?`)) return
    setLoading(id)
    setErro('')
    setSucesso('')
    try {
      await api.post(`/hospedagens/${id}/checkout`)
      setSucesso(`Check-Out da hospedagem #${id} realizado com sucesso!`)
      mutate()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? 'Erro ao realizar Check-Out')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Check-Out</h2>
        <p className="mt-1 text-sm text-gray-500">Hospedagens ativas — selecione para realizar o check-out.</p>
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
              <th className="px-4 py-3 text-left">Hosp.</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Quarto</th>
              <th className="px-4 py-3 text-left">Check-in Real</th>
              <th className="px-4 py-3 text-left">Check-out Prev.</th>
              <th className="px-4 py-3 text-right">Diárias</th>
              <th className="px-4 py-3 text-right">Consumos</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((h) => (
              <tr key={h.id_hospedagem} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">#{h.id_hospedagem}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{h.nome_cliente}</td>
                <td className="px-4 py-3 text-gray-600">
                  {h.numero_quarto}
                  <span className="ml-1 text-xs text-gray-400">({h.categoria_quarto})</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{h.data_checkin_real?.slice(0, 10)}</td>
                <td className="px-4 py-3 text-gray-600">{h.data_checkout_prev?.slice(0, 10)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{fmt(h.valor_total_diarias)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{fmt(h.valor_total_consumos)}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(h.valor_total_final)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => realizarCheckOut(h.id_hospedagem)}
                    disabled={loading === h.id_hospedagem}
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    {loading === h.id_hospedagem ? 'Processando...' : 'Fazer Check-Out'}
                  </button>
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                  Nenhuma hospedagem ativa no momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
