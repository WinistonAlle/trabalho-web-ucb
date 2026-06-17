import { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext — autenticacao simulada (sem backend).
 * O usuario logado e' guardado em estado (useState) e persistido
 * no localStorage para sobreviver a um refresh da pagina.
 */
const AuthContext = createContext(null)

const STORAGE_KEY = 'mb_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  // Sempre que o usuario mudar, sincroniza com o localStorage.
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Login simulado: qualquer e-mail valido autentica.
  const login = (email) => setUser({ email, since: Date.now() })

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook utilitario para consumir o contexto em qualquer componente.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
