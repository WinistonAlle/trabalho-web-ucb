import { useMemo } from 'react'
import DataTable from '../components/DataTable.jsx'
import { KEYS, load, brl, dataBR } from '../utils/storage.js'

/**
 * Relatorio — JOIN simulado em JavaScript entre Pedidos + Clientes + Cervejas.
 * Para cada pedido (map), busca o cliente e a cerveja correspondentes (find)
 * e monta uma linha consolidada. Tudo no frontend, sem backend.
 */
export default function Relatorio() {
  const linhas = useMemo(() => {
    const pedidos = load(KEYS.pedidos)
    const clientes = load(KEYS.clientes)
    const cervejas = load(KEYS.cervejas)

    return pedidos.map((p) => {
      const cliente = clientes.find((c) => c.id === p.clienteId)   // JOIN cliente
      const cerveja = cervejas.find((c) => c.id === p.cervejaId)   // JOIN cerveja
      const preco = cerveja?.preco || 0
      return {
        id: p.id,
        cliente: cliente?.nome || '— removido —',
        cerveja: cerveja?.nome || '— removida —',
        estilo: cerveja?.estilo || '—',
        quantidade: p.quantidade,
        preco,
        total: preco * p.quantidade,
        data: p.data,
      }
    })
  }, [])

  // Totais consolidados.
  const totalGarrafas = linhas.reduce((s, l) => s + l.quantidade, 0)
  const totalFaturado = linhas.reduce((s, l) => s + l.total, 0)

  const columns = [
    { key: 'cliente', label: 'Cliente', render: (r) => <span className="t-strong">{r.cliente}</span> },
    { key: 'cerveja', label: 'Cerveja' },
    { key: 'estilo', label: 'Estilo' },
    { key: 'quantidade', label: 'Qtd', render: (r) => <span className="t-mono">{r.quantidade}</span> },
    { key: 'preco', label: 'Preço un.', render: (r) => <span className="t-mono">{brl(r.preco)}</span> },
    { key: 'total', label: 'Total', render: (r) => <span className="t-mono t-strong">{brl(r.total)}</span> },
    { key: 'data', label: 'Data', render: (r) => <span className="t-mono">{dataBR(r.data)}</span> },
  ]

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow">Relatório · JOIN simulado</p>
            <h1 className="page-title">Relatório de pedidos</h1>
            <p className="page-sub">Cruzamento de Pedidos × Clientes × Cervejas feito em JavaScript (map + find).</p>
          </div>
        </div>

        {linhas.length > 0 && (
          <div className="toolbar" style={{ gap: 28 }}>
            <span className="count-pill"><b>{linhas.length}</b> pedido(s)</span>
            <span className="count-pill"><b>{totalGarrafas}</b> garrafa(s)</span>
            <span className="count-pill">Faturamento: <b>{brl(totalFaturado)}</b></span>
          </div>
        )}

        <DataTable
          columns={columns}
          rows={linhas}
          empty={{ titulo: 'Sem dados para o relatório', texto: 'Registre pedidos para ver o cruzamento aqui.' }}
        />
      </div>
    </main>
  )
}
