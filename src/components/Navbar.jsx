import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/cervejas', label: 'Cervejas' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/relatorio', label: 'Relatório' },
  { to: '/catalogo',  label: 'Catálogo' },
]

/**
 * Navbar — navegacao principal (React Router NavLink) + logout.
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="crest">M</span>
          MARS&nbsp;<b>BEER</b>
        </NavLink>

        <div className="nav-links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-user">
          <span title={user?.email}>{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </nav>
  )
}
