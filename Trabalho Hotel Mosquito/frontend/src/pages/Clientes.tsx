import { useState } from 'react'
import useSWR from 'swr'
import { useAtomValue } from 'jotai'
import { authAtom } from '../atoms/auth'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'
import Modal from '../components/Modal'
import type { Cliente } from '../types'

interface Form {
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
}

const empty: Form = { nome: '', cpf: '', email: '', telefone: '', endereco: '' }

export default function Clientes() {
  const auth = useAtomValue(authAtom)
  const { data, mutate } = useSWR<Cliente[]>('/clientes', fetcher)

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

  function abrirEditar(c: Cliente) {
    setForm({ nome: c.nome, cpf: c.cpf, email: c.email, telefone: c.telefone, endereco: c.endereco ?? '' })
    setEditId(c.id)
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
    try {
      if (modal === 'criar') {
        await api.post('/clientes', form)
      } else {
        await api.put(`/clientes/${editId}`, form)
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
    if (!confirm('Confirmar exclusão do cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      mutate()
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Erro ao excluir')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <button
          onClick={abrirCriar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Novo Cliente
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">CPF</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Telefone</th>
              <th className="px-4 py-3 text-left">Endereço</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{c.nome}</td>
                <td className="px-4 py-3 text-gray-600">{c.cpf}</td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-600">{c.telefone}</td>
                <td className="px-4 py-3 text-gray-600">{c.endereco}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => abrirEditar(c)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  {auth?.perfil === 'Gerente' && (
                    <button
                      onClick={() => excluir(c.id)}
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">Nenhum cliente cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'criar' ? 'Novo Cliente' : 'Editar Cliente'} onClose={fechar}>
          <div className="space-y-3">
            {(['nome', 'cpf', 'email', 'telefone', 'endereco'] as (keyof Form)[]).map((key) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 capitalize mb-1">{key}</label>
                <input
                  value={form[key]}
                  onChange={(e) => campo(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder={key === 'cpf' ? '11 dígitos sem máscara' : ''}
                />
              </div>
            ))}
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
