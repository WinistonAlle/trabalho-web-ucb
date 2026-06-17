/**
 * DataTable — componente de listagem REUTILIZAVEL pelos tres CRUDs.
 *
 * props:
 *  - columns: [{ key, label, render?(row) }]
 *  - rows:    array de objetos (cada um precisa de .id)
 *  - actions: (row) => JSX  (botoes de editar/excluir, opcional)
 *  - empty:   { titulo, texto } exibido quando nao ha linhas
 */
export default function DataTable({ columns, rows, actions, empty }) {
  if (!rows.length) {
    return (
      <div className="empty">
        <strong>{empty?.titulo || 'Nenhum registro'}</strong>
        {empty?.texto || 'Cadastre o primeiro item para começar.'}
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {actions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
              {actions && <td className="actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
