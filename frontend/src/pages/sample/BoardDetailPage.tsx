import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import PageTitle from '@/components/PageTitle'
import { deleteBoard, fetchBoard } from '@/services/boardService'
import type { Board } from '@/types'

export default function BoardDetailPage() {
  const { seq = '' } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board | null>(null)

  useEffect(() => {
    fetchBoard(seq)
      .then(setBoard)
      .catch((e: Error) => {
        alert(e.message)
        navigate('/sample/boards')
      })
  }, [seq, navigate])

  async function onDelete() {
    if (!confirm('이 글을 지울까요?')) {
      return
    }
    await deleteBoard(seq)
    navigate('/sample/boards')
  }

  if (!board) {
    return null
  }
  return (
    <div>
      <PageTitle title={board.title}>
        <Link className="btn" to="/sample/boards">목록</Link>
        <Link className="btn primary" to={`/sample/boards/${seq}/edit`}>고치기</Link>
        <button className="btn danger" onClick={onDelete}>삭제</button>
      </PageTitle>
      <p className="meta">{board.writerNm} · {board.inDtm}</p>
      <pre className="board-content">{board.content}</pre>
    </div>
  )
}
