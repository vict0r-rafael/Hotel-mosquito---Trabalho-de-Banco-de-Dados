import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'

type Aba = 'faturamento' | 'top-quartos' | 'top-clientes' | 'ocupacao' | 'historico'

interface FaturamentoRow {
  ano: number
  mes: number
  total_hospedagens: number
  total_diarias: number
  total_consumos: number
  faturamento_total: number
}

interface TopQuartoRow {
  numero: number
  categoria: string
  preco_diaria: number
  total_hospedagens: number
  receita_diarias: number
}

interface TopClienteRow {
  id: number
  nome: string
  cpf: string
  email: string
  total_hospedagens: number
  gasto_total: number
}

interface OcupacaoRow {
  ano: number
  mes: number
  total_hospedagens: number
  total_quartos: number
  taxa_ocupacao_pct: number
}

interface HistoricoRow {
  id_cliente: number
  nome_cliente: string
  cpf: string
  id_reserva: number
  status_reserva: string
  data_checkin_prev: string
  data_checkout_prev: string
  numero_quarto: number
  categoria_quarto: string
  data_checkin_real: string | null
  data_checkout_real: string | null
  valor_total_final: number | null
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function fmt(val: number | null | undefined) {
  if (val == null) return '—'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(val: string | null) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('pt-BR')
}

const ABAS: { id: Aba; label: string }[] = [
  { id: 'faturamento', label: 'Faturamento Mensal' },
  { id: 'top-quartos', label: 'Top 10 Quartos' },
  { id: 'top-clientes', label: 'Top 10 Clientes' },
  { id: 'ocupacao', label: 'Taxa de Ocupação' },
  { id: 'historico', label: 'Histórico de Reservas' },
]

function FaturamentoTabela() {
  const { data, isLoading } = useSWR<FaturamentoRow[]>('/relatorios/faturamento-mensal', fetcher)
  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center">Carregando...</p>
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-3 text-left">Mês / Ano</th>
          <th className="px-4 py-3 text-right">Hospedagens</th>
          <th className="px-4 py-3 text-right">Total Diárias</th>
          <th className="px-4 py-3 text-right">Total Consumos</th>
          <th className="px-4 py-3 text-right">Faturamento Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{MESES[r.mes - 1]}/{r.ano}</td>
            <td className="px-4 py-3 text-right text-gray-600">{r.total_hospedagens}</td>
            <td className="px-4 py-3 text-right text-gray-600">{fmt(r.total_diarias)}</td>
            <td className="px-4 py-3 text-right text-gray-600">{fmt(r.total_consumos)}</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(r.faturamento_total)}</td>
          </tr>
        ))}
        {data?.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Nenhum dado disponível.</td></tr>
        )}
      </tbody>
    </table>
  )
}

function TopQuartosTabela() {
  const { data, isLoading } = useSWR<TopQuartoRow[]>('/relatorios/top10-quartos', fetcher)
  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center">Carregando...</p>
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-3 text-left">Quarto</th>
          <th className="px-4 py-3 text-left">Categoria</th>
          <th className="px-4 py-3 text-right">Preço/Diária</th>
          <th className="px-4 py-3 text-right">Hospedagens</th>
          <th className="px-4 py-3 text-right">Receita Diárias</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">#{r.numero}</td>
            <td className="px-4 py-3 text-gray-600">{r.categoria}</td>
            <td className="px-4 py-3 text-right text-gray-600">{fmt(r.preco_diaria)}</td>
            <td className="px-4 py-3 text-right text-gray-600">{r.total_hospedagens}</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(r.receita_diarias)}</td>
          </tr>
        ))}
        {data?.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Nenhum dado disponível.</td></tr>
        )}
      </tbody>
    </table>
  )
}

