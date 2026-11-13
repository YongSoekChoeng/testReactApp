import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PageTitle from '@/components/PageTitle'
import * as boardService from '@/services/boardService'
import type { Board } from '@/types'

// 새 글(/sample/boards/new)과 고치기(/sample/boards/:seq/edit)를 같이 맡는다.
export default function BoardFormPage() {
  const { seq } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Board>({ title: '', writerNm: '', content: '' })

  useEffect(() => {
    if (seq) {
      boardService.fetchBoard(seq).then((b) => setForm({ title: b.title, writerNm: b.writerNm, content: b.content }))
    }
  }, [seq])

  async function onSave() {
    try {
      if (seq) {
        await boardService.updateBoard(seq, form)
        navigate(`/sample/boards/${seq}`)
      } else {
        const newSeq = await boardService.createBoard(form)
        navigate(`/sample/boards/${newSeq}`)
      }
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div>
      <PageTitle title={seq ? '게시글 고치기' : '게시글 쓰기'}>
        <button className="btn" onClick={() => navigate(-1)}>취소</button>
        <button className="btn primary" onClick={onSave}>저장</button>
      </PageTitle>
      <section className="panel">
        <label className="full">제목 <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className="full">작성자 <input value={form.writerNm ?? ''} placeholder="비우면 로그인한 사람"
          onChange={(e) => setForm({ ...form, writerNm: e.target.value })} /></label>
        <label className="full">내용 <textarea rows={12} value={form.content ?? ''}
          onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
      </section>
    </div>
  )
}
