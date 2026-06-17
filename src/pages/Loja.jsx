import { useState, useMemo } from 'react'
import { KEYS, load, save, uid, brl } from '../utils/storage.js'
import { LINHAS } from '../data/linhas.js'
import { useAuth } from '../context/AuthContext.jsx'

const hoje = () => new Date().toISOString().slice(0, 10)

export default function Loja() {
  const { user } = useAuth()

  const cervejas = useMemo(() => load(KEYS.cervejas), [])
  const estilos  = useMemo(() => load(KEYS.estilos),  [])

  const [carrinho, setCarrinho] = useState([])   // [{ cervejaId, nome, preco, linha, estiloNome, quantidade }]
  const [pedidoFeito, setPedidoFeito] = useState(false)

  /* ── helpers ── */
  const nomeEstilo = (estiloId) => estilos.find((e) => e.id === estiloId)?.nome || '—'

  const itemNoCarrinho = (cervejaId) => carrinho.find((i) => i.cervejaId === cervejaId)

  function addToCarrinho(cerveja) {
    const existente = itemNoCarrinho(cerveja.id)
    if (existente) {
      setCarrinho(carrinho.map((i) =>
        i.cervejaId === cerveja.id ? { ...i, quantidade: i.quantidade + 1 } : i
      ))
    } else {
      setCarrinho([...carrinho, {
        cervejaId:  cerveja.id,
        nome:       cerveja.nome,
        preco:      cerveja.preco,
        linha:      cerveja.linha,
        estiloNome: nomeEstilo(cerveja.estiloId),
        quantidade: 1,
      }])
    }
  }

  function atualizarQty(cervejaId, novaQty) {
    if (novaQty <= 0) {
      setCarrinho(carrinho.filter((i) => i.cervejaId !== cervejaId))
    } else {
      setCarrinho(carrinho.map((i) =>
        i.cervejaId === cervejaId ? { ...i, quantidade: novaQty } : i
      ))
    }
  }

  function finalizarPedido() {
    if (!carrinho.length) return
    const pedidosExistentes = load(KEYS.pedidos)
    const novosPedidos = carrinho.map((item) => ({
      id:         uid(),
      clienteId:  user.clienteId,
      cervejaId:  item.cervejaId,
      quantidade: item.quantidade,
      data:       hoje(),
    }))
    save(KEYS.pedidos, [...pedidosExistentes, ...novosPedidos])
    setCarrinho([])
    setPedidoFeito(true)
  }

  const totalCarrinho = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const totalItens    = carrinho.reduce((s, i) => s + i.quantidade, 0)

  /* ── Confirmação de pedido ── */
  if (pedidoFeito) {
    return (
      <main className="page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
          <div className="pedido-confirmado">
            <div className="confirmado-icone">✓</div>
            <h2>Pedido realizado!</h2>
            <p>Seu pedido foi registrado com sucesso. Em breve entraremos em contato.</p>
            <button className="btn btn-gold" onClick={() => setPedidoFeito(false)}>
              Fazer novo pedido
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow">Loja · MARS BEER</p>
            <h1 className="page-title">Nossas Cervejas</h1>
            <p className="page-sub">Escolha suas favoritas e finalize o pedido.</p>
          </div>
        </div>

        {cervejas.length === 0 ? (
          <div className="empty">
            <strong>Nenhuma cerveja disponível</strong>
            Aguarde o administrador cadastrar os produtos.
          </div>
        ) : (
          <div className="loja-wrap">
            {/* ── Grade de cervejas ── */}
            <div className="loja-grade">
              {cervejas.map((cerveja) => {
                const item    = itemNoCarrinho(cerveja.id)
                const corLinha = LINHAS[cerveja.linha]?.cor || '#999'
                const imgLinha = LINHAS[cerveja.linha]?.img

                return (
                  <div className="loja-card" key={cerveja.id}>
                    {/* Shot da garrafa */}
                    <div
                      className="loja-card-shot"
                      style={{ background: `radial-gradient(circle at 50% 90%, ${corLinha}28 0%, transparent 65%)` }}
                    >
                      {imgLinha && (
                        <img src={imgLinha} alt={cerveja.nome} />
                      )}
                    </div>

                    <div className="loja-card-body">
                      <div className="loja-card-header">
                        <span className="badge" style={{ borderColor: `${corLinha}44` }}>
                          <span className="dot" style={{ background: corLinha }} />
                          {cerveja.linha}
                        </span>
                        <span className="badge">{nomeEstilo(cerveja.estiloId)}</span>
                      </div>

                      <h3 className="loja-card-nome">{cerveja.nome}</h3>
                      {cerveja.descricao && (
                        <p className="loja-card-desc">{cerveja.descricao}</p>
                      )}

                      <div className="loja-card-footer">
                        <div className="loja-preco">
                          <span className="loja-preco-valor">{brl(cerveja.preco)}</span>
                          <span className="loja-teor">{cerveja.teor}% alc.</span>
                        </div>

                        {item ? (
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => atualizarQty(cerveja.id, item.quantidade - 1)}>−</button>
                            <span className="qty-valor">{item.quantidade}</span>
                            <button className="qty-btn" onClick={() => atualizarQty(cerveja.id, item.quantidade + 1)}>+</button>
                          </div>
                        ) : (
                          <button className="btn btn-gold btn-sm" onClick={() => addToCarrinho(cerveja)}>
                            + Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Painel do carrinho ── */}
            <aside className="carrinho-panel">
              <div className="carrinho-titulo">
                <span>Seu pedido</span>
                {totalItens > 0 && (
                  <span className="carrinho-badge">{totalItens}</span>
                )}
              </div>

              {carrinho.length === 0 ? (
                <div className="carrinho-vazio">
                  <div className="carrinho-vazio-icone">🍺</div>
                  <p>Nenhuma cerveja adicionada ainda.</p>
                </div>
              ) : (
                <>
                  <div className="carrinho-itens">
                    {carrinho.map((item) => (
                      <div className="carrinho-item" key={item.cervejaId}>
                        <div className="carrinho-item-info">
                          <span className="carrinho-item-nome">{item.nome}</span>
                          <span className="carrinho-item-sub">{item.estiloNome} · {item.linha}</span>
                        </div>
                        <div className="carrinho-item-direita">
                          <div className="qty-control qty-control-sm">
                            <button className="qty-btn qty-btn-sm" onClick={() => atualizarQty(item.cervejaId, item.quantidade - 1)}>−</button>
                            <span className="qty-valor">{item.quantidade}</span>
                            <button className="qty-btn qty-btn-sm" onClick={() => atualizarQty(item.cervejaId, item.quantidade + 1)}>+</button>
                          </div>
                          <span className="carrinho-item-total">{brl(item.preco * item.quantidade)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="carrinho-rodape">
                    <div className="carrinho-total">
                      <span>Total</span>
                      <span className="carrinho-total-valor">{brl(totalCarrinho)}</span>
                    </div>
                    <button className="btn btn-gold btn-block" onClick={finalizarPedido}>
                      Finalizar pedido
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
