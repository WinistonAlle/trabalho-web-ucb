import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LINHAS, LINHA_NOMES } from '../data/linhas.js'
import trio from '../assets/trio.png'
import duoGreen from '../assets/duo-green.png'

export default function Home() {
  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visivel')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Cervejaria Artesanal · Desde 2018</p>
            <h1>A força do<br /><b>leão</b> em cada gole.</h1>
            <p>
              Cervejas artesanais de caráter, fermentadas em pequenos lotes
              com ingredientes selecionados. Conheça as linhas que rugem.
            </p>
            <div className="hero-cta">
              <a href="#linhas" className="btn btn-gold">Ver as cervejas</a>
              <Link
                to="/pedidos"
                className="btn btn-ghost"
                style={{ color: 'var(--creme)', borderColor: 'rgba(255,255,255,.18)' }}
              >
                Fazer um pedido
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <img src={trio} alt="Linha completa MARS BEER" />
          </div>
        </div>
      </section>

      {/* ── SOBRE NÓS ── */}
      <section className="section about">
        <div className="container about-grid">
          <div className="about-img reveal">
            <img src={duoGreen} alt="Garrafas MARS BEER FLOREST" />
          </div>
          <div className="about-text reveal reveal-d2">
            <p className="page-eyebrow">Sobre nós</p>
            <h2>Artesanal de verdade,<br />do grão à taça.</h2>
            <p>
              A MARS BEER nasceu da obsessão por sabor. Brassamos em pequenos lotes,
              controlando cada etapa — maltagem, fervura, lupulagem e maturação —
              para entregar cervejas com personalidade e consistência.
            </p>
            <p>
              Nosso leão é símbolo de coragem: a coragem de fugir do óbvio
              e criar rótulos que contam histórias.
            </p>
            <div className="about-stats">
              <div className="reveal reveal-d1">
                <div className="n">3</div>
                <div className="l">Linhas autorais</div>
              </div>
              <div className="reveal reveal-d2">
                <div className="n">100%</div>
                <div className="l">Produção artesanal</div>
              </div>
              <div className="reveal reveal-d3">
                <div className="n">∞</div>
                <div className="l">Paixão por cerveja</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTAQUES ── */}
      <section className="section" id="linhas">
        <div className="container">
          <p className="section-eyebrow reveal">Nossas cervejas</p>
          <h2 className="section-title reveal reveal-d1">Três linhas, um só rugido</h2>
          <p className="section-lead reveal reveal-d2">
            Cada rótulo tem perfil próprio. Escolha o seu humor e deixe o leão guiar.
          </p>

          <div className="beers-grid">
            {LINHA_NOMES.map((nome, i) => {
              const linha = LINHAS[nome]
              const delays = ['', 'reveal-d1', 'reveal-d2']
              return (
                <article className={`beer-card reveal ${delays[i]}`} key={nome}>
                  <div
                    className="shot"
                    style={{
                      background: `radial-gradient(circle at 50% 90%, ${linha.cor}28 0%, transparent 65%)`
                    }}
                  >
                    <img src={linha.img} alt={`MARS BEER ${nome}`} />
                  </div>
                  <div className="body">
                    <span className="line-tag" style={{ color: linha.cor }}>{nome}</span>
                    <h3>{linha.estilo}</h3>
                    <p>{linha.desc}</p>
                    <div className="meta">
                      <span><small>Estilo</small>{linha.estilo}</span>
                      <span><small>Rótulo</small>{nome}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
