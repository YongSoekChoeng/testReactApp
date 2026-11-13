// 서버 API 를 부르는 fetch 래퍼. 모든 주소 앞에 /api 가 붙는다.
// 401(로그인 안 됨)이면 로그인 화면으로 보내고, 오류 메시지는 서버가 준 message 를 쓴다.

const API_BASE = '/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type Params = Record<string, string | number | undefined | null>

function toQuery(params?: Params): string {
  if (!params) {
    return ''
  }
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, String(value))
    }
  }
  const text = qs.toString()
  return text ? '?' + text : ''
}

async function request<T>(method: string, path: string, body?: unknown, params?: Params): Promise<T> {
  const res = await fetch(API_BASE + path + toQuery(params), {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  if (res.status === 401 && window.location.pathname !== '/login') {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
  }
  if (!res.ok) {
    let message = res.statusText
    try {
      const data = await res.json()
      if (data && data.message) {
        message = data.message
      }
    } catch {
      // 본문이 JSON 이 아니면 상태 글자를 쓴다
    }
    throw new ApiError(res.status, message)
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const apiClient = {
  get<T>(path: string, params?: Params): Promise<T> {
    return request<T>('GET', path, undefined, params)
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, body ?? {})
  },
  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, body ?? {})
  },
  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path)
  }
}
