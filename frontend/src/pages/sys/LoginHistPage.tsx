import { useEffect, useState } from 'react'
import PageTitle from '@/components/PageTitle'
import DataGrid, { type Column } from '@/components/DataGrid'
import type { LoginHist } from '@/types'

// 로그인이력. 이 화면은 서비스 모듈을 거치지 않고 fetch 로 바로 부른다.
const columns: Column<LoginHist>[] = [
  { key: 'loginDtm', label: '로그인 일시', width: '22%' },
  { key: 'mbId', label: '회원사', width: '12%' },
  { key: 'loginId', label: '로그인ID', width: '18%' },
  { key: 'empNm', label: '이름' },
  { key: 'loginIp', label: 'IP', width: '18%' }
]

const today = new Date().toISOString().slice(0, 10)

export default function LoginHistPage() {
  const [fromYmd, setFromYmd] = useState(today.slice(0, 8) + '01')
  const [toYmd, setToYmd] = useState(today)
  const [loginId, setLoginId] = useState('')
  const [rows, setRows] = useState<LoginHist[]>([])

  async function search() {
    const qs = new URLSearchParams({
      fromYmd: fromYmd.replaceAll('-', ''),
      toYmd: toYmd.replaceAll('-', ''),
      loginId
    })
    const res = await fetch('/api/sys/login-hists?' + qs.toString())
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    setRows(await res.json())
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <PageTitle title="로그인이력">
        <input type="date" value={fromYmd} onChange={(e) => setFromYmd(e.target.value)} />
        ~
        <input type="date" value={toYmd} onChange={(e) => setToYmd(e.target.value)} />
        <input value={loginId} placeholder="로그인ID" onChange={(e) => setLoginId(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && search()} />
        <button className="btn" onClick={search}>조회</button>
      </PageTitle>
      <p className="count">{rows.length}건 (최근 500건까지)</p>
      <DataGrid columns={columns} rows={rows} />
    </div>
  )
}
