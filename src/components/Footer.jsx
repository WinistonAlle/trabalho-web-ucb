/**
 * Footer — rodape institucional.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand" style={{ color: '#fff' }}>
          <span className="crest">M</span>
          MARS&nbsp;<b style={{ color: 'var(--dourado)' }}>BEER</b>
        </div>
        <small>Cervejaria Artesanal · Proibida a venda para menores de 18 anos · Beba com moderação</small>
        <small>© {new Date().getFullYear()} MARS BEER</small>
      </div>
    </footer>
  )
}
