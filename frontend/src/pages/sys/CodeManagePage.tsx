import { useEffect, useState } from 'react'
import PageTitle from '@/components/PageTitle'
import DataGrid, { type Column } from '@/components/DataGrid'
import { codeService } from '@/services/codeService'
import { useCommonCode } from '@/hooks/useCommonCode'
import type { Code, CodeGroup } from '@/types'

// 공통코드관리. 왼쪽은 코드그룹, 오른쪽은 고른 그룹의 코드.
const emptyGroup = (): CodeGroup => ({ grpCmmCd: '', grpCmmCdNm: '', grpCmmCdDesc: '', systemGubun: '', sortNo: 0 })
const emptyCode = (): Code => ({ cdVl: '', cdVlNm: '', useYn: 'Y', sortNo: 0 })

const groupColumns: Column<CodeGroup>[] = [
  { key: 'grpCmmCd', label: '그룹코드', width: '30%' },
  { key: 'grpCmmCdNm', label: '그룹명' },
  { key: 'systemGubun', label: '시스템', width: '15%' },
  { key: 'sortNo', label: '정렬', width: '10%' }
]
const codeColumns: Column<Code>[] = [
  { key: 'cdVl', label: '코드값', width: '25%' },
  { key: 'cdVlNm', label: '코드명' },
  { key: 'useYn', label: '사용', width: '12%' },
  { key: 'sortNo', label: '정렬', width: '10%' }
]

export default function CodeManagePage() {
  const useYnCodes = useCommonCode('USE_YN')
  const [keyword, setKeyword] = useState('')
  const [groups, setGroups] = useState<CodeGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<CodeGroup | null>(null)
  const [groupForm, setGroupForm] = useState<CodeGroup>(emptyGroup())
  const [codes, setCodes] = useState<Code[]>([])
  const [selectedCode, setSelectedCode] = useState<Code | null>(null)
  const [codeForm, setCodeForm] = useState<Code>(emptyCode())

  async function searchGroups() {
    setGroups(await codeService.listGroups(keyword))
    newGroup()
  }

  async function selectGroup(row: CodeGroup) {
    setSelectedGroup(row)
    setGroupForm({ ...row })
    setCodes(await codeService.listCodes(row.grpCmmCd))
    newCode()
  }

  function newGroup() {
    setSelectedGroup(null)
    setGroupForm(emptyGroup())
    setCodes([])
    newCode()
  }

  function newCode() {
    setSelectedCode(null)
    setCodeForm(emptyCode())
  }

  async function saveGroup() {
    try {
      if (selectedGroup) {
        await codeService.updateGroup(groupForm)
      } else {
        await codeService.createGroup(groupForm)
      }
      alert('저장했습니다.')
      await searchGroups()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  async function removeGroup() {
    if (!selectedGroup || !confirm(`그룹 ${selectedGroup.grpCmmCd} 와 아래 코드를 모두 지울까요?`)) {
      return
    }
    await codeService.deleteGroup(selectedGroup.grpCmmCd)
    await searchGroups()
  }

  async function saveCode() {
    if (!selectedGroup) {
      return
    }
    try {
      if (selectedCode) {
        await codeService.updateCode(selectedGroup.grpCmmCd, codeForm)
      } else {
        await codeService.createCode(selectedGroup.grpCmmCd, codeForm)
      }
      setCodes(await codeService.listCodes(selectedGroup.grpCmmCd))
      newCode()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  async function removeCode() {
    if (!selectedGroup || !selectedCode) {
      return
    }
    await codeService.deleteCode(selectedGroup.grpCmmCd, selectedCode.cdVl)
    setCodes(await codeService.listCodes(selectedGroup.grpCmmCd))
    newCode()
  }

  useEffect(() => {
    searchGroups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <PageTitle title="공통코드관리">
        <input value={keyword} placeholder="그룹코드/그룹명" onChange={(e) => setKeyword(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && searchGroups()} />
        <button className="btn" onClick={searchGroups}>조회</button>
      </PageTitle>

      <div className="split">
        <section className="panel">
          <h3>코드그룹</h3>
          <DataGrid columns={groupColumns} rows={groups} rowKey="grpCmmCd" selected={selectedGroup} onSelect={selectGroup} />
          <div className="form-grid">
            <label>그룹코드 <input value={groupForm.grpCmmCd} disabled={!!selectedGroup}
              onChange={(e) => setGroupForm({ ...groupForm, grpCmmCd: e.target.value })} /></label>
            <label>그룹명 <input value={groupForm.grpCmmCdNm ?? ''}
              onChange={(e) => setGroupForm({ ...groupForm, grpCmmCdNm: e.target.value })} /></label>
            <label>설명 <input value={groupForm.grpCmmCdDesc ?? ''}
              onChange={(e) => setGroupForm({ ...groupForm, grpCmmCdDesc: e.target.value })} /></label>
            <label>시스템구분 <input value={groupForm.systemGubun ?? ''}
              onChange={(e) => setGroupForm({ ...groupForm, systemGubun: e.target.value })} /></label>
            <label>정렬 <input type="number" value={groupForm.sortNo ?? 0}
              onChange={(e) => setGroupForm({ ...groupForm, sortNo: Number(e.target.value) })} /></label>
          </div>
          <div className="buttons">
            <button className="btn" onClick={newGroup}>신규</button>
            <button className="btn primary" onClick={saveGroup}>저장</button>
            <button className="btn danger" disabled={!selectedGroup} onClick={removeGroup}>삭제</button>
          </div>
        </section>

        <section className="panel">
          <h3>코드 {selectedGroup && <small>({selectedGroup.grpCmmCd})</small>}</h3>
          <DataGrid columns={codeColumns} rows={codes} rowKey="cdVl" selected={selectedCode}
            onSelect={(row) => { setSelectedCode(row); setCodeForm({ ...row }) }} />
          <div className="form-grid">
            <label>코드값 <input value={codeForm.cdVl} disabled={!!selectedCode}
              onChange={(e) => setCodeForm({ ...codeForm, cdVl: e.target.value })} /></label>
            <label>코드명 <input value={codeForm.cdVlNm ?? ''}
              onChange={(e) => setCodeForm({ ...codeForm, cdVlNm: e.target.value })} /></label>
            <label>사용여부
              <select value={codeForm.useYn} onChange={(e) => setCodeForm({ ...codeForm, useYn: e.target.value })}>
                {useYnCodes.map((c) => <option key={c.cdVl} value={c.cdVl}>{c.cdVlNm}</option>)}
              </select>
            </label>
            <label>정렬 <input type="number" value={codeForm.sortNo ?? 0}
              onChange={(e) => setCodeForm({ ...codeForm, sortNo: Number(e.target.value) })} /></label>
          </div>
          <div className="buttons">
            <button className="btn" disabled={!selectedGroup} onClick={newCode}>신규</button>
            <button className="btn primary" disabled={!selectedGroup} onClick={saveCode}>저장</button>
            <button className="btn danger" disabled={!selectedCode} onClick={removeCode}>삭제</button>
          </div>
        </section>
      </div>
    </div>
  )
}
