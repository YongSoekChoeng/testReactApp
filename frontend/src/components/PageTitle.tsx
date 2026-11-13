import type { ReactNode } from 'react'

// 화면 제목과 오른쪽 버튼 자리
export default function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      <div className="actions">{children}</div>
    </div>
  )
}
