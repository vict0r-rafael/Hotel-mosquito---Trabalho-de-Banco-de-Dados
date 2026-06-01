import { useState } from 'react'
import useSWR from 'swr'
import { useAtomValue } from 'jotai'
import { authAtom } from '../atoms/auth'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'
import Modal from '../components/Modal'
import type { Quarto, QuartoStatus } from '../types'

interface Form {
  numero: string
  andar: string
  capacidade: string
  status: QuartoStatus
  preco_diaria: string
  id_categoria: string
}

const empty: Form = {
  numero: '', andar: '', capacidade: '', status: 'disponivel', preco_diaria: '', id_categoria: '',
}

const STATUS_OPTS: QuartoStatus[] = ['disponivel', 'ocupado', 'manutencao', 'reservado']

const STATUS_BADGE: Record<QuartoStatus, string> = {
  disponivel: 'bg-green-100 text-green-700',
  ocupado: 'bg-red-100 text-red-700',
  manutencao: 'bg-yellow-100 text-yellow-700',
  reservado: 'bg-blue-100 text-blue-700',
}

export default function Quartos() {
  const auth = useAtomValue(authAtom)
  const isGerente = auth?.perfil === 'Gerente'
  const { data, mutate } = useSWR<Quarto[]>('/quartos', fetcher)

  const [modal, setModal] = useState<'criar' | 'editar' | null>(null)
  const [form, setForm] = useState<Form>(empty)
  const [editNumero, setEditNumero] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [saving, setSaving] = useState(false)

  function abrirCriar() {
    setForm(empty)
    setErro('')
    setModal('criar')
  }

  function abrirEditar(q: Quarto) {
    setForm({
      numero: String(q.numero),
      andar: String(q.andar),
      capacidade: String(q.capacidade),
      status: q.status,
      preco_diaria: String(q.preco_diaria),
      id_categoria: String(q.id_categoria),
    })
    setEditNumero(q.numero)
    setErro('')
    setModal('editar')
  }

  function fechar() {
    setModal(null)
    setEditNumero(null)
  }

  function campo(key: keyof Form, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function salvar() {
    setSaving(true)
    setErro('')
    const payload = {
      numero: Number(form.numero),
      andar: Number(form.andar),
      capacidade: Number(form.capacidade),
      status: form.status,
      preco_diaria: Number(form.preco_diaria),
      id_categoria: Number(form.id_categoria),
    }
    try {
      if (modal === 'criar') {
        await api.post('/quartos', payload)
      } else {
        await api.put(`/quartos/${editNumero}`, payload)
      }
      await mutate()
      fechar()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function excluir(numero: number) {
    if (!confirm(`Confirmar exclusão do quarto ${numero}?`)) return
    try {
      await api.delete(`/quartos/${numero}`)
      mutate()
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Erro ao excluir')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Quartos</h2>
        {isGerente && (
          <button
            onClick={abrirCriar}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + Novo Quarto
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nº</th>
              <th className="px-4 py-3 text-left">Andar</th>
              <th className="px-4 py-3 text-left">Capacidade</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Diária (R$)</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              {isGerente && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((q) => (
              <tr key={q.numero} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{q.numero}</td>
                <td className="px-4 py-3 text-gray-600">{q.andar}</td>
                <td className="px-4 py-3 text-gray-600">{q.capacidade}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[q.status]}`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {Number(q.preco_diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-gray-600">{q.id_categoria}</td>
                {isGerente && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => abrirEditar(q)} className="text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => excluir(q.numero)} className="text-red-500 hover:underline">
                      Excluir
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">Nenhum quarto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'criar' ? 'Novo Quarto' : 'Editar Quarto'} onClose={fechar}>
          <div className="space-y-3">
            {(['numero', 'andar', 'capacidade', 'preco_diaria', 'id_categoria'] as (keyof Form)[]).map((key) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 capitalize mb-1">
                  {key === 'preco_diaria' ? 'Preço Diária' : key === 'id_categoria' ? 'ID Categoria' : key}
                </label>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => campo(key, e.target.value)}
                  disabled={modal === 'editar' && key === 'numero'}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => campo('status', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={fechar} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
