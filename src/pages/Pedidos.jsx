import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import { KEYS, load, save, uid, brl, dataBR } from '../utils/storage.js'

const hoje = () => new Date().toISOString().slice(0, 10)
const VAZIO = () => ({ clienteId: '', cervejaId: '', quantidade: 1, data: hoje() })

/**
 * Pedidos — CRUD 3.
 * Relaciona um cliente (clienteId) e uma cerveja (cervejaId) por meio
 * de <select>. Persiste em localStorage. O nome do cliente / cerveja
 * e' resolvido por .find() na hora de exibir.
 */
export default function Pedidos() {
  const [pedidos, setPedidos] = useState(() => load(KEYS.pedidos))
  const [clientes] = useState(() => load(KEYS.clientes))
  const [cervejas] = useState(() => load(KEYS.cervejas))

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VAZIO())
  const [errors, setErrors] = useState({})

  useEffect(() => { save(KEYS.pedidos, pedidos) }, [pedidos])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const acharCliente = (id) => clientes.find((c) => c.id === id)
  const acharCerveja = (id) => cervejas.find((c) => c.id === id)

  function abrirNovo() {
    setEditando(null)
    setForm(VAZIO())
    setErrors({})
    setModalAberto(true)
  }

  function abrirEdicao(p) {
    setEditando(p.id)
    setForm({ ...p })
    setErrors({})
    setModalAberto(true)
  }

  function validar() {
    const err = {}
    if (!form.clienteId) err.clienteId = 'Selecione o cliente.'
    if (!form.cervejaId) err.cervejaId = 'Selecione a cerveja.'
    if (!form.quantidade || Number(form.quantidade) <= 0) err.quantidade = 'Quantidade inválida.'
    if (!form.data) err.data = 'Informe a data.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function salvar(e) {
    e.preventDefault()
    if (!validar()) return
    const dados = {
      clienteId: form.clienteId,
      cervejaId: form.cervejaId,
      quantidade: Number(form.quantidade),
      data: form.data,
    }
    if (editando) {
      setPedidos(pedidos.map((p) => (p.id === editando ? { ...p, ...dados } : p)))
    } else {
      setPedidos([...pedidos, { id: uid(), ...dados }])
    }
    setModalAberto(false)
  }

  function excluir(p) {
    if (window.confirm('Excluir este pedido?')) {
      setPedidos(pedidos.filter((x) => x.id !== p.id))
    }
  }

  const semCadastros = clientes.length === 0 || cervejas.length === 0

  const columns = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (p) => <span className="t-strong">{acharCliente(p.clienteId)?.nome || '— removido —'}</span>,
    },
    { key: 'cerveja', label: 'Cerveja', render: (p) => acharCerveja(p.cervejaId)?.nome || '— removida —' },
    { key: 'quantidade', label: 'Qtd', render: (p) => <span className="t-mono">{p.quantidade}</span> },
    {
      key: 'total',
      label: 'Total',
      render: (p) => <span className="t-mono">{brl((acharCerveja(p.cervejaId)?.preco || 0) * p.quantidade)}</span>,
    },
    { key: 'data', label: 'Data', render: (p) => <span className="t-mono">{dataBR(p.data)}</span> },
  ]

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow">CRUD · Vendas</p>
            <h1 className="page-title">Pedidos</h1>
            <p className="page-sub">Registre pedidos relacionando cliente e cerveja.</p>
          </div>
          <button className="btn btn-primary" onClick={abrirNovo} disabled={semCadastros}>+ Novo pedido</button>
        </div>

        {semCadastros && (
          <div className="empty" style={{ marginBottom: 24 }}>
            <strong>Cadastre clientes e cervejas primeiro</strong>
            Um pedido precisa de ao menos um cliente e uma cerveja cadastrados.
          </div>
        )}

        <DataTable
          columns={columns}
          rows={pedidos}
          empty={{ titulo: 'Nenhum pedido registrado', texto: 'Clique em "Novo pedido" para registrar o primeiro.' }}
          actions={(p) => (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => abrirEdicao(p)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => excluir(p)}>Excluir</button>
            </>
          )}
        />
      </div>

      {modalAberto && (
        <Modal
          title={editando ? 'Editar pedido' : 'Novo pedido'}
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
              <div className={'field full' + (errors.clienteId ? ' invalid' : '')}>
                <label>Cliente</label>
                <select value={form.clienteId} onChange={set('clienteId')}>
                  <option value="">Selecione um cliente...</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                {errors.clienteId && <span className="field-error">{errors.clienteId}</span>}
              </div>

              <div className={'field full' + (errors.cervejaId ? ' invalid' : '')}>
                <label>Cerveja</label>
                <select value={form.cervejaId} onChange={set('cervejaId')}>
                  <option value="">Selecione uma cerveja...</option>
                  {cervejas.map((c) => <option key={c.id} value={c.id}>{c.nome} — {brl(c.preco)}</option>)}
                </select>
                {errors.cervejaId && <span className="field-error">{errors.cervejaId}</span>}
              </div>

              <div className={'field' + (errors.quantidade ? ' invalid' : '')}>
                <label>Quantidade</label>
                <input type="number" min="1" value={form.quantidade} onChange={set('quantidade')} />
                {errors.quantidade && <span className="field-error">{errors.quantidade}</span>}
              </div>

              <div className={'field' + (errors.data ? ' invalid' : '')}>
                <label>Data</label>
                <input type="date" value={form.data} onChange={set('data')} />
                {errors.data && <span className="field-error">{errors.data}</span>}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
