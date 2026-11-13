import { apiClient } from '@/lib/apiClient'
import type { LoginUser, Menu } from '@/types'

// 로그인/로그아웃, 내 정보, 메뉴
export const authService = {
  login(form: { mbId: string; loginId: string; password: string }) {
    return apiClient.post<LoginUser>('/auth/login', form)
  },
  logout() {
    return apiClient.post<void>('/auth/logout')
  },
  me() {
    return apiClient.get<LoginUser | undefined>('/auth/me')
  },
  menus() {
    return apiClient.get<Menu[]>('/menus')
  }
}