function TopClientesTabela() {
  const { data, isLoading } = useSWR<TopClienteRow[]>('/relatorios/top10-clientes', fetcher)
  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center">Carregando...</p>
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-3 text-left">Nome</th>
          <th className="px-4 py-3 text-left">CPF</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-right">Hospedagens</th>
          <th className="px-4 py-3 text-right">Gasto Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((r) => (
          <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{r.nome}</td>
            <td className="px-4 py-3 text-gray-600">{r.cpf}</td>
            <td className="px-4 py-3 text-gray-600">{r.email}</td>
            <td className="px-4 py-3 text-right text-gray-600">{r.total_hospedagens}</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(r.gasto_total)}</td>
          </tr>
        ))}
        {data?.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Nenhum dado disponível.</td></tr>
        )}
      </tbody>
    </table>
  )
}

function OcupacaoTabela() {
  const { data, isLoading } = useSWR<OcupacaoRow[]>('/relatorios/taxa-ocupacao', fetcher)
  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center">Carregando...</p>
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-3 text-left">Mês / Ano</th>
          <th className="px-4 py-3 text-right">Hospedagens</th>
          <th className="px-4 py-3 text-right">Total Quartos</th>
          <th className="px-4 py-3 text-right">Taxa de Ocupação</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{MESES[r.mes - 1]}/{r.ano}</td>
            <td className="px-4 py-3 text-right text-gray-600">{r.total_hospedagens}</td>
            <td className="px-4 py-3 text-right text-gray-600">{r.total_quartos}</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-800">{r.taxa_ocupacao_pct}%</td>
          </tr>
        ))}
        {data?.length === 0 && (
          <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Nenhum dado disponível.</td></tr>
        )}
      </tbody>
    </table>
  )
}

function HistoricoTabela() {
  const { data, isLoading } = useSWR<HistoricoRow[]>('/relatorios/historico-reservas', fetcher)
  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center">Carregando...</p>
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-3 text-left">Cliente</th>
          <th className="px-4 py-3 text-left">CPF</th>
          <th className="px-4 py-3 text-left">Quarto</th>
          <th className="px-4 py-3 text-left">Categoria</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-right">Check-In Real</th>
          <th className="px-4 py-3 text-right">Check-Out Real</th>
          <th className="px-4 py-3 text-right">Valor Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{r.nome_cliente}</td>
            <td className="px-4 py-3 text-gray-600">{r.cpf}</td>
            <td className="px-4 py-3 text-gray-600">#{r.numero_quarto}</td>
            <td className="px-4 py-3 text-gray-600">{r.categoria_quarto}</td>
            <td className="px-4 py-3">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                r.status_reserva === 'confirmada' ? 'bg-green-100 text-green-700' :
                r.status_reserva === 'cancelada' ? 'bg-red-100 text-red-700' :
                r.status_reserva === 'finalizada' ? 'bg-gray-100 text-gray-600' :
                'bg-blue-100 text-blue-700'
              }`}>{r.status_reserva}</span>
            </td>
            <td className="px-4 py-3 text-right text-gray-600">{fmtDate(r.data_checkin_real)}</td>
            <td className="px-4 py-3 text-right text-gray-600">{fmtDate(r.data_checkout_real)}</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(r.valor_total_final)}</td>
          </tr>
        ))}
        {data?.length === 0 && (
          <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">Nenhum dado disponível.</td></tr>
        )}
      </tbody>
    </table>
  )
}

export default function Relatorios() {
  const [aba, setAba] = useState<Aba>('faturamento')

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
        <p className="mt-1 text-sm text-gray-500">Visão gerencial — acesso restrito a Gerentes</p>
      </div>

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {ABAS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              aba === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {aba === 'faturamento' && <FaturamentoTabela />}
        {aba === 'top-quartos' && <TopQuartosTabela />}
        {aba === 'top-clientes' && <TopClientesTabela />}
        {aba === 'ocupacao' && <OcupacaoTabela />}
        {aba === 'historico' && <HistoricoTabela />}
      </div>
    </div>
  )
}
