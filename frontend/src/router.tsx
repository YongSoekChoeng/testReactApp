import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from '@/components/AppLayout'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import CodeManagePage from '@/pages/sys/CodeManagePage'
import MemberManagePage from '@/pages/sys/MemberManagePage'
import LoginHistPage from '@/pages/sys/LoginHistPage'
import BoardListPage from '@/pages/sample/BoardListPage'
import BoardDetailPage from '@/pages/sample/BoardDetailPage'
import BoardFormPage from '@/pages/sample/BoardFormPage'

// 화면 주소. handle.title 이 화면 이름이다. 메뉴(TBSY_RESOURCE.RESOURCE_URL)도 이 path 를 쓴다.
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, handle: { title: '로그인' } },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage />, handle: { title: '홈' } },
      { path: 'sys/codes', element: <CodeManagePage />, handle: { title: '공통코드관리' } },
      { path: 'sys/members', element: <MemberManagePage />, handle: { title: '회원사관리' } },
      { path: 'sys/login-hists', element: <LoginHistPage />, handle: { title: '로그인이력' } },
      { path: 'sample/boards', element: <BoardListPage />, handle: { title: '샘플게시판' } },
      { path: 'sample/boards/new', element: <BoardFormPage />, handle: { title: '게시글 쓰기' } },
      { path: 'sample/boards/:seq', element: <BoardDetailPage />, handle: { title: '게시글 보기' } },
      { path: 'sample/boards/:seq/edit', element: <BoardFormPage />, handle: { title: '게시글 고치기' } }
    ]
  },
  { path: '*', element: <Navigate to="/home" replace /> }
])
