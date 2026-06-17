import { useMemo } from 'react'
import DataTable from '../components/DataTable.jsx'
import { KEYS, load, brl } from '../utils/storage.js'
import { LINHAS } from '../data/linhas.js'

/**
 * Catalogo — JOIN simulado em JavaScript entre Cervejas e Estilos.
 * Para cada cerveja (map), busca o estilo correspondente pelo estiloId (find)
 * e monta uma linha consolidada com os dados de ambas as tabelas.
 */
export default function Catalogo() {
  const linhas = useMemo(() => {
    const cervejas = load(KEYS.cervejas)   // tabela 1
    const estilos  = load(KEYS.estilos)    // tabela 2

    // JOIN: cervejas.map + estilos.find(e => e.id === c.estiloId)
    return cervejas.map((c) => {
      const estilo = estilos.find((e) => e.id === c.estiloId)
      return {
        id:          c.id,
        nome:        c.nome,
        estiloNome:  estilo?.nome       || '—',
        estiloDesc:  estilo?.descricao  || '—',
        linha:       c.linha,
        teor:        c.teor,
        preco:       c.preco,
        descricao:   c.descricao,
      }
    })
  }, [])

  const totalItens  = linhas.length
  const precoMedio  = totalItens ? linhas.reduce((s, l) => s + l.preco, 0) / totalItens : 0
  const teorMedio   = totalItens ? linhas.reduce((s, l) => s + l.teor,  0) / totalItens : 0

  const columns = [
    { key: 'nome',       label: 'Cerveja',    render: (r) => <span className="t-strong">{r.nome}</span> },
    {
      key: 'estiloNome',
      label: 'Estilo',
      render: (r) => (
        <span className="badge" title={r.estiloDesc}>{r.estiloNome}</span>
      ),
    },
    { key: 'estiloDesc', label: 'Descrição do estilo', render: (r) => <span className="t-desc">{r.estiloDesc}</span> },
    {
      key: 'linha',
      label: 'Linha',
      render: (r) => (
        <span className="badge">
          <span className="dot" style={{ background: LINHAS[r.linha]?.cor || '#999' }} />
          {r.linha}
        </span>
      ),
    },
    { key: 'teor',  label: 'Teor',  render: (r) => <span className="t-mono">{r.teor}%</span>  },
    { key: 'preco', label: 'Preço', render: (r) => <span className="t-mono">{brl(r.preco)}</span> },
  ]

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow">Relatório · JOIN simulado</p>
            <h1 className="page-title">Catálogo de Cervejas</h1>
            <p className="page-sub">
              Cruzamento de <b>Cervejas</b> × <b>Estilos</b> feito em JavaScript
              — <code>cervejas.map(c =&gt; ({'{'} ...c, estilo: estilos.find(e =&gt; e.id === c.estiloId) {'}'}))</code>
            </p>
          </div>
        </div>

        {linhas.length > 0 && (
          <div className="toolbar" style={{ gap: 28 }}>
            <span className="count-pill"><b>{totalItens}</b> cerveja(s)</span>
            <span className="count-pill">Teor médio: <b>{teorMedio.toFixed(1)}%</b></span>
            <span className="count-pill">Preço médio: <b>{brl(precoMedio)}</b></span>
          </div>
        )}

        <DataTable
          columns={columns}
          rows={linhas}
          empty={{
            titulo: 'Nenhuma cerveja cadastrada',
            texto: 'Cadastre cervejas na aba "Cervejas" para ver o catálogo aqui.',
          }}
        />
      </div>
    </main>
  )
}
