// 서버 API 가 주고받는 모양

export interface LoginUser {
  mbId: string
  mbNm: string
  empCd: string
  empNm: string
  loginId: string
}

export interface Menu {
  menuId: string
  prntMenuId: string | null
  menuNm: string
  menuUrl: string
  menuLvl: number
}

export interface CodeGroup {
  grpCmmCd: string
  grpCmmCdNm: string
  grpCmmCdDesc: string
  systemGubun: string
  sortNo: number
}

export interface Code {
  grpCmmCd?: string
  cdVl: string
  cdVlNm: string
  useYn: string
  sortNo: number
}

export interface Member {
  mbId: string
  mbNm: string
  representNm: string
  telno: string
  contFrymd: string
  contToymd: string
  useYn: string
  memo: string
}

export interface LoginHist {
  loginDtm: string
  mbId: string
  loginId: string
  empNm: string
  loginIp: string
}

export interface Board {
  seq?: number
  title: string
  content?: string
  writerNm: string
  inDtm?: string
}
