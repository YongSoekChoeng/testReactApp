import type { ReactNode } from 'react'

// 단순한 목록 표. 행을 누르면 onSelect 를 부른다. 칸 모양은 column.render 로 바꿀 수 있다.
export interface Column<T> {
  key: keyof T & string
  label: string
  width?: string
  render?: (row: T) => ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey?: keyof T & string
  selected?: T | null
  onSelect?: (row: T) => void
}

export default function DataGrid<T>({ columns, rows, rowKey, selected, onSelect }: Props<T>) {
  return (
    <table className="grid">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ width: col.width }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="empty">
              자료가 없습니다.
            </td>
          </tr>
        )}
        {rows.map((row, i) => (
          <tr
            key={rowKey ? String(row[rowKey]) : i}
            className={selected === row ? 'selected' : undefined}
            onClick={() => onSelect && onSelect(row)}
          >
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
