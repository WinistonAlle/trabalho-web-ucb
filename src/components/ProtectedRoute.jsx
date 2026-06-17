import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * ProtectedRoute — bloqueia o acesso a paginas internas.
 * Se nao houver usuario autenticado, redireciona para /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth()
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}
