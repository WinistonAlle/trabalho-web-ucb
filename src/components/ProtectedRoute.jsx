import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * ProtectedRoute — bloqueia acesso por autenticação e opcionalmente por papel.
 * role="admin"   → só admins passam; clientes são mandados para /loja
 * role="cliente" → só clientes passam; admins são mandados para /
 * sem role       → qualquer usuário autenticado passa
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuth, user } = useAuth()

  if (!isAuth) return <Navigate to="/login" replace />

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'cliente' ? '/loja' : '/'} replace />
  }

  return children
}
