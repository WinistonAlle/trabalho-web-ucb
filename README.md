# 🦁 MARS BEER — Site da Cervejaria Artesanal

Projeto acadêmico em **React + Vite** com **React Router**, autenticação simulada,
rotas protegidas e **3 CRUDs** (Cervejas, Clientes, Pedidos) + Relatório com JOIN
simulado em JavaScript. Tudo 100% frontend, dados persistidos em `localStorage`.

## ▶️ Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente http://localhost:5173).

Para gerar a build de produção:

```bash
npm run build
npm run preview
```

## 🔑 Login

Autenticação **simulada** (sem backend): qualquer **e-mail válido** + **senha com
4+ caracteres** entram. O usuário fica salvo no `localStorage` e o logout limpa a sessão.

## 🗺️ Rotas

| Rota          | Página       | Acesso     |
|---------------|--------------|------------|
| `/login`      | Login        | Público    |
| `/`           | Home         | Protegido  |
| `/cervejas`   | Cervejas (CRUD 1) | Protegido |
| `/clientes`   | Clientes (CRUD 2) | Protegido |
| `/pedidos`    | Pedidos (CRUD 3)  | Protegido |
| `/relatorio`  | Relatório (JOIN)  | Protegido |

Rotas protegidas usam `<ProtectedRoute>`, que redireciona para `/login` quando não
há usuário autenticado.

## 🧱 Estrutura de pastas

```
src/
├── main.jsx                  # entrada: BrowserRouter + AuthProvider
├── App.jsx                   # definição das rotas
├── index.css                 # sistema de design (cores, tipografia)
├── context/
│   └── AuthContext.jsx       # autenticação simulada (useState + localStorage)
├── utils/
│   └── storage.js            # helpers de localStorage + formatação
├── data/
│   └── linhas.js             # linhas/rótulos da marca + estilos
├── components/
│   ├── Layout.jsx            # Navbar + Outlet + Footer
│   ├── Navbar.jsx            # navegação + logout
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx    # guarda de rota
│   ├── DataTable.jsx         # tabela REUTILIZÁVEL pelos 3 CRUDs
│   └── Modal.jsx             # modal reutilizável dos formulários
└── pages/
    ├── Login.jsx
    ├── Home.jsx              # hero + sobre nós + destaques
    ├── Cervejas.jsx          # CRUD 1
    ├── Clientes.jsx          # CRUD 2
    ├── Pedidos.jsx           # CRUD 3 (relaciona clienteId + cervejaId)
    └── Relatorio.jsx         # JOIN simulado (map + find)
```

## ✅ Requisitos atendidos

- [x] React com `useState` para gerenciamento de estado
- [x] React Router para navegação entre páginas
- [x] Rotas protegidas (redireciona para login se não autenticado)
- [x] Logout funcional
- [x] Dados persistidos em `localStorage`
- [x] Cada CRUD em seu próprio componente/arquivo
- [x] Componente de listagem reutilizável (`DataTable`)
- [x] Relatório com JOIN simulado em JS (`map` + `find`)
- [x] Validação de campos obrigatórios nos formulários
- [x] 100% frontend, sem backend

## 🎨 Identidade visual

- **Verde musgo** `#4A5E3A` · **Dourado** `#C9A84C` · **Branco** `#FFFFFF`
- Títulos serifados (*Playfair Display*), corpo sans-serif (*Mulish*)
- Estilo rústico/premium com as imagens da marca MARS BEER

---

> Proibida a venda para menores de 18 anos. Beba com moderação.
