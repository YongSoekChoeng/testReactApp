import { Link } from 'react-router'
import PageTitle from '@/components/PageTitle'

export default function HomePage() {
  return (
    <div>
      <PageTitle title="홈" />
      <p>왼쪽 메뉴에서 화면을 고르세요.</p>
      <ul className="home-links">
        <li><Link to="/sys/codes">공통코드관리</Link></li>
        <li><Link to="/sys/members">회원사관리</Link></li>
        <li><Link to="/sys/login-hists">로그인이력</Link></li>
        <li><Link to="/sample/boards">샘플게시판</Link></li>
      </ul>
    </div>
  )
}
