import { useEffect, useState } from 'react'
import { codeService } from '@/services/codeService'
import type { Code } from '@/types'

// 콤보 상자에 넣을 공통코드. 예: const useYnCodes = useCommonCode('USE_YN')
export function useCommonCode(grpCmmCd: string): Code[] {
  const [codes, setCodes] = useState<Code[]>([])
  useEffect(() => {
    codeService.commonCodes(grpCmmCd).then(setCodes)
  }, [grpCmmCd])
  return codes
}
