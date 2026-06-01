import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'
import { api } from '../lib/api'
import Modal from '../components/Modal'
import type { Consumo, ProdutoServico } from '../types'

interface OcupacaoAtual {
  id_hospedagem: number
  numero_quarto: number
  nome_cliente: string
}

interface ConsumoForm {
  id_produto_servico: string
  quantidade: string
}

const emptyForm: ConsumoForm = { id_produto_servico: '', quantidade: '1' }

function fmt(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Consumos() {
  const { data: hospedagens } = useSWR<OcupacaoAtual[]>('/hospedagens', fetcher)
  const { data: produtos } = useSWR<ProdutoServico[]>('/produtos-servicos', fetcher)

  const [hospId, setHospId] = useState<number | null>(null)
  const { data: consumos, mutate } = useSWR<Consumo[]>(
    hospId ? `/hospedagens/${hospId}/consumos` : null,
    fetcher,
  )

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<ConsumoForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')

  function abrirModal() {
    setForm(emptyForm)
    setErro('')
    setModal(true)
  }

  function fechar() {
    setModal(false)
  }

  async function salvar() {
    if (!hospId) return
    setSaving(true)
    setErro('')
    try {
      await api.post(`/hospedagens/${hospId}/consumos`, {
        id_produto_servico: Number(form.id_produto_servico),
        quantidade: Number(form.quantidade),
      })
      await mutate()
      fechar()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? 'Erro ao registrar consumo')
    } finally {
      setSaving(false)
    }
  }

  const hospSelecionada = hospedagens?.find((h) => h.id_hospedagem === hospId)

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Consumos</h2>
        <p className="mt-1 text-sm text-gray-500">Registre produtos e serviços consumidos por uma hospedagem ativa.</p>
      </div>

      <div className="mb-5 max-w-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">Selecionar Hospedagem</label>
        <select
          value={hospId ?? ''}
          onChange={(e) => setHospId(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">-- selecione --</option>
          {hospedagens?.map((h) => (
            <option key={h.id_hospedagem} value={h.id_hospedagem}>
              #{h.id_hospedagem} — {h.nome_cliente} (Quarto {h.numero_quarto})
            </option>
          ))}
        </select>
      </div>

      {hospId && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Consumos — Hospedagem #{hospId}
              {hospSelecionada && (
                <span className="ml-2 text-sm font-normal text-gray-500">({hospSelecionada.nome_cliente})</span>
              )}
            </h3>
            <button
              onClick={abrirModal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              + Registrar Consumo
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Produto / Serviço</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                  <th className="px-4 py-3 text-right">Preço Unit.</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-left">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consumos?.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">#{c.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {c.produto?.nome ?? `ID ${c.id_produto_servico}`}
                    </td>
                    <td className="px-4 py-3">
                      {c.produto && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.produto.tipo === 'produto'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {c.produto.tipo}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{c.quantidade}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(c.preco_unitario)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {fmt(c.quantidade * c.preco_unitario)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(c.data_hora).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {consumos?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                      Nenhum consumo registrado para esta hospedagem.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal && (
        <Modal title="Registrar Consumo" onClose={fechar}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Produto / Serviço</label>
              <select
                value={form.id_produto_servico}
                onChange={(e) => setForm((f) => ({ ...f, id_produto_servico: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- selecione --</option>
                {produtos?.filter((p) => p.ativo).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {fmt(p.preco_venda)} ({p.tipo})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quantidade</label>
              <input
                type="number"
                min={1}
                value={form.quantidade}
                onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={fechar} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={saving || !form.id_produto_servico}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Registrar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
