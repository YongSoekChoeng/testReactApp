import { Link, useNavigate } from 'react-router'
import PageTitle from '@/components/PageTitle'
import DataGrid, { type Column } from '@/components/DataGrid'
import { useBoardList } from '@/hooks/useBoardList'
import type { Board } from '@/types'

export default function BoardListPage() {
  const navigate = useNavigate()
  const { boards, title, setTitle, reload } = useBoardList()

  const columns: Column<Board>[] = [
    { key: 'seq', label: '번호', width: '10%' },
    { key: 'title', label: '제목', render: (row) => <Link to={`/sample/boards/${row.seq}`}>{row.title}</Link> },
    { key: 'writerNm', label: '작성자', width: '15%' },
    { key: 'inDtm', label: '작성일시', width: '20%' }
  ]

  return (
    <div>
      <PageTitle title="샘플게시판">
        <input value={title} placeholder="제목" onChange={(e) => setTitle(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && reload()} />
        <button className="btn" onClick={reload}>조회</button>
        <Link className="btn primary" to="/sample/boards/new">글쓰기</Link>
      </PageTitle>
      <DataGrid columns={columns} rows={boards} rowKey="seq" onSelect={(row) => navigate(`/sample/boards/${row.seq}`)} />
    </div>
  )
}
