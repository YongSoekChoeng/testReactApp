import { apiClient } from '@/lib/apiClient'
import type { Board } from '@/types'

// 샘플게시판 API
export const fetchBoards = (title: string) => apiClient.get<Board[]>('/sample/boards', { title })

export const fetchBoard = (seq: string) => apiClient.get<Board>(`/sample/boards/${seq}`)

export const createBoard = async (board: Board): Promise<number> => {
  const result = await apiClient.post<{ seq: number }>('/sample/boards', board)
  return result.seq
}

export const updateBoard = (seq: string, board: Board) => apiClient.put<void>(`/sample/boards/${seq}`, board)

export const deleteBoard = (seq: string) => apiClient.delete<void>(`/sample/boards/${seq}`)
