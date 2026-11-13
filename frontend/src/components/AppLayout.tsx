import { useEffect } from 'react'
import { Link, Navigate, Outlet, useLocation, useMatches, useNavigate } from 'react-router'
import SideMenu from './SideMenu'
import { useAuth } from '@/hooks/useAuth'

// 상단(로고, 사용자, 로그아웃) + 왼쪽 메뉴 + 업무 화면. 로그인하지 않았으면 로그인 화면으로 보낸다.
export default function AppLayout() {
  const { user, checked, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()

  // 화면 이름(handle.title)을 브라우저 제목에 쓴다
  useEffect(() => {
    const last = matches[matches.length - 1]
    const handle = last ? (last.handle as { title?: string } | undefined) : undefined
    document.title = handle && handle.title ? `${handle.title} - testReact` : 'testReact'
  }, [matches])

  if (!checked) {
    return null
  }
  if (!user) {
    return <Navigate to={'/login?redirect=' + encodeURIComponent(location.pathname)} replace />
  }

  async function onLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="top">
        <Link to="/home" className="logo">
          testReact
        </Link>
        <div className="user">
          {user.mbNm} · {user.empNm}({user.loginId})
          <button className="btn" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </header>
      <div className="body">
        <SideMenu />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
