/**
 * storage.js — utilitarios de persistencia em localStorage.
 * Centraliza as chaves e a leitura/escrita em JSON, usado por
 * todos os CRUDs (cervejas, clientes, pedidos).
 */

export const KEYS = {
  cervejas: 'mb_cervejas',
  clientes: 'mb_clientes',
  pedidos: 'mb_pedidos',
  estilos: 'mb_estilos',
}

// Estilos de referencia — semeados uma unica vez no primeiro acesso.
const ESTILOS_SEED = [
  { id: 'est_ipa',    nome: 'IPA',    descricao: 'India Pale Ale — lupulada, amarga, aroma floral e cítrico.' },
  { id: 'est_apa',    nome: 'APA',    descricao: 'American Pale Ale — equilibrada, levemente lupulada, fácil de beber.' },
  { id: 'est_lager',  nome: 'Lager',  descricao: 'Fermentação a baixa temperatura, suave, dourada e refrescante.' },
  { id: 'est_pilsen', nome: 'Pilsen', descricao: 'Lager clara de origem tcheca, levemente amarga e muito gasosa.' },
  { id: 'est_weiss',  nome: 'Weiss',  descricao: 'Trigo alemão com notas de banana, cravo e final suave.' },
  { id: 'est_wit',    nome: 'Witbier',descricao: 'Trigo belga com coentro e casca de laranja, nebulosa e refrescante.' },
  { id: 'est_stout',  nome: 'Stout',  descricao: 'Escura e encorpada, com notas de café e chocolate amargo.' },
  { id: 'est_dunkel', nome: 'Dunkel', descricao: 'Lager escura alemã, maltada, caramelo e notas de pão tostado.' },
]

// Popula a tabela de estilos no localStorage se ainda estiver vazia.
export function seedEstilos() {
  if (!localStorage.getItem(KEYS.estilos)) {
    save(KEYS.estilos, ESTILOS_SEED)
  }
}

// ── Dados fictícios ──────────────────────────────────────────────

const CERVEJAS_SEED = [
  { id: 'cerv_001', nome: 'MARS FLOREST',      estiloId: 'est_ipa',    linha: 'FLOREST',     teor: 6.2, preco: 22.90, descricao: 'Lupulada e herbal, com aroma de pinho e final seco.' },
  { id: 'cerv_002', nome: 'MARS BLUE DARK',    estiloId: 'est_dunkel', linha: 'BLUE DARK',   teor: 5.8, preco: 24.50, descricao: 'Maltada e encorpada com notas de caramelo e chocolate.' },
  { id: 'cerv_003', nome: 'MARS SOL DA TARDE', estiloId: 'est_apa',    linha: 'SOL DA TARDE',teor: 5.2, preco: 21.90, descricao: 'Cítrica e refrescante, dourada como o fim de tarde.' },
  { id: 'cerv_004', nome: 'MARS WEISS',        estiloId: 'est_weiss',  linha: 'FLOREST',     teor: 4.9, preco: 20.50, descricao: 'Trigo alemão com banana e cravo, espuma densa.' },
  { id: 'cerv_005', nome: 'MARS STOUT',        estiloId: 'est_stout',  linha: 'BLUE DARK',   teor: 7.1, preco: 26.90, descricao: 'Escura e cremosa, café torrado e chocolate amargo.' },
  { id: 'cerv_006', nome: 'MARS PILSEN',       estiloId: 'est_pilsen', linha: 'SOL DA TARDE',teor: 4.5, preco: 18.90, descricao: 'Muito gasosa e leve, perfeita para o calor.' },
  { id: 'cerv_007', nome: 'MARS WITBIER',      estiloId: 'est_wit',    linha: 'SOL DA TARDE',teor: 4.8, preco: 19.90, descricao: 'Trigo belga com coentro e laranja, nebulosa e suave.' },
  { id: 'cerv_008', nome: 'MARS RED LAGER',    estiloId: 'est_lager',  linha: 'FLOREST',     teor: 5.0, preco: 20.90, descricao: 'Lager âmbar com malte caramelizado e baixa amargor.' },
]

const CLIENTES_SEED = [
  { id: 'cli_001', nome: 'João Silva',       email: 'joao.silva@email.com',       telefone: '(11) 98765-4321', cidade: 'São Paulo'       },
  { id: 'cli_002', nome: 'Maria Oliveira',   email: 'maria.oliveira@email.com',   telefone: '(21) 99123-4567', cidade: 'Rio de Janeiro'  },
  { id: 'cli_003', nome: 'Carlos Souza',     email: 'carlos.souza@email.com',     telefone: '(31) 97654-3210', cidade: 'Belo Horizonte'  },
  { id: 'cli_004', nome: 'Ana Santos',       email: 'ana.santos@email.com',       telefone: '(41) 98234-5678', cidade: 'Curitiba'        },
  { id: 'cli_005', nome: 'Pedro Costa',      email: 'pedro.costa@email.com',      telefone: '(47) 96543-2109', cidade: 'Florianópolis'   },
  { id: 'cli_006', nome: 'Juliana Ferreira', email: 'juliana.ferreira@email.com', telefone: '(51) 97890-1234', cidade: 'Porto Alegre'    },
]

const PEDIDOS_SEED = [
  { id: 'ped_001', clienteId: 'cli_001', cervejaId: 'cerv_001', quantidade: 6,  data: '2026-06-01' },
  { id: 'ped_002', clienteId: 'cli_002', cervejaId: 'cerv_003', quantidade: 12, data: '2026-06-03' },
  { id: 'ped_003', clienteId: 'cli_003', cervejaId: 'cerv_005', quantidade: 4,  data: '2026-06-05' },
  { id: 'ped_004', clienteId: 'cli_001', cervejaId: 'cerv_002', quantidade: 8,  data: '2026-06-07' },
  { id: 'ped_005', clienteId: 'cli_004', cervejaId: 'cerv_006', quantidade: 24, data: '2026-06-08' },
  { id: 'ped_006', clienteId: 'cli_005', cervejaId: 'cerv_004', quantidade: 6,  data: '2026-06-10' },
  { id: 'ped_007', clienteId: 'cli_002', cervejaId: 'cerv_007', quantidade: 3,  data: '2026-06-11' },
  { id: 'ped_008', clienteId: 'cli_006', cervejaId: 'cerv_001', quantidade: 12, data: '2026-06-12' },
  { id: 'ped_009', clienteId: 'cli_003', cervejaId: 'cerv_008', quantidade: 6,  data: '2026-06-14' },
  { id: 'ped_010', clienteId: 'cli_005', cervejaId: 'cerv_003', quantidade: 9,  data: '2026-06-16' },
]

export function seedDados() {
  if (!localStorage.getItem(KEYS.cervejas)) save(KEYS.cervejas, CERVEJAS_SEED)
  if (!localStorage.getItem(KEYS.clientes)) save(KEYS.clientes, CLIENTES_SEED)
  if (!localStorage.getItem(KEYS.pedidos))  save(KEYS.pedidos,  PEDIDOS_SEED)
}

// Le uma lista do localStorage (retorna [] se vazio ou invalido).
export function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

// Salva uma lista no localStorage.
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Gera um id unico simples (sem dependencias externas).
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Formata um numero como moeda brasileira.
export function brl(n) {
  return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Formata uma data ISO (yyyy-mm-dd) para dd/mm/aaaa.
export function dataBR(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
