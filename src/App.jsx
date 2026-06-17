import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Cervejas from './pages/Cervejas.jsx'
import Clientes from './pages/Clientes.jsx'
import Pedidos from './pages/Pedidos.jsx'
import Relatorio from './pages/Relatorio.jsx'
import Catalogo from './pages/Catalogo.jsx'

/**
 * App — define todas as rotas da aplicacao.
 * /login e' publica. As demais ficam dentro de <ProtectedRoute>,
 * que redireciona para /login quando nao ha usuario autenticado.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas — compartilham o Layout (Navbar + Footer) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/cervejas" element={<Cervejas />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/relatorio" element={<Relatorio />} />
        <Route path="/catalogo"  element={<Catalogo />} />
      </Route>

      {/* Qualquer rota desconhecida volta para a Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
