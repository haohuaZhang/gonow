import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

/**
 * 应用布局组件
 * 包含顶部 Header（GoNow logo + 导航）和主内容区域
 * 支持移动端适配（375px 宽度）
 *
 * 设计优化：
 * - Header：白色背景 + 底部渐变分割线
 * - Logo：品牌色圆形背景 + 白色 G 字母
 * - 导航链接：hover 时品牌色下划线（使用 nav-link class）
 * - 移动端菜单：滑入动画
 * - Footer：品牌感增强，更多信息
 */

/** 导航项配置 */
const navItems = [
  { label: '首页', path: '/' },
  { label: '目的地推荐', path: '/destination' },
  { label: '规划旅行', path: '/chat' },
  { label: '美食推荐', path: '/food' },
  { label: '我的行程', path: '/trip' },
  { label: '景点方案', path: '/scenic' },
]

/** 移动端导航菜单 - 滑入动画 */
function MobileNav() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors h-10 w-10 lg:hidden hover:bg-[var(--gonow-primary-light)]"
        style={{ color: 'var(--gonow-text)' }}
      >
        {/* 汉堡菜单图标 */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        <span className="sr-only">打开菜单</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <nav className="flex flex-col gap-2 mt-10 animate-slide-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="text-base font-medium transition-all duration-200 px-4 py-3 rounded-xl"
              style={{
                color: location.pathname === item.path
                  ? 'var(--gonow-primary)'
                  : 'var(--gonow-text-secondary)',
                backgroundColor: location.pathname === item.path
                  ? 'var(--gonow-primary-light)'
                  : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

/** 桌面端导航菜单 - hover 下划线效果（使用 nav-link class 替代 group-hover） */
function DesktopNav() {
  const location = useLocation()

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${!isActive ? 'nav-link' : ''}`}
            style={{
              color: isActive ? 'var(--gonow-primary)' : 'var(--gonow-text-secondary)',
              backgroundColor: isActive ? 'var(--gonow-primary-light)' : 'transparent',
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

/** 顶部 Header 组件 - 白色背景 + 底部渐变分割线 */
function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full header-gradient-border"
      style={{
        backgroundColor: 'var(--gonow-card)',
        boxShadow: 'var(--gonow-shadow-sm)',
      }}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-5xl">
        {/* Logo - 品牌色圆形背景 */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full text-white font-bold text-sm shadow-sm transition-transform duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
          >
            G
          </div>
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{ color: 'var(--gonow-text)' }}
          >
            GoNow
          </span>
        </Link>

        {/* 桌面端导航 */}
        <DesktopNav />

        {/* 移动端菜单按钮 */}
        <MobileNav />
      </div>
    </header>
  )
}

/** 主内容区域 */
function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="flex-1 container mx-auto px-4 max-w-5xl py-6"
      style={{ minHeight: 'calc(100vh - 3.5rem - 6rem)' }}
    >
      {children}
    </main>
  )
}

/** 底部 Footer - 增强品牌感 */
function Footer() {
  return (
    <footer
      className="pt-8 pb-6 text-center text-sm"
      style={{
        color: 'var(--gonow-text-muted)',
        backgroundColor: 'var(--gonow-card)',
      }}
    >
      {/* 顶部渐变分割线 */}
      <div
        className="h-px mb-8"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,53,0.15) 30%, rgba(255,107,53,0.3) 50%, rgba(255,107,53,0.15) 70%, transparent 100%)',
        }}
      />
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Logo + 品牌语 */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
          >
            G
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: 'var(--gonow-text)' }}
          >
            GoNow
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--gonow-text-secondary)' }}>
          GoNow 智能旅行规划助手 - 让每一次出发都值得期待
        </p>
        {/* 功能标签 */}
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          {['AI 智能规划', '红黑榜验证', '故事化美食', '多方案对比'].map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--gonow-primary-light)',
                color: 'var(--gonow-primary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {/* 版权 */}
        <p className="text-xs" style={{ color: 'var(--gonow-text-muted)', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} GoNow. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/** 应用布局根组件 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: 'var(--gonow-bg)' }}>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  )
}
