export type QuartoStatus = 'disponivel' | 'ocupado' | 'manutencao' | 'reservado'
export type ReservaStatus = 'pendente' | 'confirmada' | 'cancelada' | 'concluida'
export type HospedagemStatus = 'ativa' | 'finalizada'
export type ProdutoTipo = 'produto' | 'servico'

export interface CategoriaQuarto {
  id: number
  nome: string
  descricao: string
}

export interface Quarto {
  numero: number
  andar: number
  capacidade: number
  status: QuartoStatus
  preco_diaria: number
  id_categoria: number
  categoria?: CategoriaQuarto
}

export interface Cliente {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
}

export interface Funcionario {
  id: number
  nome: string
  cpf: string
  cargo: string
  login: string
  perfil: 'Gerente' | 'Recepcionista'
  ativo: boolean
}

export interface Reserva {
  id: number
  id_cliente: number
  numero_quarto: number
  data_checkin_prev: string
  data_checkout_prev: string
  status: ReservaStatus
  id_funcionario: number
  data_criacao: string
  cliente?: Cliente
  quarto?: Quarto
}

export interface Hospedagem {
  id: number
  id_reserva: number
  data_checkin_real: string
  data_checkout_real: string | null
  valor_total_diarias: number
  valor_total_consumos: number
  valor_total_final: number
  status: HospedagemStatus
  id_funcionario_checkin: number
}

export interface ProdutoServico {
  id: number
  nome: string
  preco_venda: number
  tipo: ProdutoTipo
  ativo: boolean
}

export interface Consumo {
  id: number
  id_hospedagem: number
  id_produto_servico: number
  quantidade: number
  preco_unitario: number
  data_hora: string
  produto?: ProdutoServico
}
