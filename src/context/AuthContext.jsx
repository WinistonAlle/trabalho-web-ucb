import { createContext, useContext, useState, useEffect } from 'react'
import { KEYS, load, save, uid } from '../utils/storage.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'mb_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  function login(email, role = 'admin') {
    let clienteId = null

    if (role === 'cliente') {
      // Auto-cria registro de cliente se ainda não existir para este e-mail
      const clientes = load(KEYS.clientes)
      let cliente = clientes.find((c) => c.email === email)
      if (!cliente) {
        cliente = {
          id: uid(),
          nome: email.split('@')[0],
          email,
          telefone: '',
          cidade: '',
        }
        save(KEYS.clientes, [...clientes, cliente])
      }
      clienteId = cliente.id
    }

    setUser({ email, role, clienteId, since: Date.now() })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuth:    !!user,
      isAdmin:   user?.role === 'admin',
      isCliente: user?.role === 'cliente',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
