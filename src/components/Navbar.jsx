import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const LINKS_ADMIN = [
  { to: '/cervejas',  label: 'Cervejas' },
  { to: '/clientes',  label: 'Clientes' },
  { to: '/pedidos',   label: 'Pedidos' },
  { to: '/relatorio', label: 'Relatório' },
  { to: '/catalogo',  label: 'Catálogo' },
]

const LINKS_CLIENTE = [
  { to: '/loja', label: 'Loja' },
]

export default function Navbar() {
  const { user, logout, isAuth, isAdmin, isCliente } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const links = isAdmin ? LINKS_ADMIN : isCliente ? LINKS_CLIENTE : []

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="crest">M</span>
          MARS&nbsp;<b>BEER</b>
        </NavLink>

        <div className="nav-links">
          {isAuth && links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-user">
          {isAuth ? (
            <>
              <span title={user?.email}>
                {isAdmin ? '⚙ Admin' : user?.email}
              </span>
              <button className="btn-logout" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <NavLink to="/login" className="btn-logout" style={{ textDecoration: 'none' }}>
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
