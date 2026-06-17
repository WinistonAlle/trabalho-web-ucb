import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import trio from '../assets/trio.png'

/**
 * Login — autenticacao simulada.
 * Valida campos obrigatorios e formato de e-mail. Qualquer
 * e-mail/senha validos autenticam (sem backend).
 */
export default function Login() {
  const { login, isAuth } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})

  // Se ja estiver logado, nao mostra o login.
  if (isAuth) return <Navigate to="/" replace />

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  function validar() {
    const err = {}
    if (!form.email.trim()) err.email = 'Informe o e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'E-mail inválido.'
    if (!form.senha) err.senha = 'Informe a senha.'
    else if (form.senha.length < 4) err.senha = 'A senha deve ter ao menos 4 caracteres.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) return
    login(form.email.trim())
    navigate('/', { replace: true })
  }

  return (
    <div className="login-wrap">
      <aside className="login-aside">
        <span className="crest-lg">M</span>
        <div>
          <span className="tag">Cervejaria Artesanal</span>
          <h1>MARS <b>BEER</b></h1>
          <p>Da fermentação à taça, cada lote carrega a força do leão. Entre no painel e gerencie a operação.</p>
        </div>
        <img className="bottles" src={trio} alt="Garrafas MARS BEER" />
      </aside>

      <div className="login-panel">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Acessar painel</h2>
          <p className="muted">Entre com suas credenciais para continuar.</p>

          <div className={'field' + (errors.email ? ' invalid' : '')}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="voce@marsbeer.com"
              value={form.email}
              onChange={set('email')}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={'field' + (errors.senha ? ' invalid' : '')}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={set('senha')}
            />
            {errors.senha && <span className="field-error">{errors.senha}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block">Entrar</button>
          <p className="login-hint">Acesso simulado — qualquer e-mail e senha válidos entram.</p>
        </form>
      </div>
    </div>
  )
}
