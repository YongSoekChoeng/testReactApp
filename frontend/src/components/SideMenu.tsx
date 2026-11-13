import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router'
import { authService } from '@/services/authService'
import type { Menu } from '@/types'

// 왼쪽 메뉴. 메뉴 주소(menuUrl)가 곧 화면 주소다.
interface MenuNode extends Menu {
  children: MenuNode[]
}

export default function SideMenu() {
  const [menus, setMenus] = useState<Menu[]>([])

  useEffect(() => {
    authService.menus().then(setMenus)
  }, [])

  const tree = useMemo(() => {
    const byId: Record<string, MenuNode> = {}
    const roots: MenuNode[] = []
    for (const m of menus) {
      byId[m.menuId] = { ...m, children: [] }
    }
    for (const m of menus) {
      if (m.prntMenuId && byId[m.prntMenuId]) {
        byId[m.prntMenuId].children.push(byId[m.menuId])
      } else {
        roots.push(byId[m.menuId])
      }
    }
    return roots
  }, [menus])

  return (
    <nav className="side">
      {tree.map((group) => (
        <div key={group.menuId} className="menu-group">
          <div className="menu-title">{group.menuNm}</div>
          {group.children.map((item) => (
            <NavLink key={item.menuId} to={item.menuUrl} className="menu-item">
              {item.menuNm}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}
