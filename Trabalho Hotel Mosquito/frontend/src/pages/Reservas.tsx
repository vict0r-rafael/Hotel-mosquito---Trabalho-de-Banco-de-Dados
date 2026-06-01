import { useState } from 'react'
import useSWR from 'swr'
import { useAtomValue } from 'jotai'
import { authAtom } from '../atoms/auth'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'
import Modal from '../components/Modal'
import type { Reserva, ReservaStatus } from '../types'

interface Form {
  id_cliente: string
  numero_quarto: string
  data_checkin_prev: string
  data_checkout_prev: string
  status: ReservaStatus
}

const empty: Form = {
  id_cliente: '', numero_quarto: '', data_checkin_prev: '', data_checkout_prev: '', status: 'pendente',
}

const STATUS_BADGE: Record<ReservaStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  confirmada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  concluida: 'bg-gray-100 text-gray-600',
}

const STATUS_OPTS: ReservaStatus[] = ['pendente', 'confirmada', 'cancelada', 'concluida']

export default function Reservas() {
  const auth = useAtomValue(authAtom)
  const { data, mutate } = useSWR<Reserva[]>('/reservas', fetcher)

  const [modal, setModal] = useState<'criar' | 'editar' | null>(null)
  const [form, setForm] = useState<Form>(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [saving, setSaving] = useState(false)

  function abrirCriar() {
    setForm(empty)
    setErro('')
    setModal('criar')
  }

  function abrirEditar(r: Reserva) {
    setForm({
      id_cliente: String(r.id_cliente),
      numero_quarto: String(r.numero_quarto),
      data_checkin_prev: r.data_checkin_prev.slice(0, 10),
      data_checkout_prev: r.data_checkout_prev.slice(0, 10),
      status: r.status,
    })
    setEditId(r.id)
    setErro('')
    setModal('editar')
  }

  function fechar() {
    setModal(null)
    setEditId(null)
  }

  function campo(key: keyof Form, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function salvar() {
    setSaving(true)
    setErro('')
    const payload = {
      id_cliente: Number(form.id_cliente),
      numero_quarto: Number(form.numero_quarto),
      data_checkin_prev: form.data_checkin_prev,
      data_checkout_prev: form.data_checkout_prev,
      ...(modal === 'editar' ? { status: form.status } : {}),
    }
    try {
      if (modal === 'criar') {
        await api.post('/reservas', payload)
      } else {
        await api.put(`/reservas/${editId}`, payload)
      }
      await mutate()
      fechar()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function excluir(id: number) {
    if (!confirm('Confirmar exclusão da reserva?')) return
    try {
      await api.delete(`/reservas/${id}`)
      mutate()
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Erro ao excluir')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Reservas</h2>
        <button
          onClick={abrirCriar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Nova Reserva
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Quarto</th>
              <th className="px-4 py-3 text-left">Check-in Prev.</th>
              <th className="px-4 py-3 text-left">Check-out Prev.</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">#{r.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {r.cliente?.nome ?? `ID ${r.id_cliente}`}
                </td>
                <td className="px-4 py-3 text-gray-600">{r.numero_quarto}</td>
                <td className="px-4 py-3 text-gray-600">{r.data_checkin_prev.slice(0, 10)}</td>
                <td className="px-4 py-3 text-gray-600">{r.data_checkout_prev.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => abrirEditar(r)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  {auth?.perfil === 'Gerente' && (
                    <button onClick={() => excluir(r.id)} className="text-red-500 hover:underline">
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">Nenhuma reserva cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'criar' ? 'Nova Reserva' : 'Editar Reserva'} onClose={fechar}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ID do Cliente</label>
              <input
                type="number"
                value={form.id_cliente}
                onChange={(e) => campo('id_cliente', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Número do Quarto</label>
              <input
                type="number"
                value={form.numero_quarto}
                onChange={(e) => campo('numero_quarto', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check-in Previsto</label>
              <input
                type="date"
                value={form.data_checkin_prev}
                onChange={(e) => campo('data_checkin_prev', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check-out Previsto</label>
              <input
                type="date"
                value={form.data_checkout_prev}
                onChange={(e) => campo('data_checkout_prev', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            {modal === 'editar' && (
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
            )}
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
