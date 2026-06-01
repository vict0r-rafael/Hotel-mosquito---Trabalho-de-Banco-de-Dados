import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'
import Modal from '../components/Modal'
import type { Funcionario } from '../types'

interface Form {
  nome: string
  cpf: string
  cargo: string
  login: string
  senha: string
  perfil: 'Gerente' | 'Recepcionista'
}

const empty: Form = { nome: '', cpf: '', cargo: '', login: '', senha: '', perfil: 'Recepcionista' }

export default function Funcionarios() {
  const { data, mutate } = useSWR<Funcionario[]>('/funcionarios', fetcher)

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

  function abrirEditar(f: Funcionario) {
    setForm({ nome: f.nome, cpf: f.cpf, cargo: f.cargo, login: f.login, senha: '', perfil: f.perfil })
    setEditId(f.id)
    setErro('')
    setModal('editar')
  }

  function fechar() {
    setModal(null)
    setEditId(null)
  }

  function campo<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function salvar() {
    setSaving(true)
    setErro('')
    const payload: Record<string, unknown> = { ...form }
    if (modal === 'editar' && !form.senha) delete payload.senha
    try {
      if (modal === 'criar') {
        await api.post('/funcionarios', payload)
      } else {
        await api.put(`/funcionarios/${editId}`, payload)
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
    if (!confirm('Confirmar exclusão do funcionário?')) return
    try {
      await api.delete(`/funcionarios/${id}`)
      mutate()
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Erro ao excluir')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Funcionários</h2>
        <button
          onClick={abrirCriar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Novo Funcionário
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">CPF</th>
              <th className="px-4 py-3 text-left">Cargo</th>
              <th className="px-4 py-3 text-left">Login</th>
              <th className="px-4 py-3 text-left">Perfil</th>
              <th className="px-4 py-3 text-left">Ativo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{f.nome}</td>
                <td className="px-4 py-3 text-gray-600">{f.cpf}</td>
                <td className="px-4 py-3 text-gray-600">{f.cargo}</td>
                <td className="px-4 py-3 text-gray-600">{f.login}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.perfil === 'Gerente' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {f.perfil}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${f.ativo ? 'text-green-600' : 'text-red-500'}`}>
                    {f.ativo ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => abrirEditar(f)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => excluir(f.id)} className="text-red-500 hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">Nenhum funcionário cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'criar' ? 'Novo Funcionário' : 'Editar Funcionário'} onClose={fechar}>
          <div className="space-y-3">
            {(['nome', 'cpf', 'cargo', 'login'] as (keyof Form)[]).map((key) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 capitalize mb-1">{key}</label>
                <input
                  value={form[key] as string}
                  onChange={(e) => campo(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder={key === 'cpf' ? '11 dígitos sem máscara' : ''}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Senha {modal === 'editar' && <span className="text-gray-400">(deixe em branco para manter)</span>}
              </label>
              <input
                type="password"
                value={form.senha}
                onChange={(e) => campo('senha', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Perfil</label>
              <select
                value={form.perfil}
                onChange={(e) => campo('perfil', e.target.value as Form['perfil'])}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Recepcionista">Recepcionista</option>
                <option value="Gerente">Gerente</option>
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
