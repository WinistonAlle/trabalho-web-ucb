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
