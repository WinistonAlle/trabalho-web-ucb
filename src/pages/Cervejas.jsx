import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import { KEYS, load, save, uid, brl } from '../utils/storage.js'
import { LINHA_NOMES, LINHAS } from '../data/linhas.js'

const VAZIO = { nome: '', estiloId: '', linha: 'FLOREST', teor: '', preco: '', descricao: '' }

/**
 * Cervejas — CRUD 1.
 * Lista em tabela (DataTable + map), cadastro/edicao via modal com
 * validacao, exclusao com confirmacao. Persiste em localStorage.
 * O campo estiloId referencia a tabela mb_estilos (JOIN no Catalogo).
 */
export default function Cervejas() {
  const [itens, setItens] = useState(() => load(KEYS.cervejas))
  const [estilos] = useState(() => load(KEYS.estilos))
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VAZIO)
  const [errors, setErrors] = useState({})

  useEffect(() => { save(KEYS.cervejas, itens) }, [itens])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const nomeEstilo = (estiloId) => estilos.find((e) => e.id === estiloId)?.nome || '—'

  function abrirNovo() {
    setEditando(null)
    setForm({ ...VAZIO, estiloId: estilos[0]?.id || '' })
    setErrors({})
    setModalAberto(true)
  }

  function abrirEdicao(item) {
    setEditando(item.id)
    setForm({ ...item })
    setErrors({})
    setModalAberto(true)
  }

  function validar() {
    const err = {}
    if (!form.nome.trim()) err.nome = 'Informe o nome.'
    if (!form.estiloId) err.estiloId = 'Selecione o estilo.'
    if (form.teor === '' || isNaN(form.teor) || Number(form.teor) <= 0) err.teor = 'Teor inválido.'
    if (form.preco === '' || isNaN(form.preco) || Number(form.preco) <= 0) err.preco = 'Preço inválido.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function salvar(e) {
    e.preventDefault()
    if (!validar()) return
    const dados = {
      nome: form.nome.trim(),
      estiloId: form.estiloId,
      linha: form.linha,
      teor: Number(form.teor),
      preco: Number(form.preco),
      descricao: form.descricao.trim(),
    }
    if (editando) {
      setItens(itens.map((i) => (i.id === editando ? { ...i, ...dados } : i)))
    } else {
      setItens([...itens, { id: uid(), ...dados }])
    }
    setModalAberto(false)
  }

  function excluir(item) {
    if (window.confirm(`Excluir a cerveja "${item.nome}"?`)) {
      setItens(itens.filter((i) => i.id !== item.id))
    }
  }

  const filtrados = itens.filter((i) =>
    (i.nome + nomeEstilo(i.estiloId) + i.linha).toLowerCase().includes(busca.toLowerCase())
  )

  const columns = [
    { key: 'nome', label: 'Cerveja', render: (r) => <span className="t-strong">{r.nome}</span> },
    { key: 'estiloId', label: 'Estilo', render: (r) => nomeEstilo(r.estiloId) },
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
    { key: 'teor', label: 'Teor', render: (r) => <span className="t-mono">{r.teor}%</span> },
    { key: 'preco', label: 'Preço', render: (r) => <span className="t-mono">{brl(r.preco)}</span> },
  ]

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow">CRUD · Catálogo</p>
            <h1 className="page-title">Cervejas</h1>
            <p className="page-sub">Cadastre e gerencie os rótulos da cervejaria.</p>
          </div>
          <button className="btn btn-primary" onClick={abrirNovo}>+ Nova cerveja</button>
        </div>

        <div className="toolbar">
          <div className="search">
            <input placeholder="Buscar por nome, estilo ou linha..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <span className="count-pill">{filtrados.length} de {itens.length} registro(s)</span>
        </div>

        <DataTable
          columns={columns}
          rows={filtrados}
          empty={{ titulo: 'Nenhuma cerveja cadastrada', texto: 'Clique em "Nova cerveja" para adicionar o primeiro rótulo.' }}
          actions={(r) => (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => abrirEdicao(r)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => excluir(r)}>Excluir</button>
            </>
          )}
        />
      </div>

      {modalAberto && (
        <Modal
          title={editando ? 'Editar cerveja' : 'Nova cerveja'}
          onClose={() => setModalAberto(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar}>Salvar</button>
            </>
          }
        >
          <form onSubmit={salvar} noValidate>
            <div className="form-grid">
              <div className={'field full' + (errors.nome ? ' invalid' : '')}>
                <label>Nome da cerveja</label>
                <input value={form.nome} onChange={set('nome')} placeholder="Ex.: Leão Dourado" />
                {errors.nome && <span className="field-error">{errors.nome}</span>}
              </div>

              <div className={'field' + (errors.estiloId ? ' invalid' : '')}>
                <label>Estilo</label>
                <select value={form.estiloId} onChange={set('estiloId')}>
                  <option value="">Selecione...</option>
                  {estilos.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
                {errors.estiloId && <span className="field-error">{errors.estiloId}</span>}
              </div>

              <div className="field">
                <label>Linha / Rótulo</label>
                <select value={form.linha} onChange={set('linha')}>
                  {LINHA_NOMES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className={'field' + (errors.teor ? ' invalid' : '')}>
                <label>Teor alcoólico (%)</label>
                <input type="number" step="0.1" min="0" value={form.teor} onChange={set('teor')} placeholder="Ex.: 5.2" />
                {errors.teor && <span className="field-error">{errors.teor}</span>}
              </div>

              <div className={'field' + (errors.preco ? ' invalid' : '')}>
                <label>Preço (R$)</label>
                <input type="number" step="0.01" min="0" value={form.preco} onChange={set('preco')} placeholder="Ex.: 24.90" />
                {errors.preco && <span className="field-error">{errors.preco}</span>}
              </div>

              <div className="field full">
                <label>Descrição (opcional)</label>
                <textarea value={form.descricao} onChange={set('descricao')} placeholder="Notas de sabor, aroma, harmonização..." />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
