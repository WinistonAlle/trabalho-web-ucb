import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

/**
 * Layout — moldura comum das paginas autenticadas:
 * Navbar no topo, conteudo da rota (<Outlet />) e Footer.
 */
export default function Layout() {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
