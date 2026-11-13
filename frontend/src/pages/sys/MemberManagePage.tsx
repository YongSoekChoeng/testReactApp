import { useEffect, useState } from 'react'
import PageTitle from '@/components/PageTitle'
import DataGrid, { type Column } from '@/components/DataGrid'
import { createMember, fetchMembers, updateMember } from '@/services/memberService'
import { useCommonCode } from '@/hooks/useCommonCode'
import type { Member } from '@/types'

// 회원사관리. 회원사는 지우지 않고 사용여부만 바꾼다.
const columns: Column<Member>[] = [
  { key: 'mbId', label: '회원사ID', width: '12%' },
  { key: 'mbNm', label: '회원사명' },
  { key: 'representNm', label: '대표자', width: '12%' },
  { key: 'telno', label: '전화번호', width: '15%' },
  { key: 'contFrymd', label: '계약시작', width: '12%' },
  { key: 'contToymd', label: '계약종료', width: '12%' },
  { key: 'useYn', label: '사용', width: '8%' }
]
const emptyMember = (): Member => ({
  mbId: '', mbNm: '', representNm: '', telno: '', contFrymd: '', contToymd: '', useYn: 'Y', memo: ''
})

export default function MemberManagePage() {
  const useYnCodes = useCommonCode('USE_YN')
  const [mbNm, setMbNm] = useState('')
  const [useYn, setUseYn] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [selected, setSelected] = useState<Member | null>(null)
  const [form, setForm] = useState<Member>(emptyMember())

  async function search() {
    setMembers(await fetchMembers(mbNm, useYn))
    setSelected(null)
    setForm(emptyMember())
  }

  async function onSave() {
    try {
      if (selected) {
        await updateMember(form)
      } else {
        await createMember(form)
      }
      alert('저장했습니다.')
      await search()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 입력 칸 하나를 만든다
  const field = (key: keyof Member, label: string, placeholder?: string) => (
    <label>
      {label}{' '}
      <input value={form[key] ?? ''} placeholder={placeholder} disabled={key === 'mbId' && !!selected}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </label>
  )

  return (
    <div>
      <PageTitle title="회원사관리">
        <input value={mbNm} placeholder="회원사명" onChange={(e) => setMbNm(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && search()} />
        <select value={useYn} onChange={(e) => setUseYn(e.target.value)}>
          <option value="">전체</option>
          {useYnCodes.map((c) => <option key={c.cdVl} value={c.cdVl}>{c.cdVlNm}</option>)}
        </select>
        <button className="btn" onClick={search}>조회</button>
      </PageTitle>

      <DataGrid columns={columns} rows={members} rowKey="mbId" selected={selected}
        onSelect={(row) => { setSelected(row); setForm({ ...row }) }} />

      <section className="panel">
        <div className="form-grid">
          {field('mbId', '회원사ID')}
          {field('mbNm', '회원사명')}
          {field('representNm', '대표자')}
          {field('telno', '전화번호')}
          {field('contFrymd', '계약시작일', 'yyyyMMdd')}
          {field('contToymd', '계약종료일', 'yyyyMMdd')}
          <label>사용여부
            <select value={form.useYn} onChange={(e) => setForm({ ...form, useYn: e.target.value })}>
              {useYnCodes.map((c) => <option key={c.cdVl} value={c.cdVl}>{c.cdVlNm}</option>)}
            </select>
          </label>
          {field('memo', '메모')}
        </div>
        <div className="buttons">
          <button className="btn" onClick={() => { setSelected(null); setForm(emptyMember()) }}>신규</button>
          <button className="btn primary" onClick={onSave}>저장</button>
        </div>
      </section>
    </div>
  )
}
