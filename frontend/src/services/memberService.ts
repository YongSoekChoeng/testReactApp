import { apiClient } from '@/lib/apiClient'
import type { Member } from '@/types'

// 회원사관리 화면의 API
export function fetchMembers(mbNm: string, useYn: string): Promise<Member[]> {
  return apiClient.get<Member[]>('/sys/members', { mbNm, useYn })
}

export function createMember(member: Member): Promise<void> {
  return apiClient.post<void>('/sys/members', member)
}

export function updateMember(member: Member): Promise<void> {
  return apiClient.put<void>('/sys/members/' + member.mbId, member)
}
