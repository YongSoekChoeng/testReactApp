import { useCallback, useEffect, useState } from 'react'
import { fetchBoards } from '@/services/boardService'
import type { Board } from '@/types'

// 게시글 목록과 다시 읽기. 목록 화면이 쓴다.
export function useBoardList() {
  const [boards, setBoards] = useState<Board[]>([])
  const [title, setTitle] = useState('')

  const reload = useCallback(async () => {
    setBoards(await fetchBoards(title))
  }, [title])

  useEffect(() => {
    reload()
    // 처음 한 번만 읽는다. 다시 읽기는 조회 버튼으로.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { boards, title, setTitle, reload }
}
