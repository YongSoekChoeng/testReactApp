import { apiClient } from '@/lib/apiClient'
import type { Code, CodeGroup } from '@/types'

// 공통코드관리 화면의 API. 그룹 아래 코드는 /sys/code-groups/{그룹코드}/codes
const enc = encodeURIComponent

export const codeService = {
  listGroups(keyword?: string) {
    return apiClient.get<CodeGroup[]>('/sys/code-groups', { keyword })
  },
  createGroup(group: CodeGroup) {
    return apiClient.post<void>('/sys/code-groups', group)
  },
  updateGroup(group: CodeGroup) {
    return apiClient.put<void>(`/sys/code-groups/${enc(group.grpCmmCd)}`, group)
  },
  deleteGroup(grpCmmCd: string) {
    return apiClient.delete<void>(`/sys/code-groups/${enc(grpCmmCd)}`)
  },
  listCodes(grpCmmCd: string) {
    return apiClient.get<Code[]>(`/sys/code-groups/${enc(grpCmmCd)}/codes`)
  },
  createCode(grpCmmCd: string, code: Code) {
    return apiClient.post<void>(`/sys/code-groups/${enc(grpCmmCd)}/codes`, code)
  },
  updateCode(grpCmmCd: string, code: Code) {
    return apiClient.put<void>(`/sys/code-groups/${enc(grpCmmCd)}/codes/${enc(code.cdVl)}`, code)
  },
  deleteCode(grpCmmCd: string, cdVl: string) {
    return apiClient.delete<void>(`/sys/code-groups/${enc(grpCmmCd)}/codes/${enc(cdVl)}`)
  },
  // 콤보 상자용(사용 중인 코드만)
  commonCodes(grpCmmCd: string) {
    return apiClient.get<Code[]>('/common/codes/' + grpCmmCd)
  }
}
