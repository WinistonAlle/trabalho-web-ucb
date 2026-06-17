import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import { KEYS, load, save, uid } from '../utils/storage.js'

const VAZIO = { nome: '', email: '', telefone: '', cidade: '' }

/**
 * Clientes — CRUD 2.
 * Mesmo padrao da pagina de Cervejas, reutilizando os componentes
 * DataTable e Modal. Persiste em localStorage.
 */
export default function Clientes() {
  const [itens, setItens] = useState(() => load(KEYS.clientes))
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VAZIO)
  const [errors, setErrors] = useState({})

  useEffect(() => { save(KEYS.clientes, itens) }, [itens])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  function abrirNovo() {
    setEditando(null)
    setForm(VAZIO)
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
    if (!form.email.trim()) err.email = 'Informe o e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'E-mail inválido.'
    if (!form.telefone.trim()) err.telefone = 'Informe o telefone.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function salvar(e) {
    e.preventDefault()
    if (!validar()) return
    const dados = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim(),
      cidade: form.cidade.trim(),
    }
    if (editando) {
      setItens(itens.map((i) => (i.id === editando ? { ...i, ...dados } : i)))
    } else {
      setItens([...itens, { id: uid(), ...dados }])
    }
    setModalAberto(false)
  }

  function excluir(item) {
    if (window.confirm(`Excluir o cliente "${item.nome}"?`)) {
      setItens(itens.filter((i) => i.id !== item.id))
    }
  }

  const filtrados = itens.filter((i) =>
    (i.nome + i.email + i.cidade).toLowerCase().includes(busca.toLowerCase())
  )

  const columns = [
    { key: 'nome', label: 'Cliente', render: (r) => <span className="t-strong">{r.nome}</span> },
    { key: 'email', label: 'E-mail' },
    { key: 'telefone', label: 'Telefone', render: (r) => <span className="t-mono">{r.telefone}</span> },
    { key: 'cidade', label: 'Cidade', render: (r) => r.cidade || '—' },
  ]

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow">CRUD · Pessoas</p>
            <h1 className="page-title">Clientes</h1>
            <p className="page-sub">Cadastro de clientes da cervejaria.</p>
          </div>
          <button className="btn btn-primary" onClick={abrirNovo}>+ Novo cliente</button>
        </div>

        <div className="toolbar">
          <div className="search">
            <input placeholder="Buscar por nome, e-mail ou cidade..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <span className="count-pill">{filtrados.length} de {itens.length} registro(s)</span>
        </div>

        <DataTable
          columns={columns}
          rows={filtrados}
          empty={{ titulo: 'Nenhum cliente cadastrado', texto: 'Clique em "Novo cliente" para adicionar o primeiro.' }}
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
          title={editando ? 'Editar cliente' : 'Novo cliente'}
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
                <label>Nome completo</label>
                <input value={form.nome} onChange={set('nome')} placeholder="Ex.: Maria Silva" />
                {errors.nome && <span className="field-error">{errors.nome}</span>}
              </div>

              <div className={'field' + (errors.email ? ' invalid' : '')}>
                <label>E-mail</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="maria@email.com" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className={'field' + (errors.telefone ? ' invalid' : '')}>
                <label>Telefone</label>
                <input value={form.telefone} onChange={set('telefone')} placeholder="(11) 99999-0000" />
                {errors.telefone && <span className="field-error">{errors.telefone}</span>}
              </div>

              <div className="field full">
                <label>Cidade (opcional)</label>
                <input value={form.cidade} onChange={set('cidade')} placeholder="São Paulo" />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
