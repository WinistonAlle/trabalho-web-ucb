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
import Loja from './pages/Loja.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        {/* Pública */}
        <Route path="/" element={<Home />} />

        {/* Somente admin */}
        <Route path="/cervejas"  element={<ProtectedRoute role="admin"><Cervejas /></ProtectedRoute>} />
        <Route path="/clientes"  element={<ProtectedRoute role="admin"><Clientes /></ProtectedRoute>} />
        <Route path="/pedidos"   element={<ProtectedRoute role="admin"><Pedidos /></ProtectedRoute>} />
        <Route path="/relatorio" element={<ProtectedRoute role="admin"><Relatorio /></ProtectedRoute>} />
        <Route path="/catalogo"  element={<ProtectedRoute role="admin"><Catalogo /></ProtectedRoute>} />

        {/* Somente cliente */}
        <Route path="/loja" element={<ProtectedRoute role="cliente"><Loja /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
